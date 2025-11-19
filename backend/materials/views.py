from rest_framework import generics, permissions, status, serializers
from .models import Material
from .serializers import MaterialSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, HttpResponseRedirect
from rest_framework.decorators import api_view, permission_classes
from django.db.models import F, Q
from django.conf import settings
import os
import logging
import boto3

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
        
        try:
            material = serializer.save(uploaded_by=user)
            storage = material.file.storage if material.file else None
            is_s3 = storage and 'S3' in storage.__class__.__name__
            storage_type = "S3" if is_s3 else "local"
            logger.info(f"Material uploaded: {material.title} (ID: {material.id}) to {storage_type} storage")
            if is_s3:
                logger.info(f"S3 key: {material.file.name}")
        except Exception as e:
            logger.error(f"Failed to upload material: {e}", exc_info=True)
            raise serializers.ValidationError({"file": f"Upload failed: {str(e)}"})


def generate_s3_presigned_url(file_name, expiration=3600):
    """Generate a presigned URL for S3 object download."""
    logger = logging.getLogger(__name__)
    try:
        from botocore.client import Config
        from botocore.exceptions import ClientError, NoCredentialsError
        
        # Validate inputs
        if not file_name:
            logger.error("generate_s3_presigned_url called with empty file_name")
            return None
        
        access_key = getattr(settings, 'AWS_ACCESS_KEY_ID', None)
        secret_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
        bucket = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None)
        region = getattr(settings, 'AWS_S3_REGION_NAME', 'us-east-1')
        
        if not access_key or not secret_key:
            logger.error("AWS credentials not configured (AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY missing)")
            return None
        
        if not bucket:
            logger.error("AWS_STORAGE_BUCKET_NAME not configured")
            return None
        
        logger.debug(f"Generating presigned URL for S3 key: {file_name} in bucket: {bucket}")
        
        s3_client = boto3.client(
            's3',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version='s3v4')
        )
        
        filename = os.path.basename(file_name)
        
        # Generate presigned URL
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket,
                'Key': file_name,
                'ResponseContentDisposition': f'attachment; filename="{filename}"'
            },
            ExpiresIn=expiration
        )
        logger.info(f"Successfully generated presigned URL for {file_name}")
        return url
    except NoCredentialsError:
        logger.error("AWS credentials not found or invalid", exc_info=True)
        return None
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        logger.error(f"S3 ClientError ({error_code}) generating presigned URL for {file_name}: {e}", exc_info=True)
        return None
    except Exception as e:
        logger.error(f"Unexpected error generating presigned URL for {file_name}: {e}", exc_info=True)
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
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def material_download_view(request, pk):
    """
    Production-ready download endpoint.
    - For public materials: allows authenticated and anonymous users
    - For private materials: requires authentication and ownership
    - Returns presigned S3 URL (cloud) or serves file directly (local)
    - Always returns downloadable file with Content-Disposition: attachment
    """
    logger = logging.getLogger(__name__)
    
    # Fetch material
    try:
        material = Material.objects.select_related('uploaded_by', 'unit').get(pk=pk)
    except Material.DoesNotExist:
        return Response({"detail": "Material not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check permissions - only restrict for private materials
    if not material.is_public:
        # Private materials require authentication
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required to download this material."}, status=status.HTTP_401_UNAUTHORIZED)
        # Check ownership/staff permissions
        if not (request.user.is_staff or request.user.is_superuser or material.uploaded_by == request.user):
            return Response({"detail": "You do not have permission to download this material."}, status=status.HTTP_403_FORBIDDEN)

    # Verify file exists
    if not material.file:
        return Response({"detail": "This material has no file attached."}, status=status.HTTP_404_NOT_FOUND)

    # Increment download count asynchronously
    Material.objects.filter(pk=pk).update(download_count=F("download_count") + 1)

    # Get storage backend
    storage = material.file.storage
    is_s3 = 'S3' in storage.__class__.__name__

    # Extract clean filename
    filename = os.path.basename(material.file.name)
    
    # Log storage type and file key
    logger.info(f"Download request for Material {pk}: {filename} (storage: {'S3' if is_s3 else 'local'}, key: {material.file.name})")

    # S3: Return presigned URL (optionally redirect immediately)
    if is_s3:
        try:
            # Verify file exists in S3 before generating presigned URL
            if not storage.exists(material.file.name):
                logger.error(f"S3 key not found: {material.file.name} for Material {pk}")
                return Response({
                    "detail": f"File not found in S3 storage. Key: {material.file.name}"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Generate presigned URL with proper content disposition
            presigned_url = generate_s3_presigned_url(material.file.name, expiration=3600)
            if presigned_url:
                logger.info(f"Download: Material {pk} ({filename}) - S3 presigned URL generated successfully")
                # If redirect requested, issue a 302 to the presigned URL for instant download
                redirect_param = request.query_params.get('redirect') or request.query_params.get('r')
                if redirect_param and redirect_param.lower() in ("1", "true", "yes"): 
                    return HttpResponseRedirect(presigned_url)

                # Default: return JSON for clients that want to handle it
                return Response({
                    "download_url": presigned_url,
                    "filename": filename,
                    "content_type": material.file_type or "application/octet-stream"
                }, status=status.HTTP_200_OK)
            
            # If presigned generation failed, try storage.url as fallback
            logger.warning(f"Presigned URL generation failed for Material {pk}, trying storage.url fallback")
            try:
                presigned_url = storage.url(material.file.name)
                logger.info(f"Download: Material {pk} ({filename}) - Using storage.url fallback")
                return Response({
                    "download_url": presigned_url,
                    "filename": filename,
                    "content_type": material.file_type or "application/octet-stream"
                }, status=status.HTTP_200_OK)
            except Exception as fallback_error:
                logger.error(f"storage.url fallback also failed for Material {pk}: {fallback_error}", exc_info=True)
                return Response({
                    "detail": "Failed to generate download link. Please check S3 configuration."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"Failed to generate presigned URL for material {pk}: {e}", exc_info=True)
            return Response({"detail": f"Failed to generate download link: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Local: Serve file directly with proper headers
    try:
        if not storage.exists(material.file.name):
            return Response({"detail": "File not found in storage."}, status=status.HTTP_404_NOT_FOUND)

        # Determine content type based on file extension
        content_type_map = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'mp4': 'video/mp4',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime',
        }
        content_type = content_type_map.get(material.file_type, 'application/octet-stream')

        # Open and read file
        file_handle = material.file.open('rb')
        
        # Create FileResponse with proper headers
        response = FileResponse(file_handle, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['Content-Length'] = material.file.size
        
        logger.info(f"Download (local): Material {pk} ({filename})")
        return response
        
    except Exception as e:
        logger.error(f"Download error for material {pk}: {e}")
        return Response({"detail": "Error downloading file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)