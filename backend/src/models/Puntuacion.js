const db = require('../config/database');

class Puntuacion {
  
  // Crear o actualizar puntuación de un anime
  static async createOrUpdate(userId, animeId, valor) {
    const query = `
      INSERT INTO Puntuacion (id_usuario, id_anime, valor)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE valor = ?, fecha_creada = CURRENT_TIMESTAMP
    `;
    
    const [result] = await db.execute(query, [userId, animeId, valor, valor]);
    return result;
  }
  
  // Obtener puntuación de un usuario para un anime
  static async getUserRating(userId, animeId) {
    const query = `
      SELECT * FROM Puntuacion
      WHERE id_usuario = ? AND id_anime = ?
    `;
    const [rows] = await db.execute(query, [userId, animeId]);
    return rows[0];
  }
  
  // Eliminar puntuación
  static async delete(userId, animeId) {
    const query = `
      DELETE FROM Puntuacion
      WHERE id_usuario = ? AND id_anime = ?
    `;
    const [result] = await db.execute(query, [userId, animeId]);
    return result.affectedRows;
  }
  
  // Obtener puntuación promedio de un anime
  static async getAverageRating(animeId) {
    const query = `
      SELECT 
        ROUND(AVG(valor), 2) as promedio,
        COUNT(*) as total_votos
      FROM Puntuacion
      WHERE id_anime = ?
    `;
    const [rows] = await db.execute(query, [animeId]);
    return rows[0];
  }
  
  // Obtener todas las puntuaciones de un usuario
  static async getUserRatings(userId) {
    const query = `
      SELECT p.*, a.titulo, a.imagen_portada
      FROM Puntuacion p
      INNER JOIN Anime a ON p.id_anime = a.id_anime
      WHERE p.id_usuario = ?
      ORDER BY p.fecha_creada DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
  
  // Obtener todas las puntuaciones de un anime
  static async getAnimeRatings(animeId, limit = 20, offset = 0) {
    const query = `
      SELECT p.*, u.nombre as usuario_nombre
      FROM Puntuacion p
      INNER JOIN Usuario u ON p.id_usuario = u.id_usuario
      WHERE p.id_anime = ?
      ORDER BY p.fecha_creada DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, [animeId, limit, offset]);
    return rows;
  }
}

module.exports = Puntuacion;