const Transaction = require('../models/transactionModel');

// Get user data
exports.getUserData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('balance income expense');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get transactions for a user
exports.getTransactions = async (req, res) => {
    try {
        const userId = req.params.userId;
        const transactions = await Transaction.find({ userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
    try {
        const { userId, category, amount, date, type } = req.body;
        const transaction = new Transaction({ userId, category, amount, date, type });
        await transaction.save();
        res.status(201).json({ message: 'Transaction added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

