# Sistema de Gestión de Inventario

Una aplicación de Django REST Framework con una interfaz basada en Bootstrap para gestionar clientes, productos, inventario y usuarios (solo superusuarios).

## Instrucciones de Configuración

1. **Crear y activar un entorno virtual**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Aplicar migraciones**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Crear un superusuario**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Ejecutar el proyecto**:
   ```bash
   python manage.py runserver
   ```

6. **Acceder a la aplicación**:
   - Abre un navegador web y ve a `http://localhost:8000`
   - Se mostrará la página de inicio de sesión
   - Usa las credenciales del superusuario o registra un nuevo usuario
   - Después de iniciar sesión, serás redirigido al panel de control
   - Usa la barra lateral para navegar entre las secciones de Clientes, Productos, Inventario y Usuarios (solo superusuarios)

## Características
- Autenticación de usuarios con seguridad basada en tokens
- Operaciones CRUD para Clientes, Productos, Inventario y Usuarios (solo superusuarios)
- Panel de control con Bootstrap 5 y navegación por barra lateral
- Llamadas AJAX usando Axios para actualizaciones dinámicas de tablas
- Diseño responsivo
- Manejo básico de errores

## Notas
- Asegúrate de tener instalado Python 3.8 o superior
- Los endpoints de la API están protegidos y requieren autenticación
- Los archivos estáticos se sirven desde el directorio `static`
- La base de datos utilizada es SQLite (configuración predeterminada de Django)