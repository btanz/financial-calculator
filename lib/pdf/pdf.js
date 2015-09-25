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
var config = require('./config');



/** LOCAL HELPER FUNCTIONS */
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

      return config.numeral(round(value.value, value.digits)).format(formatString);
    } else {
      return config.numeral(value.value).format(formatString);
    }
  }
};




var generate = function(html, cb){
  var fileName = './' + new Date().getTime() + '.pdf';
  return htmlpdf.create(html, config.options).toFile(path.join(config.options.directory,'/',fileName), cb)
};



/** EXPOSED PDF GENERATOR FUNCTION */
pdf.generate = function(res, calcFun, obj, inputObj){


  var inputPrintObj = {};

  /** map label to input element */
  _.each(inputObj, function(value, key){
    // extract input object
    var elem = _.find(obj.inputs, function(item){return (item.name === key);});
    var selected;
    if (elem.type === 'select'){
      // find selected item and map description to value of select input
      selected = _.find(elem.options, function(selected){return (selected.id === inputObj[key]);});
      inputPrintObj[elem.label] = selected.description;
    } else {
      inputPrintObj[elem.label] = inputObj[key];
    }
  });


  calcFun(inputObj)
      .then(function(results) {

        var html = jade.renderFile(config.FILEURI, {obj: obj, inputObj: inputPrintObj, outputObj: results._1, format: format});

        generate(html, function (err, response) {
          if (err) return console.log(err);
          return res.sendFile(response.filename);
        });
      })
      .onReject(function(){
        console.log('Error occurred');
      });

};


