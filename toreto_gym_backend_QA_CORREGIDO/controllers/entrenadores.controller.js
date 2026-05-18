const crearCrudController = require('./crud.factory');

module.exports = crearCrudController({
  tabla: 'entrenadores',
  id: 'id_entrenador',
  camposCrear: ['id_usuario', 'nombre', 'apellido', 'dni', 'especialidad', 'telefono', 'correo', 'estado']
});
