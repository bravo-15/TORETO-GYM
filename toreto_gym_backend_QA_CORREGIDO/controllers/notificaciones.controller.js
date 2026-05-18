const pool = require('../config/database');
const crearCrudController = require('./crud.factory');

const crud = crearCrudController({
  tabla: 'notificaciones',
  id: 'id_notificacion',
  camposCrear: ['id_cliente', 'titulo', 'mensaje', 'estado']
});

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        n.id_notificacion,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        n.titulo,
        n.mensaje,
        n.estado
      FROM notificaciones n
      INNER JOIN clientes c ON n.id_cliente = c.id_cliente
      ORDER BY n.id_notificacion DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al listar notificaciones'
    });
  }
};

const generarAutomaticas = async (req, res) => {
  try {
    const [vencidas] = await pool.query(`
      SELECT cm.id_cliente, c.nombre, c.apellido, cm.fecha_fin
      FROM cliente_membresias cm
      INNER JOIN clientes c ON cm.id_cliente = c.id_cliente
      WHERE cm.fecha_fin < CURDATE()
    `);

    const [porVencer] = await pool.query(`
      SELECT cm.id_cliente, c.nombre, c.apellido, cm.fecha_fin
      FROM cliente_membresias cm
      INNER JOIN clientes c ON cm.id_cliente = c.id_cliente
      WHERE cm.fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    `);

    for (const cliente of vencidas) {
      const [[existe]] = await pool.query(`
        SELECT id_notificacion
        FROM notificaciones
        WHERE id_cliente = ?
        AND titulo = 'Membresía vencida'
        AND estado = 'PENDIENTE'
        LIMIT 1
      `, [cliente.id_cliente]);

      if (!existe) {
        await pool.query(`
          INSERT INTO notificaciones (id_cliente, titulo, mensaje, estado)
          VALUES (?, ?, ?, 'PENDIENTE')
        `, [
          cliente.id_cliente,
          'Membresía vencida',
          `La membresía de ${cliente.nombre} ${cliente.apellido} está vencida.`
        ]);
      }
    }

    for (const cliente of porVencer) {
      const [[existe]] = await pool.query(`
        SELECT id_notificacion
        FROM notificaciones
        WHERE id_cliente = ?
        AND titulo = 'Membresía por vencer'
        AND estado = 'PENDIENTE'
        LIMIT 1
      `, [cliente.id_cliente]);

      if (!existe) {
        await pool.query(`
          INSERT INTO notificaciones (id_cliente, titulo, mensaje, estado)
          VALUES (?, ?, ?, 'PENDIENTE')
        `, [
          cliente.id_cliente,
          'Membresía por vencer',
          `La membresía de ${cliente.nombre} ${cliente.apellido} está por vencer.`
        ]);
      }
    }

    res.json({
      mensaje: 'Notificaciones generadas correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al generar notificaciones'
    });
  }
};

const marcarLeida = async (req, res) => {
  try {
    const { id_notificacion } = req.params;

    await pool.query(`
      UPDATE notificaciones
      SET estado = 'LEIDA'
      WHERE id_notificacion = ?
    `, [id_notificacion]);

    res.json({
      mensaje: 'Notificación marcada como leída'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al marcar notificación'
    });
  }
};

module.exports = {
  ...crud,
  listar,
  generarAutomaticas,
  marcarLeida
};