from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User as AuthUser
from .models import User, Course, Assignment, File
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    CourseSerializer, AssignmentSerializer, FileSerializer, FileUploadSerializer
)
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

# Create your views here.

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'})
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def refresh(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                print('[DEBUG] Не передан refresh-токен в теле запроса!')
                return Response({'error': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)
            refresh = RefreshToken(refresh_token)
            # Если включена ротация, выдаём новый refresh-токен
            if getattr(settings, 'SIMPLE_JWT', {}).get('ROTATE_REFRESH_TOKENS', False):
                new_refresh = refresh.rotate()
                print(f"[DEBUG] Refresh-токен успешно обновлён. Новый refresh: {str(new_refresh)[:10]}... access: {str(new_refresh.access_token)[:10]}...")
                return Response({
                    'access': str(new_refresh.access_token),
                    'refresh': str(new_refresh),
                })
            else:
                print(f"[DEBUG] Refresh-токен успешно обновлён. Access: {str(refresh.access_token)[:10]}...")
            return Response({
                'access': str(refresh.access_token),
            })
        except Exception as e:
            print(f"[ERROR] Ошибка при обновлении refresh-токена: {e}")
            return Response({'error': f'Invalid refresh token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

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
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_files(self, request):
        """Get files uploaded by the current user"""
        files = self.get_queryset()
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def shared_files(self, request):
        """Get public files"""
        files = File.objects.filter(is_public=True).order_by('-uploaded_at')
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
                print(f"[DEBUG] Minio download URL: {url}")
                return Response({
                    'download_url': url,
                    'filename': file_obj.original_filename or file_obj.file.name,
                    'file_size': file_obj.file_size,
                    'mime_type': file_obj.mime_type
                })
            else:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
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
            
            return Response({
                'used': total_used,
                'total': storage_limit,
                'used_percentage': round(used_percentage, 2)
            })
        except Exception as e:
            print(f"[ERROR] Error getting storage info: {e}")
            return Response({
                'used': 0,
                'total': 10 * 1024 * 1024 * 1024,
                'used_percentage': 0
            })
    
    @action(detail=False, methods=['get'])
    def cache_info(self, request):
        """Get cache information"""
        try:
            # В реальном приложении здесь можно получить информацию о кэше
            # Пока возвращаем базовую информацию
            return Response({
                'size': 0,  # Размер кэша в байтах
                'items_count': 0  # Количество элементов в кэше
            })
        except Exception as e:
            print(f"[ERROR] Error getting cache info: {e}")
            return Response({
                'size': 0,
                'items_count': 0
            })
    
    @action(detail=False, methods=['post'])
    def clear_cache(self, request):
        """Clear cache"""
        try:
            # В реальном приложении здесь можно очистить кэш
            # Пока просто возвращаем успешный ответ
            return Response({'message': 'Cache cleared successfully'})
        except Exception as e:
            print(f"[ERROR] Error clearing cache: {e}")
            return Response({'error': 'Failed to clear cache'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
