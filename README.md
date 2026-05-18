# TORETO GYM

Sistema web de gestión fitness para administrar clientes, membresías, pagos, asistencias, rutinas, ejercicios, reportes y notificaciones.

## Tecnologías

### Frontend
- React
- Vite
- React Router DOM
- Framer Motion
- React Icons
- jsPDF
- XLSX

### Backend
- Node.js
- Express
- MySQL
- JWT
- bcryptjs
- dotenv

### Base de datos
- MySQL
- phpMyAdmin
- XAMPP

## Funcionalidades principales

- Login con autenticación JWT
- Gestión de roles
- CRUD de clientes
- CRUD de membresías
- Asignación de membresías a clientes
- Registro de pagos
- Generación de boletas PDF
- Exportación de reportes PDF y Excel
- Control de asistencias
- Gestión de entrenadores
- Gestión de ejercicios
- Gestión de rutinas
- Registro de progreso
- Notificaciones automáticas
- Dashboard con métricas

## Roles del sistema

- ADMINISTRADOR
- RECEPCIONISTA
- ENTRENADOR
- CLIENTE

## Flujo principal

Cliente → Membresía → Pago → Boleta → Asistencia → Rutina → Reporte

## Instalación

### Backend

```bash
cd toreto_gym_backend
npm install
npm run dev