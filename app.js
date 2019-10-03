const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const con = require('./config/connection');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
// Passport Config
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
/*================================================================================================================*/
app.use('/js',express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/images',express.static(__dirname + 'public/images'));
app.use('/stylesheets',express.static(__dirname + 'public/stylesheets'));
/*================================================================================================================*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
