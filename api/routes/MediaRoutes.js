const express = require("express");
const route = express.Router();
const Media = require("../models/Media");

// POST
route.post("/", async (req, resp) => {
  try {
    const media = new Media(req.body);
    const guardado = await media.save();

    resp.status(201).json(guardado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// GET - Obtener todos los media
route.get("/", async (req, resp) => {
  try {
    const media = await Media.find().populate("usuarioId reporteId");
    resp.json(media);
  } catch (error) {
    resp.status(500).json({ mensaje: error.message });
  }
});

// GET - Obtener media por ID
route.get("/:id", async (req, resp) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return resp.status(404).json({ mensaje: "Media no encontrado" });
    }

    resp.json(media);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// PUT
route.put("/:id", async (req, resp) => {
  try {
    const actualizado = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return resp.status(404).json({ mensaje: "Media no encontrado" });
    }

    resp.json(actualizado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// DELETE
route.delete("/:id", async (req, resp) => {
  try {
    const eliminado = await Media.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return resp.status(404).json({ mensaje: "Media no encontrado" });
    }

    resp.json({ mensaje: "Media eliminado" });
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

module.exports = route;
