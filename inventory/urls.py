from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views as api_views

router = DefaultRouter()
router.register(r'clients', api_views.ClientViewSet)
router.register(r'products', api_views.ProductViewSet)
router.register(r'inventory', api_views.InventoryViewSet)
router.register(r'users', api_views.UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('', include('frontend.urls')),
]
