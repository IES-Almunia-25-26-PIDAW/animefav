const JikanService = require('../services/jikanService');
const Anime = require('../models/Anime');

// Buscar animes en Jikan
const searchAnime = async (req, res) => {
  try {
    const { query, page = 1, limit = 25 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const result = await JikanService.searchAnime(query, page, limit);
    
    res.json({
      data: result.data,
      pagination: result.pagination
    });
    
  } catch (error) {
    console.error('Error en searchAnime:', error);
    res.status(500).json({ error: 'Error al buscar animes' });
  }
};

// Obtener anime por ID de MAL
const getAnimeById = async (req, res) => {
  try {
    const { malId } = req.params;
    
    const anime = await JikanService.getAnimeById(malId);
    
    res.json(anime);
    
  } catch (error) {
    console.error('Error en getAnimeById:', error);
    res.status(500).json({ error: 'Error al obtener anime' });
  }
};

// Obtener top animes
const getTopAnime = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    
    const result = await JikanService.getTopAnime(page, limit);
    
    res.json({
      data: result.data,
      pagination: result.pagination
    });
    
  } catch (error) {
    console.error('Error en getTopAnime:', error);
    res.status(500).json({ error: 'Error al obtener top animes' });
  }
};

// Obtener temporada actual
const getCurrentSeason = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const result = await JikanService.getCurrentSeason(page);
    
    res.json({
      data: result.data,
      pagination: result.pagination
    });
    
  } catch (error) {
    console.error('Error en getCurrentSeason:', error);
    res.status(500).json({ error: 'Error al obtener temporada actual' });
  }
};

// Obtener géneros
const getGenres = async (req, res) => {
  try {
    const genres = await JikanService.getGenres();
    res.json(genres);
  } catch (error) {
    console.error('Error en getGenres:', error);
    res.status(500).json({ error: 'Error al obtener géneros' });
  }
};

// Importar anime de Jikan a nuestra base de datos
const importAnime = async (req, res) => {
  try {
    const { malId } = req.params;
    
    // Obtener anime de Jikan
    const jikanAnime = await JikanService.getAnimeById(malId);
    
    // Formatear para nuestra BD
    const animeData = JikanService.formatAnimeForDB(jikanAnime);
    
    // Guardar en nuestra BD
    const animeId = await Anime.create(animeData);
    
    res.status(201).json({
      message: 'Anime importado exitosamente',
      animeId,
      anime: animeData
    });
    
  } catch (error) {
    console.error('Error en importAnime:', error);
    res.status(500).json({ error: 'Error al importar anime' });
  }
};

module.exports = {
  searchAnime,
  getAnimeById,
  getTopAnime,
  getCurrentSeason,
  getGenres,
  importAnime
};