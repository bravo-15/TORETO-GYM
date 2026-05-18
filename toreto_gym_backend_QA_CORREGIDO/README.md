# Backend TORETO GYM

Backend creado con Node.js + Express + MySQL + JWT para TORETO GYM.

## 1. Requisitos

- Node.js instalado
- XAMPP iniciado con Apache y MySQL
- Base de datos `toreto_gym` creada con el script SQL que ya tienes

## 2. Instalación

Abre terminal dentro de esta carpeta:

```bash
npm install
```

## 3. Configuración

Revisa el archivo `.env`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=toreto_gym
DB_PORT=3306
JWT_SECRET=toreto_gym_secret_key
JWT_EXPIRES_IN=8h
```

En XAMPP normalmente el usuario es `root` y la contraseña va vacía.

## 4. Ejecutar backend

```bash
npm run dev
```

La API debe abrir en:

```txt
http://localhost:3001
```

## 5. Login demo

```json
{
  "correo": "admin@toreto.com",
  "password": "123"
}
```

Ruta:

```txt
POST http://localhost:3001/api/auth/login
```

## 6. Rutas principales

Todas estas rutas, excepto login, usan token Bearer.

```txt
/api/roles
/api/usuarios
/api/clientes
/api/entrenadores
/api/membresias
/api/cliente-membresias
/api/pagos
/api/asistencias
/api/ejercicios
/api/rutinas
/api/rutina-ejercicios
/api/progreso-rutinas
/api/notificaciones
/api/dashboard/resumen
```

## 7. Cómo usar el token

Después del login copia el token y envíalo así:

```txt
Authorization: Bearer TU_TOKEN_AQUI
```
