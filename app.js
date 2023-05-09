require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');


const app =  express();
const port = 5000 || process.env.PORT;

app.use(express.static('public'));

// Templating engine
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))

app.listen(port,(req, res) => {
    console.log(`Server is running on port ${port}`);
});