/*
 * app.js
 * Client-side root namespace module
 */
var app = (function(){
  'use strict';

  // set production/debug mode
  var DEBUG = true;

  // a boilerplate exception handling function that is called on error
  var exceptionHandler = function(message, data){
    console.log(message);
    console.log(data);  // an object with input data that caused the error
  };

  return {
    DEBUG: DEBUG,
    exceptionHandler: exceptionHandler
  };

})();