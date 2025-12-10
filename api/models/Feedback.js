const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    mensaje: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
