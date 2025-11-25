//Crea ek server orincipal

//npm install express mongoose body-parser cors
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); //URL and HTTPS

//const routes
const zonasRoutes = require('./routes/ZonasRoutes');
const usuariosRoutes = require('./routes/UsuariosRoutes'); 

const app = express();
const PORT = 7000;

//Middlewares (Urls of the site)
app.use(cors());
app.use(bodyParser.json());



//Mongo Connection
mongoose.connect('mongodb://localhost:27017/SafeZone', {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => console.log('Mongo DB Success'))
.catch(err => console.log('Mongo DB error:', err));

//Routes
app.use('/api/zona', zonasRoutes);
app.use('/api/usuarios', usuariosRoutes);
// app.use('/api/estudiante', usuariosRoutes);

//Initialize server with arrow function
app.listen(PORT, ()=>{
    console.log(`Server is turned on https://localhost:${PORT}`);
});