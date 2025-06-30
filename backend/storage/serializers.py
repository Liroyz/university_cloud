from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Course, Assignment, File

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'avatar', 'bio', 'phone', 'date_of_birth', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name', 'role']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not password:
            raise serializers.ValidationError("Password is required")
        
        if not username and not email:
            raise serializers.ValidationError("Username or email is required")
        
        # Try to authenticate with username or email
        user = None
        if username:
            user = authenticate(username=username, password=password)
        elif email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if user:
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError("Invalid credentials")

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'description', 'teacher', 'teacher_name', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AssignmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'due_date', 'course', 'course_name', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class FileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)
    file_url = serializers.SerializerMethodField()
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    
    class Meta:
        model = File
        fields = ['id', 'file', 'original_filename', 'file_type', 'file_size', 
                 'file_size_display', 'mime_type', 'uploaded_at', 'uploaded_by', 
                 'uploaded_by_name', 'assignment', 'course', 'is_public', 
                 'description', 'file_url']
        read_only_fields = ['id', 'file_size', 'mime_type', 'uploaded_at', 
                           'uploaded_by', 'file_url']
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['file', 'original_filename', 'file_type', 'assignment', 
                 'course', 'is_public', 'description']
    
    def validate_file(self, value):
        # Add file validation if needed
        return value 