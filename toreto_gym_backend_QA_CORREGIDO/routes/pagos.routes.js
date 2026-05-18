const express = require('express');
const controller = require('../controllers/pagos.controller');
const crearCrudRoutes = require('./crud.routes');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/reporte', verificarToken, controller.reportePagos);

router.use('/', crearCrudRoutes(controller, [verificarToken]));

module.exports = router;