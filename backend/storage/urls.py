from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AuthViewSet, UserViewSet, CourseViewSet, AssignmentViewSet, FileViewSet, StorageViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Storage endpoints
    path('storage/info/', StorageViewSet.as_view({'get': 'info'}), name='storage-info'),
    path('storage/cache/info/', StorageViewSet.as_view({'get': 'cache_info'}), name='storage-cache-info'),
    path('storage/cache/clear/', StorageViewSet.as_view({'post': 'clear_cache'}), name='storage-cache-clear'),
] 