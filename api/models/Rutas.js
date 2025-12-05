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

const RutasSchema = new mongoose.Schema(
    {
        usuarioId:{
            type: String,
            require:true
        },
        origen: {
            type: origenSchema,
            require:true
        },
        destino: {
            type: destinoSchema,
            require:true
        },
        camino: {

        },
        estatus: {
            type: String,
            enum: ["activo", "completado"],
            required:true
        },
        createdAt: {
            type: Date,
            required:true
        }
    }
);

module.exports = mongoose.model('Rutas', RutasSchema)