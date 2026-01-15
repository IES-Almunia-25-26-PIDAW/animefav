const axios = require('axios');

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

class JikanService {
  
  // Buscar animes por título
  static async searchAnime(query, page = 1, limit = 25) {
    try {
      const response = await axios.get(`${JIKAN_BASE_URL}/anime`, {
        params: {
          q: query,
          page: page,
          limit: limit,
          sfw: true // Safe for work
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error buscando anime:', error);
      throw error;
    }
  }
  
  // Obtener anime por ID de MAL
  static async getAnimeById(malId) {
    try {
      const response = await axios.get(`${JIKAN_BASE_URL}/anime/${malId}/full`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo anime:', error);
      throw error;
    }
  }
  
  // Obtener los animes más populares
  static async getTopAnime(page = 1, limit = 25) {
    try {
      const response = await axios.get(`${JIKAN_BASE_URL}/top/anime`, {
        params: {
          page: page,
          limit: limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo top animes:', error);
      throw error;
    }
  }
  
  // Obtener animes de la temporada actual
  static async getCurrentSeason(page = 1) {
    try {
      const response = await axios.get(`${JIKAN_BASE_URL}/seasons/now`, {
        params: {
          page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo temporada actual:', error);
      throw error;
    }
  }
  
  // Obtener géneros disponibles
  static async getGenres() {
    try {
      const response = await axios.get(`${JIKAN_BASE_URL}/genres/anime`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo géneros:', error);
      throw error;
    }
  }
  
  // Buscar animes por género
  static async getAnimeByGenre(genreId, page = 1) {
    try {
      const response = await axios.get(`${JIKAN_BASE_URL}/anime`, {
        params: {
          genres: genreId,
          page: page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo animes por género:', error);
      throw error;
    }
  }
  
  // Formatear anime de Jikan a nuestro formato
  static formatAnimeForDB(jikanAnime) {
    return {
      titulo: jikanAnime.title || jikanAnime.title_english || 'Sin título',
      descripcion: jikanAnime.synopsis || '',
      fecha_estreno: jikanAnime.aired?.from ? jikanAnime.aired.from.split('T')[0] : null,
      num_episodios: jikanAnime.episodes || 0,
      edad_recomendada: jikanAnime.rating || 'Unknown',
      imagen_portada: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || '',
      mal_id: jikanAnime.mal_id // Para referencia
    };
  }
}

module.exports = JikanService;