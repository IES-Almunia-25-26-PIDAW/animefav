const db = require('../config/database');

class Lista {
  
  // Listas predeterminadas que se crean automáticamente
  static LISTAS_PREDETERMINADAS = [
    'Watching',
    'Completed',
    'On-Hold',
    'Dropped',
    'Plan to Watch'
  ];
  
  // Crear listas predeterminadas para un usuario nuevo
  static async createDefaultLists(userId) {
    const values = this.LISTAS_PREDETERMINADAS.map(nombre => [nombre, 'predeterminada', userId]);
    const placeholders = values.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();
    
    const query = `INSERT INTO Lista (nombre, tipo, id_usuario) VALUES ${placeholders}`;
    await db.execute(query, flatValues);
  }
  
  // Crear una lista personalizada
  static async create(userId, nombre) {
    const query = `
      INSERT INTO Lista (nombre, tipo, id_usuario)
      VALUES (?, 'personalizada', ?)
    `;
    
    const [result] = await db.execute(query, [nombre, userId]);
    return result.insertId;
  }
  
  // Obtener todas las listas de un usuario
  static async getByUserId(userId) {
    const query = `
      SELECT id_lista, nombre, tipo, fecha_creacion 
      FROM Lista 
      WHERE id_usuario = ?
      ORDER BY tipo DESC, nombre ASC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
  
  // Obtener una lista específica
  static async findById(listaId, userId) {
    const query = `
      SELECT id_lista, nombre, tipo, fecha_creacion 
      FROM Lista 
      WHERE id_lista = ? AND id_usuario = ?
    `;
    const [rows] = await db.execute(query, [listaId, userId]);
    return rows[0];
  }
  
  // Actualizar nombre de lista (solo personalizadas)
  static async update(listaId, userId, nuevoNombre) {
    const query = `
      UPDATE Lista 
      SET nombre = ?
      WHERE id_lista = ? AND id_usuario = ? AND tipo = 'personalizada'
    `;
    
    const [result] = await db.execute(query, [nuevoNombre, listaId, userId]);
    return result.affectedRows;
  }
  
  // Eliminar lista (solo personalizadas)
  static async delete(listaId, userId) {
    const query = `
      DELETE FROM Lista 
      WHERE id_lista = ? AND id_usuario = ? AND tipo = 'personalizada'
    `;
    
    const [result] = await db.execute(query, [listaId, userId]);
    return result.affectedRows;
  }
  
  // Agregar anime a una lista
  static async addAnime(listaId, animeId) {
    const query = `
      INSERT INTO Lista_Anime (id_lista, id_anime)
      VALUES (?, ?)
    `;
    
    try {
      await db.execute(query, [listaId, animeId]);
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return false; // Ya existe en la lista
      }
      throw error;
    }
  }
  
  // Eliminar anime de una lista
  static async removeAnime(listaId, animeId) {
    const query = `
      DELETE FROM Lista_Anime 
      WHERE id_lista = ? AND id_anime = ?
    `;
    
    const [result] = await db.execute(query, [listaId, animeId]);
    return result.affectedRows;
  }
  
  // Obtener todos los animes de una lista
  static async getAnimes(listaId) {
    const query = `
      SELECT a.*, la.fecha_añadido
      FROM Anime a
      INNER JOIN Lista_Anime la ON a.id_anime = la.id_anime
      WHERE la.id_lista = ?
      ORDER BY la.fecha_añadido DESC
    `;
    
    const [rows] = await db.execute(query, [listaId]);
    return rows;
  }
}

module.exports = Lista;