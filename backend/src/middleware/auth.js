const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar la info del usuario al request
    req.user = decoded;
    
    next();
    
  } catch (error) {
    console.error('Error en auth middleware:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
  



module.exports = authMiddleware;