const crearCrudRoutes = (controller, middlewares = []) => {
  const router = require('express').Router();
  router.get('/', ...middlewares, controller.listar);
  router.get('/:id', ...middlewares, controller.obtenerPorId);
  router.post('/', ...middlewares, controller.crear);
  router.put('/:id', ...middlewares, controller.actualizar);
  router.delete('/:id', ...middlewares, controller.eliminar);
  return router;
};

module.exports = crearCrudRoutes;
