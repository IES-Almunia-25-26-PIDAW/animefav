const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rutas
router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.get('/:id', UserController.getById);
router.get('/email/:email', UserController.getByEmail);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/login', UserController.login);
module.exports = router;
