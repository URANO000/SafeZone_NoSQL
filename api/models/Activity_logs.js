const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
    {
        usuarioId: {
            type:String,
            require:true
        },
        accion: {
            type:String,
            require:true
        },
        timestamp: {
            type:Date,
            require:true
        },
        ip: {
            type:String,
            require:true
        }
    }
);

module.exports = mongoose.model('Activity_logs', ActivityLogSchema);