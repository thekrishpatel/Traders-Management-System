const express = require('express');
const router = express.Router();

// Dashboard route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
