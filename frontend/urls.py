from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
    path('', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('clients/', views.clients_view, name='clients'),
    path('products/', views.products_view, name='products'),
    path('inventory/', views.inventory_view, name='inventory'),
    path('users/', views.users_view, name='users'),
]
