const pool = require('../config/database');

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        re.id_rutina_ejercicio,
        r.nombre_rutina AS rutina,
        e.nombre AS ejercicio,
        re.series,
        re.repeticiones,
        re.peso,
        re.descanso
      FROM rutina_ejercicios re
      INNER JOIN rutinas r ON re.id_rutina = r.id_rutina
      INNER JOIN ejercicios e ON re.id_ejercicio = e.id_ejercicio
      ORDER BY re.id_rutina_ejercicio DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar rutina ejercicios' });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM rutina_ejercicios WHERE id_rutina_ejercicio = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener registro' });
  }
};

const crear = async (req, res) => {
  try {
    const {
      id_rutina,
      id_ejercicio,
      series,
      repeticiones,
      peso,
      descanso
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO rutina_ejercicios
      (id_rutina, id_ejercicio, series, repeticiones, peso, descanso)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_rutina,
        id_ejercicio,
        series,
        repeticiones,
        peso || null,
        descanso || null
      ]
    );

    res.status(201).json({
      mensaje: 'Ejercicio agregado a la rutina correctamente',
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear registro' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      id_rutina,
      id_ejercicio,
      series,
      repeticiones,
      peso,
      descanso
    } = req.body;

    const [result] = await pool.query(
      `UPDATE rutina_ejercicios
       SET id_rutina = ?,
           id_ejercicio = ?,
           series = ?,
           repeticiones = ?,
           peso = ?,
           descanso = ?
       WHERE id_rutina_ejercicio = ?`,
      [
        id_rutina,
        id_ejercicio,
        series,
        repeticiones,
        peso || null,
        descanso || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    res.json({ mensaje: 'Registro actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar registro' });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM rutina_ejercicios WHERE id_rutina_ejercicio = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }

    res.json({ mensaje: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar registro' });
  }
};

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};