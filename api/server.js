const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const zonasRoutes = require('./routes/ZonasRoutes');
const usuariosRoutes = require('./routes/UsuariosRoutes'); 
const votosRoutes = require('./routes/VotosRoutes');
const reporteRoutes = require('./routes/ReportesRoutes');
const rutasRoutes = require('./routes/RutasRoutes');
const activityRoutes = require('./routes/Activity_logsRoutes');
const adminRoutes = require('./routes/Admin_logRoutes');
const mediaRoutes = require('./routes/MediaRoutes');

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
app.use('/api/reportes', reporteRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);



console.log('Rutas registradas:');
console.log('   - /api/zona');
console.log('   - /api/usuarios');
console.log('   -/api/votos');
console.log('   -/api/reportes');
console.log('   -/api/rutas');
console.log('   -/api/activity');
console.log('   -/api/admin');



// Initialize server
app.listen(PORT, () => {
    console.log(`Server is turned on http://localhost:${PORT}`);
});
