const controller = require('../controllers/progresoRutinas.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken } = require('../middlewares/auth.middleware');

module.exports = crearCrudRoutes(controller, [verificarToken]);
