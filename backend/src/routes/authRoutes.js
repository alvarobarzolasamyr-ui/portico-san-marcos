const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas Generales de Usuarios
router.post('/login', authController.loginUser);
router.get('/users', authController.getUsers);
router.post('/users', authController.createUser);
router.put('/users/:id', authController.updateUser);
router.put('/users/:id/estado', authController.toggleUserStatus);
router.put('/users/:id/reset-password', authController.resetPassword);

// Ruta Mágica para reparar contraseñas en Aiven
router.get('/migrar-aiven', authController.migrarAiven);

module.exports = router;