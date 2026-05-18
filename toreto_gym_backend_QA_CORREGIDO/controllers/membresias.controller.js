const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'membresias',
  id: 'id_membresia',
  camposCrear: ['nombre', 'descripcion', 'precio', 'duracion_dias', 'estado']
});
