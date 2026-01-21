const db = require('../config/database');

class Resenia {
  
  // Crear una reseña
  static async create(userId, animeId, texto) {
    const query = `
      INSERT INTO Reseña (id_usuario, id_anime, texto)
      VALUES (?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [userId, animeId, texto]);
    return result.insertId;
  }
  
  // Obtener una reseña por ID
  static async findById(reseñaId) {
    const query = `
      SELECT r.*, u.nombre as usuario_nombre, a.titulo as anime_titulo
      FROM Reseña r
      INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
      INNER JOIN Anime a ON r.id_anime = a.id_anime
      WHERE r.id_reseña = ?
    `;
    const [rows] = await db.execute(query, [reseñaId]);
    return rows[0];
  }
  
  // Obtener todas las reseñas de un anime
  static async getByAnimeId(animeId, limit = 20, offset = 0) {
    const query = `
      SELECT r.*, u.nombre as usuario_nombre
      FROM Reseña r
      INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
      WHERE r.id_anime = ?
      ORDER BY r.fecha DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, [animeId, limit, offset]);
    return rows;
  }
  
  // Obtener todas las reseñas de un usuario
  static async getByUserId(userId) {
    const query = `
      SELECT r.*, a.titulo as anime_titulo, a.imagen_portada
      FROM Reseña r
      INNER JOIN Anime a ON r.id_anime = a.id_anime
      WHERE r.id_usuario = ?
      ORDER BY r.fecha DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
  
  // Verificar si un usuario ya reseñó un anime
  static async userHasReviewed(userId, animeId) {
    const query = `
      SELECT id_reseña FROM Reseña
      WHERE id_usuario = ? AND id_anime = ?
    `;
    const [rows] = await db.execute(query, [userId, animeId]);
    return rows[0];
  }
  
  // Actualizar una reseña
  static async update(reseñaId, userId, texto) {
    const query = `
      UPDATE Reseña
      SET texto = ?
      WHERE id_reseña = ? AND id_usuario = ?
    `;
    
    const [result] = await db.execute(query, [texto, reseñaId, userId]);
    return result.affectedRows;
  }
  
  // Eliminar una reseña
  static async delete(reseñaId, userId) {
    const query = `
      DELETE FROM Reseña
      WHERE id_reseña = ? AND id_usuario = ?
    `;
    
    const [result] = await db.execute(query, [reseñaId, userId]);
    return result.affectedRows;
  }
  
  // Contar reseñas de un anime
  static async countByAnimeId(animeId) {
    const query = `
      SELECT COUNT(*) as total
      FROM Reseña
      WHERE id_anime = ?
    `;
    const [rows] = await db.execute(query, [animeId]);
    return rows[0].total;
  }
}

module.exports = Resenia;