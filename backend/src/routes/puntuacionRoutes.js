const express = require('express');
const router = express.Router();
const puntuacionController = require('../controllers/puntuacionController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación excepto ver promedios
router.get('/animes/:animeId/average', puntuacionController.getAverageRating);
router.get('/animes/:animeId/ratings', puntuacionController.getAnimeRatings);

// Rutas protegidas
router.post('/animes/:animeId/rate', authMiddleware, puntuacionController.rateAnime);
router.get('/animes/:animeId/my-rating', authMiddleware, puntuacionController.getUserRating);
router.delete('/animes/:animeId/rate', authMiddleware, puntuacionController.deleteRating);
router.get('/my-ratings', authMiddleware, puntuacionController.getUserRatings);

module.exports = router;