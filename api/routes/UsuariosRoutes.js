//HENRY - GET, POST, PUT, DELETE

const express = require("express");
const route = express.Router();
const Usuarios = require("../models/Usuarios");

// POST
route.post("/", async (req, resp) => {
    const {
        nombre,
        email,
        passwordHash,
        rol,
        verificado,
        preferencias
    } = req.body;

    const nuevoUsuario = new Usuarios({
        nombre,
        email,
        passwordHash,
        rol,
        verificado,
        preferencias
    });

    try {
        const usuarioGuardado = await nuevoUsuario.save();
        resp.status(201).json(usuarioGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// PUT
route.put("/:id", async (req, resp) => {
    try {
        const usuarioActualizado = await Usuarios.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!usuarioActualizado) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.status(200).json(usuarioActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// DELETE
route.delete("/:id", async (req, resp) => {
    try {
        const usuarioEliminado = await Usuarios.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.status(200).json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// GET
route.get("/", async (req, resp) => {
    try {
        const usuarios = await Usuarios.find();
        resp.json(usuarios);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// GET pero para obtener usuario por ID
route.get("/:id", async (req, resp) => {
    try {
        const usuario = await Usuarios.findById(req.params.id);

        if (!usuario) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.json(usuario);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;
