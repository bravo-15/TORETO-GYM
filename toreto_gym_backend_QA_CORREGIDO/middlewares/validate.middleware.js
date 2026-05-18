const validarBody = (reglas = {}) => (req, res, next) => {
  const errores = [];

  for (const [campo, regla] of Object.entries(reglas)) {
    const valor = req.body[campo];

    if (regla.required && (valor === undefined || valor === null || valor === '')) {
      errores.push(`${campo} es obligatorio`);
      continue;
    }

    if (valor === undefined || valor === null || valor === '') continue;

    if (regla.type === 'number' && Number.isNaN(Number(valor))) {
      errores.push(`${campo} debe ser numérico`);
    }

    if (regla.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(valor))) errores.push(`${campo} debe ser un correo válido`);
    }

    if (regla.enum && !regla.enum.includes(valor)) {
      errores.push(`${campo} tiene un valor no permitido`);
    }

    if (regla.min !== undefined && Number(valor) < regla.min) {
      errores.push(`${campo} debe ser mayor o igual a ${regla.min}`);
    }

    if (regla.maxLength && String(valor).length > regla.maxLength) {
      errores.push(`${campo} supera el máximo de ${regla.maxLength} caracteres`);
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, mensaje: 'Validación fallida', errores });
  }

  next();
};

module.exports = { validarBody };
