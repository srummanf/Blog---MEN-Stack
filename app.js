require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');

const { isActiveRoute } = require('./server/helpers/routeHelpers');

const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db.js');

const app = express();
const port = 5000 || process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //allows to use form values
app.use(cookieParser());
app.use(methodOverride('_method'));
app.locals.isActiveRoute = isActiveRoute; 


// Connect to MongoDB
connectDB();

app.use(express.static('public'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
})); 

// Templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});
