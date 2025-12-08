const express = require('express');
const route = express.Router();

const Log = require('../models/Activity_logs');

//HTTP METHODS
//ESTOS SON DIFERENTES. LOS LOGS NO SE MODIFICAN NI SE ELIMINAN
//EL POST FUNCIONA POR LA MISMA BASE DE DATOS
route.get('/', async(req,resp)=> {
    console.log("GET ALL activity log");
    try{
        const data = await Log.find();
        resp.json(data);
    }catch(error){
        console.error('Error en GET ALL:', error);
        resp.status(500).json({message:error.message});
    }
});

//GET BY ID
route.get('/:id', async (req,resp) => {
    try{
        const log = await Log.findById(req.params.id);

        if(!log){
            return resp.status(404).json({message:"Log not found"});
        }

        resp.json(log);

    }catch(error){
        console.error('Error en GET BY ID:', error.message);
        resp.status(500).json({message:error.message});
    }
});

module.exports = route;