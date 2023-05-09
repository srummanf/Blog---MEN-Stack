const express = require('express');
const router = express.Router();

//Routes
router.get('/about', (req, res) => {
    res.send('Hello World');
});

module.exports = router;