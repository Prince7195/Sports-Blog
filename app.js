const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressMessages = require('express-messages');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const mongoose = require('mongoose');

// mongoose connect
mongoose.connect('mongodb://localhost:27017/sportsblog', { useMongoClient: true });
const db = mongoose.connection;

// port
const port = 3000;

// init app
const app = express();

// moment
app.locals.moment = require('moment');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const index = require('./routes/index');
const articles = require('./routes/articles');
const categories = require('./routes/categories');
const manage = require('./routes/manage');

// set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// express messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = expressMessages(req, res);
    next();
});

// express validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        const namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += `[${namespace.shift()}]`;
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use('/', index);
app.use('/articles', articles);
app.use('/categories', categories);
app.use('/manage', manage);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});