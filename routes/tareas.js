const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const tareasController = require('../controllers/tareasController');

// api/proyecto/tareas
// Crear las tareas del proyecto
router.post(
    '/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').trim().not().isEmpty()
    ],
    tareasController.crearTarea
);

// Obtener las tareas por proyecto
router.get(
    '/',
    auth,
    tareasController.obtenerTareas
);

// Actualizar las tareas por proyecto
router.put(
    '/:id',
    auth,
    tareasController.actualizarTarea
);

// Eliminar las tareas por proyecto
router.delete(
    '/:id',
    auth,
    tareasController.eliminarTarea
);

module.exports = router;