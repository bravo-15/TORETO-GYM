const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'clientes',
  id: 'id_cliente',
  camposCrear: ['nombre', 'apellido', 'dni', 'telefono', 'correo', 'direccion', 'estado']
});