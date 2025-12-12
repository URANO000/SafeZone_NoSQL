const express = require("express");
const route = express.Router();

const Feedback = require("../models/Feedback");

// POST
route.post("/", async (req, resp) => {
  try {
    const feedback = new Feedback(req.body);
    const guardado = await feedback.save();

    resp.status(201).json(guardado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// GET - Obtener todo el feedback
route.get("/", async (req, resp) => {
  try {
    const data = await Feedback.find();
    console.log(`Encontradas ${data.length} feedback`);
    resp.json(data);
  } catch (error) {
    console.error('Error en GET ALL:', error);
    resp.status(500).json({ message: error.message });
  }
});

// GET - Obtener feedback por ID
route.get("/:id", async (req, resp) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return resp.status(404).json({ mensaje: "Feedback no encontrado" });
    }

    resp.json(feedback);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// PUT
route.put("/:id", async (req, resp) => {
  try {
    const actualizado = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return resp.status(404).json({ mensaje: "Feedback no encontrado" });
    }

    resp.json(actualizado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// DELETE
route.delete("/:id", async (req, resp) => {
  try {
    const eliminado = await Feedback.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return resp.status(404).json({ mensaje: "Feedback no encontrado" });
    }

    resp.json({ mensaje: "Feedback eliminado" });
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

module.exports = route;
