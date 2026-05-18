const router = require('express').Router();
const { resumen, clientesVencidos, renovarMembresia, ingresos, asistencias } = require('../controllers/dashboard.controller');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get('/resumen', permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA'), resumen);
router.get('/clientes-vencidos', permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA'), clientesVencidos);
router.put('/renovar-membresia/:id_cliente_membresia', permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA'), renovarMembresia);
router.get('/ingresos', permitirRoles('ADMINISTRADOR'), ingresos);
router.get('/asistencias', permitirRoles('ADMINISTRADOR', 'RECEPCIONISTA'), asistencias);

module.exports = router;
