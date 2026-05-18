const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'ejercicios',
  id: 'id_ejercicio',
  camposCrear: ['nombre', 'descripcion', 'grupo_muscular']
});
