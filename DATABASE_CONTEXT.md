# Database Context

## Motor de Base de Datos
MySQL

## Arquitectura General
Base de datos relacional para gestión de gimnasio.

## Tablas Principales
- usuarios
- roles
- clientes
- membresias
- cliente_membresias
- pagos
- asistencias
- rutinas
- ejercicios
- rutina_ejercicios
- progreso_rutinas
- notificaciones

## Relaciones
- usuarios → roles
- clientes → cliente_membresias
- cliente_membresias → pagos
- rutinas → rutina_ejercicios
- ejercicios → rutina_ejercicios

## Seguridad
Passwords almacenados con bcrypt y autenticación JWT.

## Reglas de Negocio
- Membresías vencidas no permiten asistencia.
- Pagos activan membresías.
- Roles controlan permisos.