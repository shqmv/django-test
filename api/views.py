from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Client, Product, Inventory
from .serializers import ClientSerializer, ProductSerializer, InventorySerializer, UserSerializer
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib import messages


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            request.session['auth_token'] = token.key
            return redirect('dashboard')
    return render(request, 'login.html')


def logout_view(request):
    logout(request)
    return redirect('login')


def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password != password2:
            messages.error(request, "Passwords do not match.")
            return render(request, 'register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return render(request, 'register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return render(request, 'register.html')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)
        return render(request, 'dashboard.html', {'user': user, 'auth_token': token.key})

    return render(request, 'register.html')


def dashboard_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    token, _ = Token.objects.get_or_create(user=request.user)

    return render(request, 'dashboard.html', {'user': request.user, 'auth_token': token.key})


def clients_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'clients.html', {'auth_token': token.key})


def products_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'products.html', {'auth_token': token.key})


def inventory_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'inventory.html', {'auth_token': token.key})


def users_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.is_superuser:
        messages.error(
            request, "You do not have permission to access this page.")
        return redirect('dashboard')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'users.html', {'auth_token': token.key})


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
