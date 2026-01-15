const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Anime Tracker funcionando 🚀' });
});

// Importar rutas (solo una vez cada una)
const userRoutes = require('./src/routes/userRoutes');
const jikanRoutes = require('./src/routes/jikanRoutes');
const animeRoutes = require('./src/routes/animeRoutes');

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/jikan', jikanRoutes);
app.use('/api/animes', animeRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔗 Abre http://localhost:${PORT} en tu navegador`);
});