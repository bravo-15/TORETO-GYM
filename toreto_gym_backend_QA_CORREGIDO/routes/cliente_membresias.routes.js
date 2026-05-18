const controller = require('../controllers/cliente_membresias.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

module.exports = crearCrudRoutes(controller, [verificarToken, permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA')]);
