const Usuario = require('../models/Usuario');

// encriptar los passwords
const bcryptjs = require('bcryptjs');

// resultado de la validacion
const { validationResult } = require('express-validator');

// JWT
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    // extraer email y password
    const { email, password } = req.body;

    try {
        // revisar que el usuario registrado sea unico

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // guardar el nuevo usuario
        usuario = new Usuario(req.body);

        // hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);


        // guardar el nuevo usuario
        await usuario.save();

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

            return res.json({ token, msg: 'Usuario creado correctamente' });
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}