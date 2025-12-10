const mongoose = require("mongoose");

const ComentarioSchema = new mongoose.Schema(
  {
    reporteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reportes",
      required: true,
    },

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    mensaje: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Comentarios", ComentarioSchema);
