const express = require('express');
const router = express.Router();
const { getUserData, getTransactions, addTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user data
router.get('/users/:userId', authMiddleware, getUserData);

// Get transactions for a user
router.get('/transactions/:userId', authMiddleware, getTransactions);

// Add a new transaction
router.post('/transactions', authMiddleware, addTransaction);

module.exports = router;

