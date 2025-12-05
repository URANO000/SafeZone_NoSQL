const express = require('express');
const route = express.Router();

const Votos = require('../models/Votos');

console.log('Votos cargados correctamente');

//-------------------HTTP------------------------------------
route.get('/', async (req,resp) => {
    console.log("Get all votos");
    try{
        const votosData = await Votos.find();
        resp.json(votosData);
    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

//Get by id
route.gwt('/:id', async (req,resp) => {
    try{
        const voto = await Votos.findById(req.params.id);
        if(!voto){
            return resp.status(404).json({message:"Voto not found"});
        }

    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

//Post
route.post('/', async(req,resp) => {
    console.log("POST new voto");
    const {
        reporteId,
        usuarioId,
        voto
    } = req.body;

    const newVoto = new Votos(
        {
        reporteId,
        usuarioId,
        voto
        }
    );

    try{
        const savedVoto = await newVoto.save();
        console.log('Voto guardado:', savedVoto.voto);

    }catch(error){
        resp.status(400).json({message: error.message});
    }
});

//----POST
route.put('/:id', async(req,resp) => {
    console.log('Put actualizar voto');

    try{
        const votoUpdated = await Votos.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        if(!votoUpdated){
            return resp.status(404).json({message: "Voto not found"});
        }

        resp.status(200).json(votoUpdated);

    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

//---DELETE
route.delete('/:id', async(req,resp) => {
    try{
        const votoDeleted = await Votos.findByIdAndDelete(req.params.id);

        if(!votoDeleted){
            return resp.status(404).json({message:"Voto not found to delete"});
        }

    }catch(error){
        resp.status(500).json({message:error.message});
    }
});

module.exports = route;