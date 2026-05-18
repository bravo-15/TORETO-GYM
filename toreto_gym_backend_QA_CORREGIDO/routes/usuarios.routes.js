const controller = require('../controllers/usuarios.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

module.exports = crearCrudRoutes(controller, [verificarToken, permitirRoles('ADMINISTRADOR')]);
