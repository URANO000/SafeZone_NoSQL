const express = require('express');
const route = express.Router();

const Zona = require('../models/Zonas');

console.log('📦 ZonasRoutes cargado correctamente');

//-------------------HTTP METHODS-----------------------

//Get o Select ALL
route.get('/', async (req, resp) => {
    console.log('📥 GET ALL zonas');
    try{
        const zonaData = await Zona.find();
        console.log(`✅ Encontradas ${zonaData.length} zonas`);
        resp.json(zonaData);
    }catch(error){
        console.error('❌ Error en GET ALL:', error);
        resp.status(500).json({message:error.message});
    }
});

//Get o Select BY ID
route.get('/:id', async (req, resp) => {
    console.log('📥 GET BY ID recibido');
    console.log('   ID solicitado:', req.params.id);
    console.log('   URL completa:', req.originalUrl);
    
    try{
        const zona = await Zona.findById(req.params.id);
        
        if(!zona){
            console.log('❌ Zona NO encontrada con ID:', req.params.id);
            return resp.status(404).json({message:"Zona not found"});
        }
        
        console.log('✅ Zona encontrada:', zona.nombre);
        resp.json(zona);
    }catch(error){
        console.error('❌ Error en GET BY ID:', error.message);
        resp.status(500).json({message:error.message});
    }
});

//Post o create
route.post('/', async (req, resp) => {
    console.log('📥 POST nueva zona');
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
        console.log('✅ Zona guardada:', savedZona.nombre);
        resp.status(201).json(savedZona);
    }catch (error){
        console.error('❌ Error en POST:', error);
        resp.status(400).json({message: error.message});
    }
});

//Put o Update
route.put('/:id', async(req,resp) => {
    console.log('📥 PUT actualizar zona');
    console.log('   ID:', req.params.id);
    
    try{
        const zonaUpdated = await Zona.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        if(!zonaUpdated){
            console.log('❌ Zona no encontrada para actualizar');
            return resp.status(404).json({message:"Zona not found"});
        }

        console.log('✅ Zona actualizada:', zonaUpdated.nombre);
        resp.status(200).json(zonaUpdated);
    }catch(error){
        console.error('❌ Error en PUT:', error);
        resp.status(500).json({message:error.message});
    }
});

//Delete
route.delete('/:id', async(req,resp) => {
    console.log('📥 DELETE zona');
    console.log('   ID:', req.params.id);
    
    try{
        const zonaDeleted = await Zona.findByIdAndDelete(req.params.id);

        if(!zonaDeleted){
            console.log('❌ Zona no encontrada para eliminar');
            return resp.status(404).json({message:"Zona not found"});
        }

        console.log('✅ Zona eliminada:', zonaDeleted.nombre);
        resp.status(200).json({message: "Zona deleted"});
    }catch(error){
        console.error('❌ Error en DELETE:', error);
        resp.status(500).json({message:error.message});
    }
});

console.log('✅ Todas las rutas de Zona configuradas:');
console.log('   GET    /');
console.log('   GET    /:id');
console.log('   POST   /');
console.log('   PUT    /:id');
console.log('   DELETE /:id');

module.exports = route;
