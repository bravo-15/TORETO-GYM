const pool = require('../config/database');
const crearCrudController = require('./crud.factory');

const crud = crearCrudController({
  tabla: 'asistencias',
  id: 'id_asistencia',
  camposCrear: ['id_cliente', 'fecha', 'hora_ingreso', 'hora_salida', 'estado']
});

// 🔹 LISTAR con nombre de cliente
const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id_asistencia,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        a.fecha,
        a.hora_ingreso,
        a.hora_salida,
        a.estado
      FROM asistencias a
      INNER JOIN clientes c ON a.id_cliente = c.id_cliente
      ORDER BY a.id_asistencia DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al listar asistencias'
    });
  }
};

// 🔹 CREAR asistencia con validación de membresía y doble ingreso
const crear = async (req, res) => {
  try {
    const { id_cliente } = req.body;

    // ✅ Evitar doble ingreso sin salida
    const [[asistenciaAbierta]] = await pool.query(`
      SELECT id_asistencia
      FROM asistencias
      WHERE id_cliente = ?
      AND estado = 'VALIDO'
      AND hora_salida IS NULL
      ORDER BY id_asistencia DESC
      LIMIT 1
    `, [id_cliente]);

    if (asistenciaAbierta) {
      return res.status(400).json({
        mensaje: 'El cliente ya tiene una asistencia abierta. Registra su salida primero.'
      });
    }

    // ✅ Verificar membresía
    const [[membresia]] = await pool.query(`
      SELECT estado, fecha_fin
      FROM cliente_membresias
      WHERE id_cliente = ?
      ORDER BY fecha_fin DESC
      LIMIT 1
    `, [id_cliente]);

    if (!membresia) {
      return res.status(400).json({
        mensaje: 'El cliente no tiene membresía'
      });
    }

    const hoy = new Date();
    const vencido = new Date(membresia.fecha_fin) < hoy;

    // ❌ Membresía vencida
    if (membresia.estado !== 'ACTIVO' || vencido) {
      await pool.query(`
        INSERT INTO asistencias (id_cliente, fecha, hora_ingreso, estado)
        VALUES (?, CURDATE(), CURTIME(), 'DENEGADO')
      `, [id_cliente]);

      return res.status(403).json({
        mensaje: 'Acceso denegado: membresía vencida'
      });
    }

    // ✅ Membresía válida
    const [result] = await pool.query(`
      INSERT INTO asistencias (id_cliente, fecha, hora_ingreso, estado)
      VALUES (?, CURDATE(), CURTIME(), 'VALIDO')
    `, [id_cliente]);

    res.json({
      mensaje: 'Asistencia registrada correctamente',
      id_asistencia: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al registrar asistencia'
    });
  }
};

// 🔹 REGISTRAR SALIDA
const registrarSalida = async (req, res) => {
  try {
    const { id_asistencia } = req.params;

    await pool.query(`
      UPDATE asistencias
      SET hora_salida = CURTIME()
      WHERE id_asistencia = ?
    `, [id_asistencia]);

    res.json({
      mensaje: 'Salida registrada correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al registrar salida'
    });
  }
};

module.exports = {
  ...crud,
  listar,
  crear,
  registrarSalida
};