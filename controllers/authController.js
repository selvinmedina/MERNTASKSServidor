const Usuario = require('../models/Usuario');

// encriptar los passwords
const bcryptjs = require('bcryptjs');

// resultado de la validacion
const { validationResult } = require('express-validator');

// JWT
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    // extraer el email y password
    const { email, password } = req.body;

    try {
        // Revisar que haya un usuario registrado
        let usuario = await Usuario.findOne({ email });

        // Si no hay usuaraio
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // revisar su password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' })
        }

        // crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1hora
        }, (error, token) => {
            if (error) throw errors;

            return res.json({ token, msg: 'Usuario autentificado correctamente' });
        });
    } catch (error) {
        console.log(error);
    }
}

// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}