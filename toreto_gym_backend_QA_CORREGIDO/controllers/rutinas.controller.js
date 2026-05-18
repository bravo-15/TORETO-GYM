const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'rutinas',
  id: 'id_rutina',
  camposCrear: ['id_cliente', 'id_entrenador', 'nombre_rutina', 'fecha_inicio', 'estado']
});
