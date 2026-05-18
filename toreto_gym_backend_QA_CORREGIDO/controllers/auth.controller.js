const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { getJwtSecret } = require('../middlewares/auth.middleware');

const login = async (req, res) => {
  try {
    const correo = String(req.body.correo || '').trim().toLowerCase();
    const { password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Correo y contraseña son obligatorios'
      });
    }

    const [rows] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.correo,
        u.password,
        u.estado,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r ON r.id_rol = u.id_rol
      WHERE LOWER(u.correo) = ?
      LIMIT 1
    `, [correo]);

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    const usuario = rows[0];

    if (usuario.estado !== 'ACTIVO') {
      return res.status(403).json({
        ok: false,
        mensaje: 'Usuario inactivo'
      });
    }

    const passwordGuardada = String(usuario.password || '');
    let passwordValida = false;

    if (passwordGuardada.startsWith('$2')) {
      passwordValida = await bcrypt.compare(password, passwordGuardada);
    } else {
      passwordValida = password === passwordGuardada;
    }

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol
      },
      getJwtSecret(),
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h'
      }
    );

    delete usuario.password;

    return res.json({
      ok: true,
      mensaje: 'Login correcto',
      token,
      usuario
    });

  } catch (error) {
    console.error('ERROR LOGIN:', error.message);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error en login',
      detalle: error.message
    });
  }
};

const perfil = async (req, res) => {
  return res.json({
    ok: true,
    usuario: req.usuario
  });
};

module.exports = {
  login,
  perfil
};