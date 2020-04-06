const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const tareasController = require('../controllers/tareasController');

// api/proyecto/tareas
router.post(
    '/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').trim().not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').trim().not().i