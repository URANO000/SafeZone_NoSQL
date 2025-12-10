const express = require("express");
const route = express.Router();
const Alertas = require("../models/Alertas");

// POST
route.post("/", async (req, resp) => {
  try {
    const alerta = new Alertas(req.body);
    const guardada = await alerta.save();

    resp.status(201).json(guardada);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// GET - Obtener todas las alertas
route.get("/", async (req, resp) => {
  try {
    const alertas = await Alertas.find().populate("usuarioId");
    resp.json(alertas);
  } catch (error) {
    resp.status(500).json({ mensaje: error.message });
  }
});

// GET - Obtener alerta por ID
route.get("/:id", async (req, resp) => {
  try {
    const alerta = await Alertas.findById(req.params.id);

    if (!alerta) {
      return resp.status(404).json({ mensaje: "Alerta no encontrada" });
    }

    resp.json(alerta);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// PUT
route.put("/:id", async (req, resp) => {
  try {
    const actualizado = await Alertas.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return resp.status(404).json({ mensaje: "Alerta no encontrada" });
    }

    resp.json(actualizado);
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

// DELETE
route.delete("/:id", async (req, resp) => {
  try {
    const eliminada = await Alertas.findByIdAndDelete(req.params.id);

    if (!eliminada) {
      return resp.status(404).json({ mensaje: "Alerta no encontrada" });
    }

    resp.json({ mensaje: "Alerta eliminada" });
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

//Nota: Esto nos ayuda a poder marcar alerta como leída

// PATCH
route.patch("/:id/leido", async (req, resp) => {
  try {
    const alerta = await Alertas.findByIdAndUpdate(
      req.params.id,
      { leido: true },
      { new: true }
    );

    if (!alerta) {
      return resp.status(404).json({ mensaje: "Alerta no encontrada" });
    }

    resp.json({ mensaje: "Alerta marcada como leída", alerta });
  } catch (error) {
    resp.status(400).json({ mensaje: error.message });
  }
});

module.exports = route;
