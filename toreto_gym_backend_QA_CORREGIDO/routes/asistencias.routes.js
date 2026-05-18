const router = require('express').Router();
const controller = require('../controllers/asistencias.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

const accesoOperativo = [verificarToken, permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA')];

router.put('/registrar-salida/:id_asistencia', ...accesoOperativo, controller.registrarSalida);
router.use('/', crearCrudRoutes(controller, accesoOperativo));

module.exports = router;
