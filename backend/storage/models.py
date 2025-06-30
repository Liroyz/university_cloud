from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import os
import time
from minio_storage.storage import MinioMediaStorage

def file_upload_path(instance, filename):
    """Generate file path for MinIO storage"""
    import time
    timestamp = int(time.time())
    # Use a default user ID if uploaded_by is not set (for development)
    user_id = instance.uploaded_by.id if instance.uploaded_by else 'default'
    # Clean filename to avoid issues with special characters
    clean_filename = filename.replace(' ', '_').replace('/', '_').replace('\\', '_')
    return f'uploads/{user_id}/{timestamp}_{clean_filename}'

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Administrator'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class Course(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name

class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title

class File(models.Model):
    FILE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('archive', 'Archive'),
        ('other', 'Other'),
    ]
    
    file = models.FileField(upload_to=file_upload_path, storage=MinioMediaStorage())
    original_filename = models.CharField(max_length=255, null=True)
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES, default='other')
    file_size = models.BigIntegerField(default=0)  # Size in bytes
    mime_type = models.CharField(max_length=100, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    assignment = models.ForeignKey(Assignment, on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    is_public = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.original_filename or self.file.name if self.file else 'Unnamed File'

    def save(self, *args, **kwargs):
        if not self.original_filename and self.file:
            self.original_filename = os.path.basename(self.file.name)
        
        if not self.file_size and self.file:
            try:
                # For MinIO storage, we need to handle this differently
                if hasattr(self.file, 'size'):
                    self.file_size = self.file.size
                else:
                    # Try to get size from storage
                    try:
                        self.file_size = self.file.storage.size(self.file.name)
                    except:
                        self.file_size = 0
            except:
                self.file_size = 0
        
        if not self.mime_type and self.file:
            try:
                import mimetypes
                filename = self.original_filename or self.file.name
                self.mime_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            except:
                self.mime_type = 'application/octet-stream'
        
        # Determine file type based on extension
        if not self.file_type or self.file_type == 'other':
            if self.original_filename:
                ext = os.path.splitext(self.original_filename)[1].lower()
                if ext in ['.pdf', '.doc', '.docx', '.txt', '.rtf']:
                    self.file_type = 'document'
                elif ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']:
                    self.file_type = 'image'
                elif ext in ['.mp4', '.avi', '.mov', '.wmv', '.flv']:
                    self.file_type = 'video'
                elif ext in ['.mp3', '.wav', '.flac', '.aac']:
                    self.file_type = 'audio'
                elif ext in ['.zip', '.rar', '.7z', '.tar', '.gz']:
                    self.file_type = 'archive'
        
        super().save(*args, **kwargs)

    def get_file_size_display(self):
        """Return human readable file size"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
