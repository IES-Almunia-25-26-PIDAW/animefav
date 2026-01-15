const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.get('/', animeController.getAllAnimes);
router.get('/search', animeController.searchAnime);
router.get('/:id', animeController.getAnimeById);
router.get('/:id/genres', animeController.getAnimeGenres);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, animeController.createAnime);
router.put('/:id', authMiddleware, animeController.updateAnime);
router.delete('/:id', authMiddleware, animeController.deleteAnime);

module.exports = router;