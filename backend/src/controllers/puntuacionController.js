const Puntuacion = require('../models/Puntuacion');
const Anime = require('../models/Anime');

// Crear o actualizar puntuación
const rateAnime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { animeId } = req.params;
    const { valor } = req.body;
    
    // Validar que el valor esté entre 1 y 10
    if (!valor || valor < 1 || valor > 10) {
      return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 10' });
    }
    
    // Verificar que el anime existe
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ error: 'Anime no encontrado' });
    }
    
    await Puntuacion.createOrUpdate(userId, animeId, valor);
    
    // Obtener nueva puntuación promedio
    const average = await Puntuacion.getAverageRating(animeId);
    
    res.status(201).json({
      message: 'Puntuación guardada exitosamente',
      puntuacion: valor,
      promedio: average.promedio,
      total_votos: average.total_votos
    });
    
  } catch (error) {
    console.error('Error en rateAnime:', error);
    res.status(500).json({ error: 'Error al guardar puntuación' });
  }
};

// Obtener puntuación del usuario para un anime
const getUserRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { animeId } = req.params;
    
    const rating = await Puntuacion.getUserRating(userId, animeId);
    
    if (!rating) {
      return res.status(404).json({ error: 'No has puntuado este anime' });
    }
    
    res.json(rating);
    
  } catch (error) {
    console.error('Error en getUserRating:', error);
    res.status(500).json({ error: 'Error al obtener puntuación' });
  }
};

// Eliminar puntuación
const deleteRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { animeId } = req.params;
    
    const affectedRows = await Puntuacion.delete(userId, animeId);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No has puntuado este anime' });
    }
    
    res.json({ message: 'Puntuación eliminada exitosamente' });
    
  } catch (error) {
    console.error('Error en deleteRating:', error);
    res.status(500).json({ error: 'Error al eliminar puntuación' });
  }
};

// Obtener puntuación promedio de un anime
const getAverageRating = async (req, res) => {
  try {
    const { animeId } = req.params;
    
    const average = await Puntuacion.getAverageRating(animeId);
    
    res.json({
      promedio: average.promedio || 0,
      total_votos: average.total_votos || 0
    });
    
  } catch (error) {
    console.error('Error en getAverageRating:', error);
    res.status(500).json({ error: 'Error al obtener puntuación promedio' });
  }
};

// Obtener todas las puntuaciones del usuario
const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const ratings = await Puntuacion.getUserRatings(userId);
    
    res.json(ratings);
    
  } catch (error) {
    console.error('Error en getUserRatings:', error);
    res.status(500).json({ error: 'Error al obtener puntuaciones' });
  }
};

// Obtener todas las puntuaciones de un anime
const getAnimeRatings = async (req, res) => {
  try {
    const { animeId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const ratings = await Puntuacion.getAnimeRatings(animeId, parseInt(limit), parseInt(offset));
    
    res.json(ratings);
    
  } catch (error) {
    console.error('Error en getAnimeRatings:', error);
    res.status(500).json({ error: 'Error al obtener puntuaciones' });
  }
};

module.exports = {
  rateAnime,
  getUserRating,
  deleteRating,
  getAverageRating,
  getUserRatings,
  getAnimeRatings
};