const router = require('express').Router();
const controller = require('../controllers/notificaciones.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

router.use(verificarToken);
router.post('/generar-automaticas', permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA'), controller.generarAutomaticas);
router.put('/marcar-leida/:id_notificacion', permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA', 'CLIENTE'), controller.marcarLeida);
router.use('/', crearCrudRoutes(controller, [permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA', 'CLIENTE')]));

module.exports = router;
