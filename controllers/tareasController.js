const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');
exports.crearTarea = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    res.status(200).json({ msg: 'Hola' });
}