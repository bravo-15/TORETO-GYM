const pool = require('../config/database');
const crearCrudController = require('./crud.factory');

const crud = crearCrudController({
  tabla: 'pagos',
  id: 'id_pago',
  camposCrear: ['id_cliente_membresia', 'monto', 'fecha_pago', 'metodo_pago', 'estado']
});

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_pago,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        m.nombre AS membresia,
        p.monto,
        p.fecha_pago,
        p.metodo_pago,
        p.estado
      FROM pagos p
      INNER JOIN cliente_membresias cm ON p.id_cliente_membresia = cm.id_cliente_membresia
      INNER JOIN clientes c ON cm.id_cliente = c.id_cliente
      INNER JOIN membresias m ON cm.id_membresia = m.id_membresia
      ORDER BY p.id_pago DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar pagos' });
  }
};

const crear = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id_cliente_membresia, monto, metodo_pago, estado = 'PAGADO' } = req.body;

    if (!id_cliente_membresia || Number(monto) <= 0 || !metodo_pago) {
      return res.status(400).json({ mensaje: 'Datos de pago inválidos' });
    }

    await conn.beginTransaction();

    const [[clienteMembresia]] = await conn.query(`
      SELECT cm.id_cliente_membresia, cm.id_membresia, cm.fecha_fin, m.duracion_dias
      FROM cliente_membresias cm
      INNER JOIN membresias m ON cm.id_membresia = m.id_membresia
      WHERE cm.id_cliente_membresia = ?
      FOR UPDATE
    `, [id_cliente_membresia]);

    if (!clienteMembresia) {
      await conn.rollback();
      return res.status(404).json({ mensaje: 'Cliente membresía no encontrada' });
    }

    const [result] = await conn.query(`
      INSERT INTO pagos 
      (id_cliente_membresia, monto, fecha_pago, metodo_pago, estado)
      VALUES (?, ?, NOW(), ?, ?)
    `, [id_cliente_membresia, monto, metodo_pago, estado]);

    if (estado === 'PAGADO') {
      await conn.query(`
        UPDATE cliente_membresias
        SET fecha_inicio = CURDATE(),
            fecha_fin = DATE_ADD(CURDATE(), INTERVAL ? DAY),
            estado = 'ACTIVO'
        WHERE id_cliente_membresia = ?
      `, [clienteMembresia.duracion_dias, id_cliente_membresia]);
    }

    await conn.commit();
    res.json({ mensaje: 'Pago registrado correctamente', id_pago: result.insertId });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar pago' });
  } finally {
    conn.release();
  }
};

const reportePagos = async (req, res) => {
  try {
    const { estado, desde, hasta } = req.query;

    const condiciones = [];
    const valores = [];

    if (estado && estado !== 'TODOS') {
      condiciones.push('p.estado = ?');
      valores.push(estado);
    }

    if (desde) {
      condiciones.push('DATE(p.fecha_pago) >= ?');
      valores.push(desde);
    }

    if (hasta) {
      condiciones.push('DATE(p.fecha_pago) <= ?');
      valores.push(hasta);
    }

    const where = condiciones.length > 0
      ? `WHERE ${condiciones.join(' AND ')}`
      : '';

    const [pagos] = await pool.query(`
      SELECT 
        p.id_pago,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        m.nombre AS membresia,
        p.monto,
        p.fecha_pago,
        p.metodo_pago,
        p.estado
      FROM pagos p
      INNER JOIN cliente_membresias cm ON p.id_cliente_membresia = cm.id_cliente_membresia
      INNER JOIN clientes c ON cm.id_cliente = c.id_cliente
      INNER JOIN membresias m ON cm.id_membresia = m.id_membresia
      ${where}
      ORDER BY p.fecha_pago DESC
    `, valores);

    const [resumen] = await pool.query(`
      SELECT
        COUNT(*) AS total_pagos,
        IFNULL(SUM(CASE WHEN p.estado = 'PAGADO' THEN p.monto ELSE 0 END), 0) AS total_pagado,
        IFNULL(SUM(CASE WHEN p.estado = 'PENDIENTE' THEN p.monto ELSE 0 END), 0) AS total_pendiente,
        IFNULL(SUM(CASE WHEN p.estado = 'ANULADO' THEN p.monto ELSE 0 END), 0) AS total_anulado,
        IFNULL(SUM(CASE WHEN p.estado = 'PAGADO' THEN 1 ELSE 0 END), 0) AS cantidad_pagados,
        IFNULL(SUM(CASE WHEN p.estado = 'PENDIENTE' THEN 1 ELSE 0 END), 0) AS cantidad_pendientes,
        IFNULL(SUM(CASE WHEN p.estado = 'ANULADO' THEN 1 ELSE 0 END), 0) AS cantidad_anulados
      FROM pagos p
      ${where}
    `, valores);

    res.json({
      resumen: resumen[0],
      pagos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar reporte de pagos' });
  }
};

module.exports = {
  ...crud,
  listar,
  crear,
  reportePagos
};