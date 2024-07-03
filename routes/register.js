const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log('Success')
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

module.exports = router;