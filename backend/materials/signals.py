"""
Signal handlers for the materials app.
Automatically clean up files when Material objects are deleted or updated.
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import Material
import logging

logger = logging.getLogger(__name__)


@receiver(pre_delete, sender=Material)
def delete_material_file(sender, instance, **kwargs):
    """
    Delete the file from storage when a Material object is deleted.
    This prevents orphaned files from accumulating in S3 or local storage.
    """
    if instance.file:
        try:
            # Check if file exists before attempting deletion
            if instance.file.storage.exists(instance.file.name):
                instance.file.delete(save=False)
                logger.info(f"Deleted file {instance.file.name} for Material {instance.id}")
            else:
                logger.warning(f"File {instance.file.name} not found in storage for Material {instance.id}")
        except Exception as e:
            logger.error(f"Error deleting file {instance.file.name}: {e}", exc_info=True)


@receiver(pre_save, sender=Material)
def delete_old_file_on_update(sender, instance, **kwargs):
    """
    Delete old file when Material file is replaced with a new one.
    This prevents orphaned files when users upload a replacement file.
    """
    if not instance.pk:
        return  # New instance, no old file to delete
    
    try:
        old_instance = Material.objects.get(pk=instance.pk)
        old_file = old_instance.file
        new_file = instance.file
        
        # If file has changed, delete the old one
        if old_file and new_file and old_file.name != new_file.name:
            if old_file.storage.exists(old_file.name):
                old_file.delete(save=False)
                logger.info(f"Deleted old file {old_file.name} for Material {instance.id}")
            else:
                logger.warning(f"Old file {old_file.name} not found in storage for Material {instance.id}")
    except Material.DoesNotExist:
        pass  # Old instance doesn't exist, nothing to clean up
    except Exception as e:
        logger.error(f"Error deleting old file for Material {instance.pk}: {e}", exc_info=True)
