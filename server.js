// server.js

// set up ======================================================================
// get all the tools we need  npm install -----
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const {ObjectID} = require('mongodb')
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db, ObjectID);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration 

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth) --- used for saved logins
app.use(bodyParser.json()); // get information from html forms  semi depracated, but imbedded within now
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')) // make files within a folder accessible            


app.set('view engine', 'ejs'); // set up ejs for templating, defaults the application to use ejs 

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
