const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

module.exports = router;