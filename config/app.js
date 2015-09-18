/**
 * 1. REQUIRE DEPENDENCIES
 */

/** A. Config dependencies */
var config = require('./config');
var debug = require('debug')('simplyfi:server');

/** B. External dependencies */
var mongoose = require('../config/mongoose');
var FileStreamRotator = require('file-stream-rotator')
var express = require('express');
var path = require('path');
var fs = require('fs')
var favicon = require('serve-favicon');
var logger = require('morgan');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/** C. Internal dependencies / Routes */
var routes = require('../app/routes/routes');
var index = require('../app/routes/index.routes');
var legal = require('../app/routes/legal.routes');
var data = require('../app/routes/data/data');
var navElems = require('./../data/static/navElems.json');
var seed = require('../data/dbseeds/calc.seed');

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
//app.use(favicon(__dirname + '/public/images/favicon/favicon.ico'));
app.use(favicon(path.join(__dirname, '/../public/images/favicon/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));


/**
 * 3. LOGGING
 */

if(debug.enabled){
  /** log to command line only */
  app.use(logger('dev'));
} else {
  /** log to command line AND daily files

   /** set log directory */
  var logDirectory = path.join(__dirname, '/../../data/serverlogs');

  /** ensure that logDirectory exists */
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  /** create a rotating write stream */
  var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/sf-serverlog-%DATE%.log',
    frequency: 'daily',
    verbose: false,
    date_format: 'YYYYMMDD'
  });

  /** set up logger */
  app.use(logger('combined', {stream: accessLogStream}));
  app.use(logger('combined'));
}




/**
 * 4. DATABASE CONNECTION
 */

/** establish connection */
db = mongoose();

/** seed DB CALC Model if empty */
seed.seedDB();


/**
 * 5. APP-LEVEL LOCAL VARS
 */
app.locals.navElems = navElems;
app.locals._ = require("underscore");



/**
 * 6. MIDDLEWARE
 */



/**
 * 7. ROUTES
 */
app.use('/', routes);
app.use('/', index);
app.use('/data', data);
app.use('/', legal);


/** robots txt route */
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: ");
});


/** sitemap route */
app.get('/sitemap.xml', function(req,res){

  res.sendFile(__dirname + '/sitemap.xml', function(err){
    if(err){
      console.log(err);
      res.status(err.status).end();
    }
  })
});




/**
 * 8. ERROR HANDLING
 */

/** catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

/** development error handler that will print stacktrace */
if (debug.enabled) {
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
  console.log(err.status);
  res.render('error', {
    message: err.message,
    status: err.status,
    error: {}
  });
});


/**
 * 9. EXPORT
 */

module.exports = app;
