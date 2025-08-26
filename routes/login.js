const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');

// POST /api/login
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid email' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;

