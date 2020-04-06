const mongoose = require('mongoose');
const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    }
});

module.exports = mongoose.model('Tarea', TareaSchema);