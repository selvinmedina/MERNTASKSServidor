const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

// Controlador de tareas
exports.crearTarea = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const proyectoDB = await Proyecto.findById(proyecto);
        if (!proyectoDB) {
            return res.status(400).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (proyectoDB.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }


    res.status(200).json({ msg: 'Hola' });
}

// Obtiene las tareas de un proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const proyectoDB = await Proyecto.findById(proyecto);
        if (!proyectoDB) {
            return res.status(400).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (proyectoDB.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Buscar las tareas por el id del poryecto
        const tareas = await Tarea.find({ proyecto });

        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }


}
// Actualiza las tareas de un proyecto
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;
        const proyectoDB = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (proyectoDB.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        // Crear el objeto con la nueva informacion
        const nuevaTarea = {};
        if (nombre) nuevaTarea.nombre = nombre;
        if (estado) nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate(
            { _id: req.params.id },
            nuevaTarea,
            { new: true }
        );

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const proyectoDB = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (proyectoDB.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        // Eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}