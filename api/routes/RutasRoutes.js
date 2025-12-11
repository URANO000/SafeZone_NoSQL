const express = require('express');
const route = express.Router();

const Ruta = require('../models/Rutas');

console.log("RutasRoutes cargado correctamente");

//Logger


//HTTP METHODS

//GET

route.get('/', async(req, resp) => {
    console.log("GET ALL RUTAS");
    try{
        const data = await Ruta.find();
        resp.json(data);

    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

//BY ID
route.get('/:id', async (req,resp) => {
    console.log("GET BY ID RECIBIDO");

    try{
        const ruta = await Ruta.findById(req.params.id);
        if(!ruta){
            return resp.status(404).json({message:"Ruta not found"});
        }

        resp.json(ruta);
    }catch(error){
        console.error('Error en GET BY ID:', error.message);
        resp.status(500).json({message:error.message});
    }
});

//POST
route.post('/', async(req,resp) => {
    const{
        usuarioId,
        origen,
        destino,
        camino,
        estatus,
        createdAt
    } = req.body;

    const newRuta = new Ruta(
        {
        usuarioId,
        origen,
        destino,
        camino,
        estatus,
        createdAt
        }
    );

    try{
        const saved = await newRuta.save();
        resp.status(201).json(saved);
        resp.status(201).json(saved);

    }catch (error){
        console.error('Error en POST:', error);
        resp.status(400).json({message: error.message});
    }
});


//PUT
route.put('/:id', async(req,resp) => {
    try{
        const updated = await Ruta.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        if(!updated){
            console.log("Ruta no encontrada");
            return resp.status(404).json({message:"Ruta not found"});
        }

        console.log("Ruta actualizada");
        resp.status(200).json(updated);

    }catch(error){
        console.error('Error en PUT:', error);
        resp.status(500).json({message:error.message});
    }
});

//DELETE
route.delete("/:id", async(req,resp) => {
    try{
        const deleted =  await Ruta.findByIdAndDelete(req.params.id);

        if(!deleted){
            console.log("Ruta no encontrada");
            return resp.status(404).json({message:"Ruta not found"});
        }

        resp.status(200).json({message:"Ruta deleted"});
    }catch(error){
        console.error('Error en DELETE:', error);
        resp.status(500).json({message:error.message});
    }
});

module.exports = route;