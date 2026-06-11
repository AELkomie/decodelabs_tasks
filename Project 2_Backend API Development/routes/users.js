const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateProfile,
} = require('../controllers/userController');

const {
  validateRegister,
  validateLogin,
  validateUpdate,
} = require('../middleware/validate');

// GET  /api/users          → get all users
// GET  /api/users/:id      → get one user
// POST /api/users/register → register new user
// POST /api/users/login    → login
// POST /api/users/:id/profile → update profile

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/:id/profile', validateUpdate, updateProfile);

module.exports = router;
