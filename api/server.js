const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const zonasRoutes = require('./routes/ZonasRoutes');
const usuariosRoutes = require('./routes/UsuariosRoutes'); 
const votosRoutes = require('./routes/VotosRoutes');

const app = express();
const PORT = 7000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// IMPORTANTE: Logger middleware para debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Mongo Connection
mongoose.connect('mongodb://localhost:27017/SafeZone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(' Mongo DB Success'))
.catch(err => console.log(' Mongo DB error:', err));

// Routes
app.use('/api/zona', zonasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/votos', votosRoutes);

console.log('Rutas registradas:');
console.log('   - /api/zona');
console.log('   - /api/usuarios');
console.log('   -/api/votos');

// Initialize server
app.listen(PORT, () => {
    console.log(`Server is turned on http://localhost:${PORT}`);
});
