const pool = require('../config/database');

const filtrarCampos = (body, camposPermitidos) => {
  const data = {};
  camposPermitidos.forEach((campo) => {
    if (body[campo] !== undefined) data[campo] = body[campo];
  });
  return data;
};

const crearCrudController = ({ tabla, id, camposCrear, camposActualizar, listarQuery }) => ({
  listar: async (req, res) => {
    try {
      const sql = listarQuery || `SELECT * FROM ${tabla} ORDER BY ${id} DESC`;
      const [rows] = await pool.query(sql);
      res.json({ ok: true, data: rows });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: `Error al listar ${tabla}`, error: error.message });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE ${id} = ?`, [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
      res.json({ ok: true, data: rows[0] });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: `Error al obtener ${tabla}`, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const data = filtrarCampos(req.body, camposCrear);
      const keys = Object.keys(data);
      if (keys.length === 0) return res.status(400).json({ ok: false, mensaje: 'No enviaste datos válidos' });

      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tabla} (${keys.join(', ')}) VALUES (${placeholders})`;
      const [result] = await pool.query(sql, keys.map((key) => data[key]));
      res.status(201).json({ ok: true, mensaje: 'Registro creado', id: result.insertId });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: `Error al crear ${tabla}`, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const data = filtrarCampos(req.body, camposActualizar || camposCrear);
      const keys = Object.keys(data);
      if (keys.length === 0) return res.status(400).json({ ok: false, mensaje: 'No enviaste datos válidos' });

      const setSql = keys.map((key) => `${key} = ?`).join(', ');
      const values = keys.map((key) => data[key]);
      values.push(req.params.id);

      const [result] = await pool.query(`UPDATE ${tabla} SET ${setSql} WHERE ${id} = ?`, values);
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
      res.json({ ok: true, mensaje: 'Registro actualizado' });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: `Error al actualizar ${tabla}`, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${tabla} WHERE ${id} = ?`, [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ ok: false, mensaje: 'Registro no encontrado' });
      res.json({ ok: true, mensaje: 'Registro eliminado' });
    } catch (error) {
      res.status(500).json({ ok: false, mensaje: `Error al eliminar ${tabla}`, error: error.message });
    }
  }
});

module.exports = crearCrudController;
