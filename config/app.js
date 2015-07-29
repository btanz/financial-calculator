/**
 * 1. REQUIRE DEPENDENCIES
 */

/** A. Config dependencies */

var config = require('./config');

/** B. External dependencies */
var mongoose = require('../config/mongoose');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/** C. Internal dependencies / Routes */
var routes = require('../app/routes/routes');
var index = require('../app/routes/index.routes');
var navElems = require('./../data/static/navElems.json');

/** D. Init */
var db;
var app = express();



/**
 * 2. CONFIGURE SETTINGS
 */

/** compression module setup */
if(config.compression){
  app.use(compress());
}

/** view engine setup */
app.set('views', path.join(__dirname, '/../app/views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));




/**
 * 3. DATABASE CONNECTION
 */
db = mongoose();


/**
 * 4. APP-LEVEL LOCAL VARS
 */
app.locals.navElems = navElems;



/**
 * 5. MIDDLEWARE
 */



/**
 * 6. ROUTES
 */
app.use('/', routes);
app.use('/', index);



/**
 * 7. ERROR HANDLING
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/**
 * 8. EXPORT
 */

module.exports = app;
