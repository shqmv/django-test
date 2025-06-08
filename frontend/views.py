from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib import messages


def login_view(request):
    print(f"frontend.views.login_view: {request.method}")
    if request.method == 'POST':
        print(f"Flag 1")
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(f"Flag 2")
        user = authenticate(request, username=username, password=password)
        print(f"Flag 3")
        if user:
            print(f"Flag 4")
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return render(request, 'frontend/dashboard.html', {'user': user, 'auth_token': token.key})
        print(f"Flag 5")
        messages.error(request, "Invalid email or password.")
    print(f"Flag 6")
    return render(request, 'frontend/login.html')


def logout_view(request):
    logout(request)
    return redirect('frontend:login')


def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password != password2:
            messages.error(request, "Passwords do not match.")
            return render(request, 'frontend/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return render(request, 'frontend/register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return render(request, 'frontend/register.html')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)
        return render(request, 'frontend/dashboard.html', {'user': user, 'auth_token': token.key})

    return render(request, 'frontend/register.html')


def dashboard_view(request):
    if not request.user.is_authenticated:
        return redirect('frontend:login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'frontend/dashboard.html', {'user': request.user, 'auth_token': token.key})


def clients_view(request):
    if not request.user.is_authenticated:
        return redirect('frontend:login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'frontend/clients.html', {'auth_token': token.key})


def products_view(request):
    if not request.user.is_authenticated:
        return redirect('frontend:login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'frontend/products.html', {'auth_token': token.key})


def inventory_view(request):
    if not request.user.is_authenticated:
        return redirect('frontend:login')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'frontend/inventory.html', {'auth_token': token.key})


def users_view(request):
    if not request.user.is_authenticated:
        return redirect('frontend:login')
    if not request.user.is_superuser:
        messages.error(
            request, "You do not have permission to access this page.")
        return redirect('frontend:dashboard')
    token, _ = Token.objects.get_or_create(user=request.user)
    return render(request, 'frontend/users.html', {'auth_token': token.key})
