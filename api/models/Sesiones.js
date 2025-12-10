const mongoose = require("mongoose");

const SesionSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Sesiones", SesionSchema);
