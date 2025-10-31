const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/user/:id
router.get('/user/:id', authenticateToken, authController.getUserInfo);

module.exports = router; 