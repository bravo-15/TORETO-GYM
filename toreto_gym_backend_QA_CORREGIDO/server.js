const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  }
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API TORETO GYM funcionando correctamente' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/roles', require('./routes/roles.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/entrenadores', require('./routes/entrenadores.routes'));
app.use('/api/membresias', require('./routes/membresias.routes'));
app.use('/api/cliente-membresias', require('./routes/cliente_membresias.routes'));
app.use('/api/pagos', require('./routes/pagos.routes'));
app.use('/api/asistencias', require('./routes/asistencias.routes'));
app.use('/api/ejercicios', require('./routes/ejercicios.routes'));
app.use('/api/rutinas', require('./routes/rutinas.routes'));
app.use('/api/rutina-ejercicios', require('./routes/rutina-ejercicios.routes'));
app.use('/api/progreso-rutinas', require('./routes/progreso-rutinas.routes'));
app.use('/api/notificaciones', require('./routes/notificaciones.routes'));

app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error('ERROR GLOBAL:', error.message);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor TORETO GYM corriendo en http://localhost:${PORT}`);
});
