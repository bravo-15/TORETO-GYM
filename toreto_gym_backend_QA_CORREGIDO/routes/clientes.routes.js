const controller = require('../controllers/clientes.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

module.exports = crearCrudRoutes(controller, [verificarToken, permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA')]);
