// middleware/requireAdmin.js
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos para ver esto' });
  }
  next();
};

module.exports = requireAdmin;
  
