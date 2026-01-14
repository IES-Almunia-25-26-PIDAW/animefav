const User = require('../models/User');

const UserController = {

  // Obtener todos los usuarios
  async getAll(req, res, next) {
    try {
      const usuarios = await User.getAll();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },

  // Crear un nuevo usuario
  async create(req, res, next) {
    try {
      const id = await User.create(req.body);
      res.status(201).json({ message: 'Usuario creado', id });
    } catch (err) {
      next(err);
    }
  },

  // Obtener usuario por ID
  async getById(req, res, next) {
    try {
      const usuario = await User.findById(req.params.id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  // Obtener usuario por email
  async getByEmail(req, res, next) {
    try {
      const usuario = await User.findByEmail(req.params.email);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar usuario
  async update(req, res, next) {
    try {
      const affectedRows = await User.update(req.params.id, req.body);
      if (affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado o sin cambios' });
      res.json({ message: 'Usuario actualizado' });
    } catch (err) {
      next(err);
    }
  },

  // Eliminar usuario
  async delete(req, res, next) {
    try {
      const affectedRows = await User.delete(req.params.id);
      if (affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      next(err);
    }
  },

  // login 
    async login(req, res, next) {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña)
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });

    const usuario = await User.findByEmail(email);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isValid = await User.comparePassword(contraseña, usuario.contraseña);
    if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Si quieres, aquí podrías generar un token JWT más adelante
    res.json({ message: 'Login exitoso', usuario: { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email } });

  } catch (err) {
    next(err);
  }
}
};

module.exports = UserController;
