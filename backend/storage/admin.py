from django.contrib import admin
from .models import User, Course, Assignment, File

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'teacher', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'code', 'description']

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'due_date', 'created_at']
    list_filter = ['due_date', 'created_at']
    search_fields = ['title', 'description']

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'file_type', 'file_size', 'uploaded_by', 'uploaded_at', 'is_public']
    list_filter = ['file_type', 'uploaded_at', 'is_public']
    search_fields = ['original_filename', 'description']
    readonly_fields = ['file_size', 'mime_type', 'uploaded_at']
    
    def get_file_size_display(self, obj):
        return obj.get_file_size_display()
    get_file_size_display.short_description = 'File Size'
