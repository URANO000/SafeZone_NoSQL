const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    mensaje: {
      type: String,
      required: true
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
  {
    collection: "feedback"
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
