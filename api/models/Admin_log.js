const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema(
    {
        usuarioId:{
            type:mongoose.Schema.Types.ObjectId,
            require: true
        },
        accion: {
            type:String,
            require: true
        },
        timestamp:{
            type:Date,
            require:true
        },
        ip:{
            type:String,
            require:true
        }
    }

);

module.exports = mongoose.model('Admin_log', AdminLogSchema);