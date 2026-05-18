const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'progreso_rutinas',
  id: 'id_progreso',
  camposCrear: ['id_rutina_ejercicio', 'id_cliente', 'fecha', 'completado']
});
