const mongoose = require('mongoose');

const ReportesSchema = new mongoose.Schema(
    {
        descripcion: {
            type: String,
            require: true
        },
        estatus: {
            type: String,
            enum: ["pendiente", "aprovado", "rechazado"],
            required:true
        },
        mediaIds: {
            type: Array,
            required: false
        },
        severidad:{
            type: String,
            enum: ["alta", "media", "baja"],
            required:true
        },
        timestamp: {
            type: Date,
            default: Date.now,
            require: true
        },
        tipo: {
            type: String,
            require: true
        },
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        zonaId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }

    }
);

module.exports = mongoose.model('Reportes', ReportesSchema);