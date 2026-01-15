const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, email, contraseña, fecha_nacimiento } = req.body;
    
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const userId = await User.create({ nombre, email, contraseña, fecha_nacimiento });
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      userId 
    });
    
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isValidPassword = await User.comparePassword(contraseña, user.contraseña);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id_usuario, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers
};