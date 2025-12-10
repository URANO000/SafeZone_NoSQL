const express = require("express");
const route = express.Router();
const Comentarios = require("../models/Comentarios");

// POST - Crear comentario
route.post("/", async (req, resp) => {
  try {
    const comentario = new Comentarios(req.body);
    const guardado = await comentario.save();

    resp.status(201).json(guardado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// GET
route.get("/", async (req, resp) => {
  try {
    const comentarios = await Comentarios.find()
      .populate("usuarioId reporteId");

    resp.json(comentarios);
  } catch (error) {
    resp.status(500).json({ mensaje: error.message });
  }
});

// GET - Obtener comentario por ID
route.get("/:id", async (req, resp) => {
  try {
    const comentario = await Comentarios.findById(req.params.id);

    if (!comentario) {
      return resp.status(404).json({ mensaje: "Comentario no encontrado" });
    }

    resp.json(comentario);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// GET - Obtener comentarios de un reporte específico
route.get("/reporte/:reporteId", async (req, resp) => {
  try {
    const comentarios = await Comentarios.find({
      reporteId: req.params.reporteId,
    }).populate("usuarioId");

    resp.json(comentarios);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// PUT
route.put("/:id", async (req, resp) => {
  try {
    const actualizado = await Comentarios.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return resp.status(404).json({ mensaje: "Comentario no encontrado" });
    }

    resp.json(actualizado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// DELETE
route.delete("/:id", async (req, resp) => {
  try {
    const eliminado = await Comentarios.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return resp.status(404).json({ mensaje: "Comentario no encontrado" });
    }

    resp.json({ mensaje: "Comentario eliminado" });
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

module.exports = route;
