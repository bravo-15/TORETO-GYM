const bcrypt = require('bcryptjs');
const crearCrudController = require('./crud.factory');
const pool = require('../config/database');

const crud = crearCrudController({
  tabla: 'usuarios',
  id: 'id_usuario',
  camposCrear: ['id_rol', 'nombre', 'apellido', 'dni', 'telefono', 'correo', 'password', 'estado']
});

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id_usuario, u.id_rol, r.nombre AS rol, u.nombre, u.apellido,
             u.dni, u.telefono, u.correo, u.estado
      FROM usuarios u
      INNER JOIN roles r ON r.id_rol = u.id_rol
      ORDER BY u.id_usuario DESC
    `);
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar usuarios' });
  }
};

const crear = async (req, res) => {
  try {
    const { id_rol, nombre, apellido, dni, telefono, correo, password, estado = 'ACTIVO' } = req.body;
    if (!id_rol || !nombre || !apellido || !correo || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Datos obligatorios incompletos' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(`
      INSERT INTO usuarios (id_rol, nombre, apellido, dni, telefono, correo, password, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id_rol, nombre, apellido, dni || null, telefono || null, String(correo).toLowerCase(), hash, estado]);

    res.status(201).json({ ok: true, mensaje: 'Usuario creado', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, mensaje: 'El correo o DNI ya existe' });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al crear usuario' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_rol, nombre, apellido, dni, telefono, correo, password, estado } = req.body;

    const campos = [];
    const valores = [];

    const add = (campo, valor) => {
      if (valor !== undefined) {
        campos.push(`${campo} = ?`);
        valores.push(valor);
      }
    };

    add('id_rol', id_rol);
    add('nombre', nombre);
    add('apellido', apellido);
    add('dni', dni);
    add('telefono', telefono);
    if (correo !== undefined) add('correo', String(correo).toLowerCase());
    add('estado', estado);

    if (password) {
      campos.push('password = ?');
      valores.push(await bcrypt.hash(password, 10));
    }

    if (campos.length === 0) {
      return res.status(400).json({ ok: false, mensaje: 'No enviaste datos válidos' });
    }

    valores.push(id);
    const [result] = await pool.query(`UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`, valores);
    if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    res.json({ ok: true, mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar usuario' });
  }
};

module.exports = { ...crud, listar, crear, actualizar };
