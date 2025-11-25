//HENRY, DEFINE JSON

const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, "Correo inválido"]
        },

        passwordHash: {
            type: String,
            required: true,
        },

        rol: {
            type: String,
            enum: ["ciudadano", "moderador", "administrador"],
            default: "ciudadano",
        },

        verificado: {
            type: Boolean,
            default: false,
        },

        preferencias: {
            notificaciones: {
                type: Boolean,
                default: true,
            },
            idioma: {
                type: String,
                default: "es",
            },
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
);


module.exports = mongoose.model("Usuario", UsuarioSchema);
