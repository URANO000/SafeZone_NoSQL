const mongoose = require('mongoose');

const origenSchema = new mongoose.Schema({
    lat:{
        type:Number,
        required:true
    },
    lng:{
        type:Number,
        required:true
    }
}, {_id:false});

const destinoSchema = new mongoose.Schema({
    lat:{
        type:Number,
        required:true
    },
    lng:{
        type:Number,
        required:true
    }
}, {_id:false});

const caminoItemSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    zonaEstatus: {
        type: String,
        enum: ["seguro", "peligro", "cuidado"],
        required: true
    }
}, { _id: false });

const RutasSchema = new mongoose.Schema(
    {
        usuarioId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        origen: {
            type: origenSchema,
            required:true
        },
        destino: {
            type: destinoSchema,
            required:true
        },
        camino: {
            type: [caminoItemSchema],
            required:true

        },
        estatus: {
            type: String,
            enum: ["activo", "completado"],
            required:true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required:true
        }
    }
);

module.exports = mongoose.model('Rutas', RutasSchema)