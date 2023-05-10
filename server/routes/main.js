const express = require('express');
const router = express.Router();

//Routes
router.get('/home', (req, res) => {
    res.send('Hello World');
});

module.exports = router;