from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, SecureHelloView

router = DefaultRouter()
router.register(r'', TodoViewSet, basename='todo')

urlpatterns = [
    path('', include(router.urls)),
    path('hello/', SecureHelloView.as_view(), name='secure-hello'),
]