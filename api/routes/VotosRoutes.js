const express = require('express');
const route = express.Router();
const Votos = require('../models/Votos');

// ======================
// GET ALL VOTOS
// ======================
route.get('/', async (req, resp) => {
    try {
        const votosData = await Votos.find();
        resp.json(votosData);
    } catch (error) {
        resp.status(500).json({ message: error.message });
    }
});

// ======================
// GET BY ID
// ======================
route.get('/:id', async (req, resp) => {
    try {
        const voto = await Votos.findById(req.params.id);

        if (!voto) {
            return resp.status(404).json({ message: "Voto not found" });
        }

        return resp.json(voto);
    } catch (error) {
        return resp.status(500).json({ message: error.message });
    }
});

// ======================
// CREATE NEW VOTO
// ======================
route.post('/', async (req, resp) => {
    const { reporteId, usuarioId, voto } = req.body;

    const newVoto = new Votos({
        reporteId,
        usuarioId,
        voto
    });

    try {
        const savedVoto = await newVoto.save();
        console.log("Voto guardado:", savedVoto);
        return resp.status(201).json(savedVoto);

    } catch (error) {
        console.log("Validation error:", error.message);
        return resp.status(400).json({ message: error.message });
    }
});

// ======================
// UPDATE VOTO
// ======================
route.put('/:id', async (req, resp) => {
    try {
        const votoUpdated = await Votos.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!votoUpdated) {
            return resp.status(404).json({ message: "Voto not found" });
        }

        return resp.status(200).json(votoUpdated);

    } catch (error) {
        return resp.status(500).json({ message: error.message });
    }
});

// ======================
// DELETE VOTO
// ======================
route.delete('/:id', async (req, resp) => {
    try {
        const votoDeleted = await Votos.findByIdAndDelete(req.params.id);

        if (!votoDeleted) {
            return resp.status(404).json({ message: "Voto not found" });
        }

        return resp.json({ message: "Voto deleted successfully" });

    } catch (error) {
        return resp.status(500).json({ message: error.message });
    }
});

module.exports = route;
