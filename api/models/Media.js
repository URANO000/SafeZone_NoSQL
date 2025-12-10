const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    reporteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reportes",
      required: true,
    },

    tipo: {
      type: String,
      enum: ["imagen", "video"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    verificado: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Media", MediaSchema);
