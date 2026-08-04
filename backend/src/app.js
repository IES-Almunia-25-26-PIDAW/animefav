
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}`),
});

const { validateEnv } = require('./config/env');
validateEnv();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API Anime Tracker funcionando 🚀' });
});

const userRoutes = require('./routes/userRoutes');
const jikanRoutes = require('./routes/jikanRoutes');
const animeRoutes = require('./routes/animeRoutes');
const listaRoutes = require('./routes/listaRoutes');
const puntuacionRoutes = require('./routes/puntuacionRoutes');
const reseniaRoutes = require('./routes/reseniaRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/jikan', jikanRoutes);
app.use('/api/animes', animeRoutes);
app.use('/api/listas', listaRoutes);
app.use('/api/puntuaciones', puntuacionRoutes);
app.use('/api/resenias', reseniaRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;