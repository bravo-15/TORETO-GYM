const pool = require('../config/database');

const resumen = async (req, res) => {
  try {
    const [[clientes]] = await pool.query(
      "SELECT COUNT(*) AS total FROM clientes"
    );

    const [[membresiasActivas]] = await pool.query(
      "SELECT COUNT(*) AS total FROM cliente_membresias WHERE estado = 'ACTIVO' AND fecha_fin >= CURDATE()"
    );

    const [[clientesVencidos]] = await pool.query(
      "SELECT COUNT(*) AS total FROM cliente_membresias WHERE estado = 'VENCIDO' OR fecha_fin < CURDATE()"
    );

    const [[pagosMes]] = await pool.query(`
      SELECT IFNULL(SUM(monto), 0) AS total
      FROM pagos
      WHERE estado = 'PAGADO'
      AND MONTH(fecha_pago) = MONTH(CURDATE())
      AND YEAR(fecha_pago) = YEAR(CURDATE())
    `);

    const [[asistenciasHoy]] = await pool.query(
      "SELECT COUNT(*) AS total FROM asistencias WHERE fecha = CURDATE()"
    );

    res.json({
      clientes: clientes.total || 0,
      membresiasActivas: membresiasActivas.total || 0,
      clientesVencidos: clientesVencidos.total || 0,
      pagosMes: pagosMes.total || 0,
      asistenciasHoy: asistenciasHoy.total || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener dashboard' });
  }
};

const clientesVencidos = async (req, res) => {
  try {
    await pool.query(`
      UPDATE cliente_membresias
      SET estado = 'VENCIDO'
      WHERE fecha_fin < CURDATE()
      AND estado = 'ACTIVO'
    `);

    const [rows] = await pool.query(`
      SELECT 
        cm.id_cliente_membresia,
        c.id_cliente,
        c.nombre,
        c.apellido,
        c.dni,
        c.telefono,
        c.correo,
        m.nombre AS membresia,
        m.precio,
        cm.fecha_inicio,
        cm.fecha_fin,
        cm.estado
      FROM cliente_membresias cm
      INNER JOIN clientes c ON cm.id_cliente = c.id_cliente
      INNER JOIN membresias m ON cm.id_membresia = m.id_membresia
      WHERE cm.estado = 'VENCIDO'
      ORDER BY cm.fecha_fin ASC
    `);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener clientes vencidos' });
  }
};

const renovarMembresia = async (req, res) => {
  try {
    const { id_cliente_membresia } = req.params;
    const { metodo_pago = 'EFECTIVO' } = req.body;

    const [[membresia]] = await pool.query(`
      SELECT 
        cm.id_cliente_membresia,
        cm.id_membresia,
        m.precio,
        m.duracion_dias
      FROM cliente_membresias cm
      INNER JOIN membresias m ON cm.id_membresia = m.id_membresia
      WHERE cm.id_cliente_membresia = ?
    `, [id_cliente_membresia]);

    if (!membresia) {
      return res.status(404).json({
        mensaje: 'Membresía no encontrada'
      });
    }

    await pool.query(`
      UPDATE cliente_membresias
      SET 
        fecha_inicio = CURDATE(),
        fecha_fin = DATE_ADD(CURDATE(), INTERVAL ? DAY),
        estado = 'ACTIVO'
      WHERE id_cliente_membresia = ?
    `, [membresia.duracion_dias, id_cliente_membresia]);

    await pool.query(`
      INSERT INTO pagos 
      (id_cliente_membresia, monto, metodo_pago, estado)
      VALUES (?, ?, ?, 'PAGADO')
    `, [id_cliente_membresia, membresia.precio, metodo_pago]);

    res.json({
      mensaje: 'Membresía renovada correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al renovar membresía' });
  }
};

const ingresos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(fecha_pago, '%Y-%m') AS mes,
        IFNULL(SUM(monto), 0) AS total
      FROM pagos
      WHERE estado = 'PAGADO'
      GROUP BY DATE_FORMAT(fecha_pago, '%Y-%m')
      ORDER BY mes ASC
    `);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener ingresos' });
  }
};

const asistencias = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
        COUNT(*) AS total
      FROM asistencias
      GROUP BY DATE_FORMAT(fecha, '%Y-%m-%d')
      ORDER BY fecha ASC
    `);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener asistencias' });
  }
};

module.exports = {
  resumen,
  clientesVencidos,
  renovarMembresia,
  ingresos,
  asistencias
};