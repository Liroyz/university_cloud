from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User as AuthUser
from .models import User, Course, Assignment, File
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    CourseSerializer, AssignmentSerializer, FileSerializer, FileUploadSerializer)
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import logging

# Получаем логгер для приложения storage
logger = logging.getLogger('storage')

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
        
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"New user registered: {user.username} (ID: {user.id})")
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        logger.warning(f"Failed registration attempt with data: {request.data.get('username', 'unknown')}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            logger.info(f"User logged in: {user.username} (ID: {user.id})")
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            })
        logger.warning(f"Failed login attempt for username: {request.data.get('username', 'unknown')}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            user_info = f"User ID: {request.user.id}" if request.user.is_authenticated else "Anonymous"
            logger.info(f"User logged out: {user_info}")
            return Response({'message': 'Successfully logged out'})
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'])
    def refresh(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                logger.warning("Token refresh attempt without refresh token")
                return Response({'error': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            refresh = RefreshToken(refresh_token)
            user_info = f"User ID: {request.user.id}" if request.user.is_authenticated else "Unknown"
            
            if getattr(settings, 'SIMPLE_JWT', {}).get('ROTATE_REFRESH_TOKENS', False):
                new_refresh = refresh.rotate()
                logger.info(f"Token refreshed with rotation: {user_info}")
                return Response({
                    'access': str(new_refresh.access_token),
                    'refresh': str(new_refresh),
                })
            else:
                logger.info(f"Token refreshed: {user_info}")
                
            return Response({
                'access': str(refresh.access_token),
            })
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return Response({'error': f'Invalid refresh token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
        
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user profile"""
        logger.info(f"Profile accessed by user: {request.user.username} (ID: {request.user.id})")
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
        
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Profile updated by user: {request.user.username} (ID: {request.user.id})")
            return Response(serializer.data)
        logger.warning(f"Profile update failed for user: {request.user.username} (ID: {request.user.id})")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
        
    def perform_create(self, serializer):
        course = serializer.save(teacher=self.request.user)
        logger.info(f"Course created: '{course.title}' (ID: {course.id}) by teacher: {self.request.user.username}")
    
    def perform_update(self, serializer):
        course = serializer.save()
        logger.info(f"Course updated: '{course.title}' (ID: {course.id}) by user: {self.request.user.username}")
    
    def perform_destroy(self, instance):
        logger.info(f"Course deleted: '{instance.title}' (ID: {instance.id}) by user: {self.request.user.username}")
        instance.delete()
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Course.objects.filter(teacher=user)
        else:
            return Course.objects.all()  # Students can see all courses

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        assignment = serializer.save()
        logger.info(f"Assignment created: '{assignment.title}' (ID: {assignment.id}) for course: {assignment.course.title} by user: {self.request.user.username}")
    
    def perform_update(self, serializer):
        assignment = serializer.save()
        logger.info(f"Assignment updated: '{assignment.title}' (ID: {assignment.id}) by user: {self.request.user.username}")
    
    def perform_destroy(self, instance):
        logger.info(f"Assignment deleted: '{instance.title}' (ID: {instance.id}) from course: {instance.course.title} by user: {self.request.user.username}")
        instance.delete()
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Assignment.objects.filter(course_id=course_id)
        return Assignment.objects.all()

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
        
    def get_serializer_class(self):
        """Use FileUploadSerializer for create/update operations"""
        if self.action in ['create', 'update', 'partial_update']:
            return FileUploadSerializer
        return FileSerializer
        
    def get_queryset(self):
        """Return files for the current user"""
        return File.objects.filter(uploaded_by=self.request.user)
        
    def perform_create(self, serializer):
        """Set the uploaded_by field to the current user"""
        file_obj = serializer.save(uploaded_by=self.request.user)
        file_size_mb = file_obj.file_size / (1024 * 1024) if file_obj.file_size else 0
        logger.info(f"File uploaded: '{file_obj.original_filename}' (ID: {file_obj.id}, Size: {file_size_mb:.2f}MB) by user: {self.request.user.username}")
    
    def perform_update(self, serializer):
        file_obj = serializer.save()
        logger.info(f"File updated: '{file_obj.original_filename}' (ID: {file_obj.id}) by user: {self.request.user.username}")
    
    def perform_destroy(self, instance):
        logger.info(f"File deleted: '{instance.original_filename}' (ID: {instance.id}) by user: {self.request.user.username}")
        instance.delete()
        
    @action(detail=False, methods=['get'])
    def my_files(self, request):
        """Get files uploaded by the current user"""
        files = self.get_queryset()
        logger.info(f"User {request.user.username} accessed their files list ({files.count()} files)")
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def shared_files(self, request):
        """Get public files"""
        files = File.objects.filter(is_public=True).order_by('-uploaded_at')
        logger.info(f"User {request.user.username} accessed shared files list ({files.count()} files)")
        
        # Add pagination
        page = self.paginate_queryset(files)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Get download URL for a file"""
        file_obj = self.get_object()
        if file_obj.file:
            # Check if user has permission to download this file
            if file_obj.uploaded_by == request.user or file_obj.is_public:
                # Получаем presigned URL для Minio
                url = file_obj.file.storage.url(file_obj.file.name)
                logger.info(f"File download initiated: '{file_obj.original_filename}' (ID: {file_obj.id}) by user: {request.user.username}")
                return Response({
                    'download_url': url,
                    'filename': file_obj.original_filename or file_obj.file.name,
                    'file_size': file_obj.file_size,
                    'mime_type': file_obj.mime_type
                })
            else:
                logger.warning(f"Unauthorized download attempt: '{file_obj.original_filename}' (ID: {file_obj.id}) by user: {request.user.username}")
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        logger.error(f"Download attempt for non-existent file (ID: {pk}) by user: {request.user.username}")
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

class StorageViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
        
    @action(detail=False, methods=['get'])
    def info(self, request):
        """Get storage information for current user"""
        try:
            # Получаем все файлы пользователя
            user_files = File.objects.filter(uploaded_by=request.user)
                        
            # Вычисляем общий размер файлов пользователя
            total_used = sum(file.file_size for file in user_files if file.file_size)
                        
            # Лимит хранилища (10 GB в байтах)
            storage_limit = 10 * 1024 * 1024 * 1024
                        
            # Вычисляем процент использования
            used_percentage = (total_used / storage_limit) * 100 if storage_limit > 0 else 0
            
            used_mb = total_used / (1024 * 1024)
            logger.info(f"Storage info accessed by user: {request.user.username} (Used: {used_mb:.2f}MB, {used_percentage:.1f}%)")
                        
            return Response({
                'used': total_used,
                'total': storage_limit,
                'used_percentage': round(used_percentage, 2)
            })
        except Exception as e:
            logger.error(f"Error getting storage info for user {request.user.username}: {str(e)}")
            return Response({
                'used': 0,
                'total': 10 * 1024 * 1024 * 1024,
                'used_percentage': 0
            })
        
    @action(detail=False, methods=['get'])
    def cache_info(self, request):
        """Get cache information"""
        try:
            logger.info(f"Cache info accessed by user: {request.user.username}")
            # В реальном приложении здесь можно получить информацию о кэше
            # Пока возвращаем базовую информацию
            return Response({
                'size': 0,  # Размер кэша в байтах
                'items_count': 0  # Количество элементов в кэше
            })
        except Exception as e:
            logger.error(f"Error getting cache info for user {request.user.username}: {str(e)}")
            return Response({
                'size': 0,
                'items_count': 0
            })
        
    @action(detail=False, methods=['post'])
    def clear_cache(self, request):
        """Clear cache"""
        try:
            logger.info(f"Cache cleared by user: {request.user.username}")
            # В реальном приложении здесь можно очистить кэш
            # Пока просто возвращаем успешный ответ
            return Response({'message': 'Cache cleared successfully'})
        except Exception as e:
            logger.error(f"Error clearing cache for user {request.user.username}: {str(e)}")
            return Response({'error': 'Failed to clear cache'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
