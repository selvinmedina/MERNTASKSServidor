// Rutas para autenticar usuarios
const authController = require('../controllers/authController')
const express = require('express');
const router = express.Router();

const { check } = require('express-validator')

// Autentifica usuarios
// api/auth
router.post(
    '/',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

module.exports = router;