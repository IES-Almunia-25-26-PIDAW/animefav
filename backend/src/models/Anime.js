const db = require('../config/database');

class Anime {

  // Obtener todos los animes
  static async getAll() {
    const query = 'SELECT * FROM Anime';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Obtener un anime por ID
  static async getById(id) {
    const query = 'SELECT * FROM Anime WHERE id_anime = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Crear un nuevo anime
  static async create(animeData) {
    const { titulo, descripcion, fecha_estreno, num_episodios, edad_recomendada, imagen_portada } = animeData;
    const query = `
      INSERT INTO Anime (titulo, descripcion, fecha_estreno, num_episodios, edad_recomendada, imagen_portada)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [titulo, descripcion, fecha_estreno, num_episodios, edad_recomendada, imagen_portada]);
    return result.insertId;
  }

  // Actualizar un anime
  static async update(id, animeData) {
    const { titulo, descripcion, fecha_estreno, num_episodios, edad_recomendada, imagen_portada } = animeData;
    const query = `
      UPDATE Anime
      SET titulo=?, descripcion=?, fecha_estreno=?, num_episodios=?, edad_recomendada=?, imagen_portada=?
      WHERE id_anime=?
    `;
    const [result] = await db.execute(query, [titulo, descripcion, fecha_estreno, num_episodios, edad_recomendada, imagen_portada, id]);
    return result.affectedRows;
  }

  // Eliminar un anime
  static async delete(id) {
    const query = 'DELETE FROM Anime WHERE id_anime=?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Anime;
