const mongoose = require('mongoose');

const VotosSchema = new mongoose.Schema(
    {
        reporteId: {
            type: String,
            require: true
        },
        usuarioId: {
            type: String,
            require: true
        },
        voto: {
            type: Number,
            enum: [1, -1],
            required: true
        }
    }
);

module.exports = mongoose.model('Votos', VotosSchema);