const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'roles',
  id: 'id_rol',
  camposCrear: ['nombre', 'descripcion', 'estado']
});
