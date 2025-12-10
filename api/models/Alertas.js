const mongoose = require("mongoose");

const AlertaSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    tipo: {
      type: String,
      enum: ["alerta_de_zona", "alerta_de_reporte", "sistema"],
      required: true,
    },

    mensaje: {
      type: String,
      required: true,
      trim: true,
    },

    leido: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Alertas", AlertaSchema);
