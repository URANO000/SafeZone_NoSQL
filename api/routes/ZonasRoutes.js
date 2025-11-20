const express = require('express');
const route = express.Router();

const Zona = require('../models/Zonas');

//-------------------HTTP METHODS-----------------------
//Post o create
route.post('/', async (req, resp) => {
    const {
        nombre,
        coordenadas,
        radio,
        estatus,
        descripcion,
        lastUpdated
    } = req.body;

    const newZona = new Zona(
        {
            nombre,
            coordenadas,
            radio,
            estatus,
            descripcion,
            lastUpdated

        }
    );

    try{
        const savedZona = await newZona.save();
        resp.status(201).json(savedZona);
    }catch (error){
        resp.status(400).json({message: error.message});
    }
});

//Get o Select
route.get('/', async (req, resp) => {
    try{
        const zonaData = await Zona.find();
        resp.json(zonaData);

    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

//Put o Update
route.put('/:id', async(req,resp) => {
    try{
        const zonaUpdated = await Zona.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        //if not found
        if(!zonaUpdated){
            return resp.status(400).json({message:"Zona not found"});
        }

        resp.status(200).json(zonaUpdated);
    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

//---Delete
route.delete('/:id', async(req,resp) => {
    try{
        const zonaDeleted = await Zona.findByIdAndDelete(
            req.params.id,
            req.body,
            {new:true}
        );

        //if not found
        if(!zonaDeleted){
            return resp.status(400).json({message:"Zona not found"});
        }

        resp.status(200).json({message: "Zona deleted"});
    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

module.exports = route;