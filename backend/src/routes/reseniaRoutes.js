const express = require('express');
const router = express.Router();
const reseniaController = require('../controllers/reseniaController');
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.get('/:id', reseniaController.getReviewById);
router.get('/anime/:animeId', reseniaController.getAnimeReviews);

// Rutas protegidas
router.post('/anime/:animeId', authMiddleware, reseniaController.createReview);
router.get('/user/my-reviews', authMiddleware, reseniaController.getUserReviews);
router.put('/:id', authMiddleware, reseniaController.updateReview);
router.delete('/:id', authMiddleware, reseniaController.deleteReview);

module.exports = router;