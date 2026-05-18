const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'toreto_gym_secret_key') {
    throw new Error('JWT_SECRET no configurado o inseguro');
  }
  return secret;
};

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, mensaje: 'Token no enviado' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.usuario = jwt.verify(token, getJwtSecret());
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o vencido' });
  }
};

const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ ok: false, mensaje: 'No tienes permiso para esta acción' });
    }
    next();
  };
};

module.exports = { verificarToken, permitirRoles, getJwtSecret };
