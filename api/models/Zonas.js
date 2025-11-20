//ADRIANA
const mongoose = require('mongoose');

//Because it is a nested obj inside an obj, I will make a schema for coordenadas too
const coordenadasSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
}, { _id: false });  //We don't need the ID since it's not its own document

const ZonaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            require: true
        },
        coordenadas: {
            type: coordenadasSchema,
            require: true
        },
        radio: {
            type: Number,
            required: false
        },
        estatus: {
            type: String,
            enum: ["seguro", "cuidado", "peligro"],
            required: true
        },

        descripcion: {
            type: String
        },

        lastUpdated: {
            type: Date,
            default: Date.now
        }


    }
);

module.exports = mongoose.model('Zonas', ZonaSchema);