import logging
import time
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import os
import mimetypes
from minio_storage.storage import MinioMediaStorage


logger = logging.getLogger(__name__)

def file_upload_path(instance, filename):
    """
    Генерирует путь для загрузки файла в MinIO хранилище.
    
    Args:
        instance: Экземпляр модели File
        filename (str): Исходное имя файла
        
    Returns:
        str: Путь для сохранения файла в формате 'uploads/{user_id}/{timestamp}_{filename}'
    """
    try:
        timestamp = int(time.time())
        user_id = instance.uploaded_by.id if instance.uploaded_by else 'default'
        clean_filename = filename.replace(' ', '_').replace('/', '_').replace('\\', '_')
        return f'uploads/{user_id}/{timestamp}_{clean_filename}'
    except Exception as e:
        logger.error(f"Error generating file path: {str(e)}", exc_info=True)
        return f'uploads/default/{int(time.time())}_{filename}'

class User(AbstractUser):
    """
    Модель пользователя с расширенными полями.
    Наследуется от AbstractUser Django и добавляет дополнительные поля.
    """
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
        """Строковое представление пользователя в формате 'Имя Фамилия (роль)'"""
        return f"{self.first_name} {self.last_name} ({self.role})"

    @property
    def full_name(self):
        """Возвращает полное имя пользователя"""
        return f"{self.first_name} {self.last_name}"

class Course(models.Model):
    """
    Модель курса, который ведет преподаватель.
    Связана с моделью User через ForeignKey.
    """
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name

class Assignment(models.Model):
    """
    Модель задания для курса.
    Связана с моделью Course через ForeignKey.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title

class File(models.Model):
    """
    Модель файла с метаданными.
    Поддерживает различные типы файлов и хранит их в MinIO.
    """
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
        verbose_name = 'File'
        verbose_name_plural = 'Files'

    def __str__(self):
        """Строковое представление файла (оригинальное имя или путь)"""
        return self.original_filename or self.file.name if self.file else 'Unnamed File'

    def save(self, *args, **kwargs):
        """
        Переопределенный метод save для автоматического заполнения метаданных файла.
        Обрабатывает:
        - оригинальное имя файла
        - размер файла
        - MIME-тип
        - тип файла (по расширению)
        """
        try:
            # Сохраняем оригинальное имя файла
            if not self.original_filename and self.file:
                self.original_filename = os.path.basename(self.file.name)
                logger.info(f"Set original filename to {self.original_filename}")
            
            # Определяем размер файла
            if not self.file_size and self.file:
                try:
                    if hasattr(self.file, 'size'):
                        self.file_size = self.file.size
                    else:
                        self.file_size = self.file.storage.size(self.file.name)
                    logger.debug(f"File size determined: {self.file_size} bytes")
                except Exception as e:
                    self.file_size = 0
                    logger.warning(f"Could not determine file size: {str(e)}")
            
            # Определяем MIME-тип
            if not self.mime_type and self.file:
                try:
                    filename = self.original_filename or self.file.name
                    self.mime_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
                    logger.debug(f"Detected MIME type: {self.mime_type}")
                except Exception as e:
                    self.mime_type = 'application/octet-stream'
                    logger.warning(f"Could not detect MIME type: {str(e)}")
            
            # Определяем тип файла по расширению
            if not self.file_type or self.file_type == 'other':
                if self.original_filename:
                    try:
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
                        logger.debug(f"Detected file type: {self.file_type}")
                    except Exception as e:
                        logger.warning(f"Could not detect file type: {str(e)}")
                        self.file_type = 'other'
            
            super().save(*args, **kwargs)
            logger.info(f"File {self.id} saved successfully")
            
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}", exc_info=True)
            raise

    def get_file_size_display(self):
        """
        Возвращает размер файла в удобочитаемом формате (KB, MB, GB и т.д.)
        
        Returns:
            str: Размер файла с единицей измерения
        """
        try:
            size = self.file_size
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024.0:
                    return f"{size:.1f} {unit}"
                size /= 1024.0
            return f"{size:.1f} TB"
        except Exception as e:
            logger.error(f"Error formatting file size: {str(e)}")
            return "0 B"