const express = require('express');
const route = express.Router();

const Reporte = require('../models/Reportes');

console.log('ReportesRoutes cargado correctamente');

//-------------------------HTTP METHODS----------------

route.get('/', async(req, resp) => {
   console.log("Get all reportes");
   try{
    const data = await Reporte.find(); //findall
    resp.json(data);
   } catch(error){
    resp.status(500).json({message:error.message});
   }
});

//Get by id
route.get('/:id', async (req, resp) => {
    console.log("Get by id");

    try {
        const reportes = await Reporte.findById(req.params.id);

        if (!reportes) {
            console.log('Reporte no encontrado');
            return resp.status(404).json({ message: "Reporte not found" });
        }

        resp.json(reportes);

    } catch (error) {
        console.error('Error en GET BY ID:', error.message);
        resp.status(500).json({ message: error.message });
    }
});


//Post o create
route.post('/', async (req, resp) => {
    console.log('POST nuevo reporte');
    const {
        descripcion,
        estatus,
        mediaIds,
        severidad,
        timestamp,
        tipo,
        usuarioId,
        zonaId
    } = req.body;

    const newReporte = new Reporte(
        {
        descripcion,
        estatus,
        mediaIds,
        severidad,
        timestamp,
        tipo,
        usuarioId,
        zonaId
        }
    );

    try{
        const saved = await newReporte.save();
        console.log('Reporte guardado:', saved.descripcion);
        resp.status(201).json(saved);
    }catch(error){
        resp.status(400).json({message:error.message});
    }
});


//Put o Update
route.put('/:id', async(req,resp) => {
    try{
        const updated = await Reporte.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        if(!updated){
            console.log('Reporte no encontrado');
            return resp.status(404).json({message:"Reporte not found"});
        }

        console.log("Reporte actualizado");
        resp.status(200).json(updated);
    }catch(error){
        resp.status(500).json({message: error.message});
    }
});

//DELETE
route.delete('/:id', async(req,resp) => {
    try{
        const deleted = await Reporte.findByIdAndDelete(req.params.id);

        if(!deleted){
            console.log("Reporte no encontrado");
            return resp.status(404).json({message:"Reporte not found"});
        }
        console.log("Reporte eliminado");
        resp.status(200).json({message:"Reporte deleted"});

    }catch(error){
        resp.status(500).json({message:error.message});
    }
});


module.exports = route;

