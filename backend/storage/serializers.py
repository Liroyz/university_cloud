import logging
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Course, Assignment, File

logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели User.
    Предоставляет полную информацию о пользователе, исключая пароль.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'avatar', 'bio', 'phone', 'date_of_birth', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        """Логирование данных перед валидацией"""
        logger.debug(f"UserSerializer input data: {data}")
        try:
            return super().to_internal_value(data)
        except Exception as e:
            logger.error(f"Validation error in UserSerializer: {str(e)}")
            raise

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Сериализатор для регистрации новых пользователей.
    Включает дополнительную проверку совпадения паролей.
    """
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True}
        }
    
    def validate(self, data):
        """
        Проверяет совпадение паролей.
        
        Raises:
            serializers.ValidationError: Если пароли не совпадают
        """
        if data['password'] != data['password_confirm']:
            logger.warning("Password mismatch during registration")
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        """
        Создает нового пользователя с хешированием пароля.
        
        Returns:
            User: Созданный пользователь
            
        Raises:
            serializers.ValidationError: При ошибке создания пользователя
        """
        try:
            validated_data.pop('password_confirm')
            password = validated_data.pop('password')
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            logger.info(f"New user registered: {user.username}")
            return user
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise serializers.ValidationError("Error creating user")

class UserLoginSerializer(serializers.Serializer):
    """
    Сериализатор для аутентификации пользователей.
    Поддерживает вход по username или email.
    """
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        """
        Проверяет учетные данные и аутентифицирует пользователя.
        
        Returns:
            dict: Данные с добавленным объектом пользователя при успешной аутентификации
            
        Raises:
            serializers.ValidationError: При неверных учетных данных
        """
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not password:
            logger.warning("Login attempt without password")
            raise serializers.ValidationError("Password is required")
        
        if not username and not email:
            logger.warning("Login attempt without username or email")
            raise serializers.ValidationError("Username or email is required")
        
        user = None
        try:
            if username:
                logger.debug(f"Attempting authentication with username: {username}")
                user = authenticate(username=username, password=password)
            elif email:
                logger.debug(f"Attempting authentication with email: {email}")
                try:
                    user_obj = User.objects.get(email=email)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    logger.warning(f"User with email {email} not found")
                    pass
            
            if user:
                logger.info(f"User {user.username} authenticated successfully")
                data['user'] = user
                return data
            else:
                logger.warning("Authentication failed - invalid credentials")
                raise serializers.ValidationError("Invalid credentials")
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise serializers.ValidationError("Authentication error")

class CourseSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Course.
    Включает имя преподавателя как read-only поле.
    """
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'description', 'teacher', 'teacher_name', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """Дополнительная валидация данных курса"""
        logger.debug(f"Course validation data: {data}")
        return data

class AssignmentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Assignment.
    Включает название курса как read-only поле.
    """
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'due_date', 'course', 'course_name', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_due_date(self, value):
        """Проверяет, что срок сдачи задания в будущем"""
        if value < timezone.now():
            logger.warning("Attempt to set assignment due date in the past")
            raise serializers.ValidationError("Due date must be in the future")
        return value

class FileSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели File.
    Включает дополнительные вычисляемые поля:
    - uploaded_by_name: полное имя загрузившего пользователя
    - file_url: URL для доступа к файлу
    - file_size_display: размер файла в удобочитаемом формате
    """
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
        """
        Возвращает URL файла или None, если файл не существует.
        
        Args:
            obj: Экземпляр модели File
            
        Returns:
            str: URL файла или None
        """
        try:
            if obj.file:
                return obj.file.url
            return None
        except Exception as e:
            logger.error(f"Error getting file URL: {str(e)}")
            return None

class FileUploadSerializer(serializers.ModelSerializer):
    """
    Специализированный сериализатор для загрузки файлов.
    Содержит только необходимые для загрузки поля.
    """
    class Meta:
        model = File
        fields = ['file', 'original_filename', 'file_type', 'assignment', 
                 'course', 'is_public', 'description']
    
    def validate_file(self, value):
        """
        Проверяет загружаемый файл.
        
        Args:
            value: Загружаемый файл
            
        Returns:
            UploadedFile: Проверенный файл
            
        Raises:
            serializers.ValidationError: При недопустимом файле
        """
        try:
            # Пример проверки размера файла (максимум 50MB)
            max_size = 50 * 1024 * 1024
            if value.size > max_size:
                logger.warning(f"File too large: {value.size} bytes")
                raise serializers.ValidationError(f"File too large. Max size is {max_size} bytes")
            
            # Дополнительные проверки можно добавить здесь
            return value
        except Exception as e:
            logger.error(f"File validation error: {str(e)}")
            raise serializers.ValidationError("Invalid file")