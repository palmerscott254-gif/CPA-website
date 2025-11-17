from rest_framework import generics, permissions, status, serializers
from .models import Material
from .serializers import MaterialSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from rest_framework.decorators import api_view, permission_classes
from django.db.models import F, Q
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
import os
import logging
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

class MaterialListView(generics.ListAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Material.objects.filter(is_public=True).order_by("-download_count")
        unit = self.request.query_params.get("unit")
        search = self.request.query_params.get("search")
        if unit:
            qs = qs.filter(unit__id=unit)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        sort = self.request.query_params.get("sort")
        if sort == "downloads":
            qs = qs.order_by("-download_count")
        elif sort == "title":
            qs = qs.order_by("title")
        elif sort == "date":
            qs = qs.order_by("-upload_date")
        return qs


class MaterialCreateView(generics.CreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        user = self.request.user
        uploaded_file = self.request.FILES.get("file")
        if uploaded_file:
            ext = uploaded_file.name.split(".")[-1].lower()
            allowed_extensions = ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "avi", "mov"]
            if ext not in allowed_extensions:
                raise serializers.ValidationError({"file": f"Only {', '.join(allowed_extensions)} files are allowed."})
            if uploaded_file.size > 50 * 1024 * 1024:  # 50MB limit
                raise serializers.ValidationError({"file": "Max size 50MB."})
        serializer.save(uploaded_by=user)


def generate_s3_presigned_url(file_name, expiration=3600):
    """
    Generate a presigned URL for an S3 object using boto3 client directly.
    This is a fallback method if storage.url() doesn't work.
    
    Args:
        file_name: The S3 object key (path within bucket)
        expiration: Time in seconds for the URL to remain valid
    
    Returns:
        str: Presigned URL or None if generation fails
    """
    logger = logging.getLogger(__name__)
    
    try:
        # Get AWS credentials and bucket from settings
        bucket_name = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None)
        region = getattr(settings, 'AWS_S3_REGION_NAME', 'us-east-1')
        access_key = getattr(settings, 'AWS_ACCESS_KEY_ID', None)
        secret_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
        
        if not all([bucket_name, access_key, secret_key]):
            logger.error("AWS credentials or bucket name not configured")
            return None
        
        # Create S3 client
        s3_client = boto3.client(
            's3',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )
        
        # Extract filename for content disposition
        filename = os.path.basename(file_name)
        
        # Generate presigned URL
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket_name,
                'Key': file_name,
                'ResponseContentDisposition': f'attachment; filename="{filename}"'
            },
            ExpiresIn=expiration
        )
        
        logger.info(f"Generated presigned URL via boto3 client for: {file_name}")
        return presigned_url
        
    except NoCredentialsError:
        logger.error("AWS credentials not found")
        return None
    except ClientError as e:
        logger.error(f"S3 ClientError generating presigned URL: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error generating presigned URL: {e}", exc_info=True)
        return None


class MaterialDetailView(generics.RetrieveDestroyAPIView):
    """Retrieve or delete a single material.
    GET is allowed for public materials or those owned by the user.
    DELETE requires owner/staff/superuser.
    """
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return Material.objects.all()
        if user.is_authenticated:
            return Material.objects.filter(Q(is_public=True) | Q(uploaded_by=user))
        return Material.objects.filter(is_public=True)

    def perform_destroy(self, instance):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("Authentication required to delete material.")
        if not (user.is_staff or user.is_superuser or instance.uploaded_by == user):
            raise PermissionDenied("You do not have permission to delete this material.")
        instance.delete()


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def material_download_view(request, pk):
    """
    Download endpoint that requires authentication.
    Returns a temporary presigned S3 URL for authenticated users.
    Returns 401 if unauthenticated, 403 if not allowed, 404 if material not found.
    """
    logger = logging.getLogger(__name__)
    
    # Get material or return 404
    try:
        material = Material.objects.get(pk=pk)
    except Material.DoesNotExist:
        logger.warning(f"Material with pk={pk} not found (requested by user {request.user.id})")
        return Response(
            {"detail": "Material not found."}, 
            status=status.HTTP_404_NOT_FOUND
        )

    # Check permissions: public materials are accessible to all authenticated users
    # Private materials require staff/superuser or uploader permissions
    if not material.is_public:
        if not (request.user.is_staff or request.user.is_superuser or material.uploaded_by == request.user):
            logger.warning(f"User {request.user.id} attempted unauthorized access to material {material.pk}")
            return Response(
                {"detail": "You do not have permission to download this material."}, 
                status=status.HTTP_403_FORBIDDEN
            )

    # Verify the file field is not empty
    if not material.file or not material.file.name:
        logger.error(f"Material {material.pk} has no file attached")
        return Response(
            {"detail": "This material has no file attached."}, 
            status=status.HTTP_404_NOT_FOUND
        )

    # Increment download count
    Material.objects.filter(pk=material.pk).update(download_count=F("download_count") + 1)

    # Attempt to generate S3 presigned URL
    try:
        storage = getattr(material.file, 'storage', None)
        storage_class = storage.__class__.__name__ if storage else 'Unknown'

        # Detect S3 storage without importing the class directly
        # S3Boto3Storage typically has a 'bucket' attribute and class name contains 'S3Boto3Storage'
        is_s3_storage = (
            storage is not None and (
                hasattr(storage, 'bucket') or 'S3Boto3Storage' in storage_class
            )
        )

        if is_s3_storage:
            # Extract clean filename for download
            filename = os.path.basename(material.file.name)
            
            # Try Method 1: Generate presigned URL via storage backend
            try:
                signed_url = storage.url(
                    material.file.name,
                    parameters={'ResponseContentDisposition': f'attachment; filename="{filename}"'},
                    expire=3600,  # URL valid for 1 hour
                )
                
                logger.info(
                    f"Generated presigned S3 URL via storage for material {material.pk} (user: {request.user.id}, file: {filename})"
                )
                return Response({"download_url": signed_url}, status=status.HTTP_200_OK)
            except Exception as storage_error:
                logger.warning(
                    f"storage.url() failed for material {material.pk}: {storage_error}. Trying boto3 fallback..."
                )
                
                # Try Method 2: Generate presigned URL via boto3 client directly
                signed_url = generate_s3_presigned_url(material.file.name, expiration=3600)
                if signed_url:
                    logger.info(
                        f"Generated presigned S3 URL via boto3 for material {material.pk} (user: {request.user.id}, file: {filename})"
                    )
                    return Response({"download_url": signed_url}, status=status.HTTP_200_OK)
                else:
                    logger.error(f"Both storage.url() and boto3 methods failed for material {material.pk}")
                    # Fall through to local file serving
        else:
            logger.info(f"Storage is not S3 ({storage_class}), falling back to local file serving")
    except Exception as e:
        logger.error(
            f"Error generating presigned URL for material {material.pk} using {storage_class}: {e}",
            exc_info=True
        )
        # Fall through to local file serving if storage isn't S3-compatible
    
    # Local file storage fallback (for development or legacy files)
    try:
        if not material.file.storage.exists(material.file.name):
            logger.error(f"File does not exist in storage for material {material.pk}: {material.file.name}")
            return Response({"detail": "File not found in storage."}, status=status.HTTP_404_NOT_FOUND)

        from io import BytesIO
        filename = os.path.basename(material.file.name)
        # Read file content into memory so Windows file lock is released immediately
        with material.file.open('rb') as fh:
            data = fh.read()
        response = FileResponse(BytesIO(data), as_attachment=True, filename=filename)
        logger.info(f"Serving local file download for material {material.pk}: {filename}")
        return response
    except FileNotFoundError:
        logger.error(f"File not found for material {material.pk}: {material.file.name}")
        return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error serving file for material {material.pk}: {e}", exc_info=True)
        return Response({"detail": "Error serving file. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)