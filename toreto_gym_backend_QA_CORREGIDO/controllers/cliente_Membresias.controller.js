const pool = require('../config/database');
const crearCrudController = require('./crud.factory');

const crud = crearCrudController({
  tabla: 'cliente_membresias',
  id: 'id_cliente_membresia',
  camposCrear: ['id_cliente', 'id_membresia', 'fecha_inicio', 'fecha_fin', 'estado']
});

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        cm.id_cliente_membresia,
        cm.id_cliente,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        cm.id_membresia,
        m.nombre AS membresia,
        m.precio,
        cm.fecha_inicio,
        cm.fecha_fin,
        cm.estado
      FROM cliente_membresias cm
      INNER JOIN clientes c ON cm.id_cliente = c.id_cliente
      INNER JOIN membresias m ON cm.id_membresia = m.id_membresia
      ORDER BY cm.id_cliente_membresia DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al listar cliente membresías'
    });
  }
};

module.exports = {
  ...crud,
  listar
};