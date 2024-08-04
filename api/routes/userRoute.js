const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Register a new user
router.post('/register', registerUser);

// Login a user and get a JWT token
router.post('/login', loginUser);

module.exports = router;

