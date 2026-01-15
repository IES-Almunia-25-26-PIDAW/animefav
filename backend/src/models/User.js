const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {

  // Crear un nuevo usuario
  static async create(userData) {
    const { nombre, email, contraseña, fecha_nacimiento } = userData;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = `
      INSERT INTO Usuario (nombre, email, contraseña, fecha_nacimiento)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [nombre, email, hashedPassword, fecha_nacimiento]);
    const userId = result.insertId;
    
    // Crear listas predeterminadas para el nuevo usuario
    const Lista = require('./Lista');
    await Lista.createDefaultLists(userId);
    
    return userId;
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM Usuario WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query = `
      SELECT id_usuario, nombre, email, fecha_registro, fecha_nacimiento
      FROM Usuario
      WHERE id_usuario = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Obtener todos los usuarios
  static async getAll() {
    const query = `
      SELECT id_usuario, nombre, email, fecha_registro, fecha_nacimiento, role
      FROM Usuario
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Actualizar usuario
  static async update(id, userData) {
    const { nombre, email, fecha_nacimiento } = userData;
    
    const query = `
      UPDATE Usuario
      SET nombre = ?, email = ?, fecha_nacimiento = ?
      WHERE id_usuario = ?
    `;
    
    const [result] = await db.execute(query, [nombre, email, fecha_nacimiento, id]);
    return result.affectedRows;
  }

  // Eliminar usuario
  static async delete(id) {
    const query = 'DELETE FROM Usuario WHERE id_usuario = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  }

  // Comparar contraseña (para login)
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;