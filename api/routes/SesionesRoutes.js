const express = require("express");
const route = express.Router();
const Sesiones = require("../models/Sesiones");

// POST
route.post("/", async (req, resp) => {
  try {
    const sesion = new Sesiones(req.body);
    const guardado = await sesion.save();

    resp.status(201).json(guardado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// GET - Obtener todas las sesiones
route.get("/", async (req, resp) => {
  try {
    const sesiones = await Sesiones.find().populate("usuarioId");
    resp.json(sesiones);
  } catch (error) {
    resp.status(500).json({ mensaje: error.message });
  }
});

// GET - Obtener una sesión por ID
route.get("/:id", async (req, resp) => {
  try {
    const sesion = await Sesiones.findById(req.params.id);

    if (!sesion) {
      return resp.status(404).json({ mensaje: "Sesión no encontrada" });
    }

    resp.json(sesion);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// PUT
route.put("/:id", async (req, resp) => {
  try {
    const actualizada = await Sesiones.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizada) {
      return resp.status(404).json({ mensaje: "Sesión no encontrada" });
    }

    resp.json(actualizada);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// DELETE
route.delete("/:id", async (req, resp) => {
  try {
    const eliminada = await Sesiones.findByIdAndDelete(req.params.id);

    if (!eliminada) {
      return resp.status(404).json({ mensaje: "Sesión no encontrada" });
    }

    resp.json({ mensaje: "Sesión eliminada" });
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

module.exports = route;
