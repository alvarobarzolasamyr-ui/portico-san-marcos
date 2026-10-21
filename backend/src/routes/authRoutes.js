const express = require('express');
const router = express.Router();
const {
  loginUser,
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  resetPassword
} = require('../controllers/authController');

// Rutas
router.post('/login', loginUser);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/estado', toggleUserStatus);
router.put('/users/:id/reset-password', resetPassword);

module.exports = router;