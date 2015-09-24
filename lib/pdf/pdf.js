/**
 * pdf.js
 * Copyright 2015 Benjamin Tanz
 *
 * A SimplyFi library for pdf-creation
 *
 */

"use strict";
var pdf = exports;

var _ = require('underscore');
var htmlpdf = require('html-pdf');
var jade = require('jade');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var numeral = require('numeral');



/** configure pdf options */
var options = {
  directory: path.join(appDir,'/output/pdf'),
  format: 'A4',
  orientation: 'portrait',
  type: "pdf",             // allowed file types: png, jpeg, pdf
  quality: "100",
  border: {
    top: "0cm",            // default is 0, units: mm, cm, in, px
    right: "0cm",
    bottom: "0cm",
    left: "0cm"
  },
  "footer": {
    "height": "18mm",
    "contents": '<span style="font-size: 11px; position: absolute; top: 0; left: 75px; display: block;">Alle Angaben und Berechnungen ohne Gewähr.</span><span style="font-size: 11px; position: absolute; top: 0; left: 600px; display: block;">Seite {{page}} von {{pages}}</span>'
  }
  /*header: {
   height: "25mm",
   contents: '<div style="text-align: center;">Author: Benjamin Tanz</div>'
   }*/

};

/** configure input file URI */
var FILEURI = path.join(appDir,'/lib/pdf/views/layout.jade');

/** CONFIG NUMERAL */
numeral.language('de', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal:
      function(){return"."},
  currency: {
    symbol: '€'
  }
});

// switch languages
numeral.language('de');
numeral.defaultFormat('0,0.00');



/** do pdf creation work */
var generate = function(html, cb){
  var fileName = './' + new Date().getTime() + '.pdf';
  return htmlpdf.create(html, options).toFile(path.join(options.directory,'/',fileName), cb)
};


var round = function(number, digits){
  return (number < 0) ? - Math.round(Math.abs(number) * Math.pow(10, digits)) / Math.pow(10, digits) : Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
};


var format = function(value){

  if(value.type === "string"){
    return value.value.toString();
  } else {

    var formatString = '0,0.';

    //if(typeof digits != 'number') digits = 2;
    if(!(isFinite(value.digits)) || value.digits === '' || value.digits === null) value.digits = 2;

    for (var i = 0; i<value.digits; i++) {
      formatString += '0';
    }

    // fix rounding if number is negativ, i.e. -26.375 goes to -26.38 instead of -26.37
    if(value.value < 0){

      return numeral(round(value.value, value.digits)).format(formatString);
    } else {
      return numeral(value.value).format(formatString);
    }
  }
};





pdf.generate = function(res, calcFun, obj, inputObj){


  var inputPrintObj = {};
  /** map label to input element */
  _.each(inputObj, function(value, key){
    inputPrintObj[_.find(obj.inputs, function(item){return (item.name === key);}).label] = inputObj[key];
  });

  calcFun(inputObj)
      .then(function(results) {
        var html = jade.renderFile(FILEURI, {obj: obj, inputObj: inputPrintObj, outputObj: results._1, format: format});

        generate(html, function (err, response) {
          if (err) return console.log(err);
          return res.sendFile(response.filename);
        });
      })
      .onReject(function(){
        console.log('Error occurred');
      });

};


