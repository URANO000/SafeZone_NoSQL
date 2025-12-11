const mongoose = require('mongoose');

const VotosSchema = new mongoose.Schema(
    {
        reporteId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        usuarioId: {
            type: mongoose.Schema.Types.ObjectId,
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