const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    try {
        // Revisar si hay errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via jwt
        proyecto.creador = req.usuario.id;

        // Guardar el proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(200).send('Hubo un error')
    }
}

// obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto
            .find({ creador: req.usuario.id }) // Busqueda de los proyectos por usuario
            .sort({ creado: -1 }); // el -1 altera el orden

        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hubo un error' });
    }
}

// actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    try {
        // Revisar si hay errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // extraer la informacion del proyecto
        const { nombre } = req.body;
        const nuevoProyecto = {};

        if (nombre) {
            nuevoProyecto.nombre = nombre;
        }
        // Revisar el id
        let proyecto = await Proyecto.findById(req.params.id); // se usa await cada vez que consulto la bd


        // si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: nuevoProyecto },
            { new: true }
        );

        res.json({ proyecto });


        // actualizar


    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: 'Error en el servidor' });
    }
}

// Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try {
        // Revisar el id
        let proyecto = await Proyecto.findById(req.params.id); // se usa await cada vez que consulto la bd


        // si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Eliminar un proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado' });

    } catch (error) {
        return res.status(500).json({ msg: 'Hubo un error' });
    }
}


















