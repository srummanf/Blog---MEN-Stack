const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

const adminLayout = '../views/layouts/admin';
// Addmin Login
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple blog using MEN",
        }
        res.render('admin/index', { locals, layout: adminLayout });
    }
    catch (err) {
        console.log(err)
    }

});

module.exports = router;
