/*
 * app.js
 * Client-side root namespace and configuration module
 */
var app = (function(){
  'use strict';

  // set production/debug mode
  var DEBUG = true;

  // config and append spinner
  var opts = {lines: 13 // The number of lines to draw,
    , length: 28 // The length of each line
    , width: 5 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#333D47' // #rgb or #rrggbb or array of colors
    , opacity: 0.15 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 40 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
  };
  var spinner = new Spinner(opts);


  // a boilerplate exception handling function that is called on error
  var exceptionHandler = function(message, data){
    console.log(message);
    console.log(data);  // an object with input data that caused the error
  };

  return {
    DEBUG: DEBUG,
    exceptionHandler: exceptionHandler,
    spinner: spinner
  };

})();