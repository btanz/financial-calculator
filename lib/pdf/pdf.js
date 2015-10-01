/**
 * pdf.js
 * Copyright 2015 Benjamin Tanz
 *
 * A SimplyFi library for pdf-creation
 *
 */

"use strict";
var pdf = exports;

var _       = require('underscore');
var htmlpdf = require('html-pdf');
var jade    = require('jade');
var path    = require('path');
var config  = require('./config');
var helpers = require('./helpers');



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

  var inputPrintArr = [];
  var fallback = {label: 'nicht def.'};


  /** map labels and input values to parameter elements for pdf */
  _.each(inputObj, function(value, key){
    var index = 0, cleanKey, numberSelect, NAFlag = false;
    var inputItem = {};
    var selected;

    /** PULL THE ITEM DESCRIPTION FROM THE DB */
    /** remove numerical values from key such that array items such as interest0, interest1, .. are identified correctly */
    cleanKey = key.replace(/[0-9]/g,'');
    var elem = _.find(obj.inputs, function(item){index +=1; return (item.name === cleanKey);});

    if(typeof elem === 'undefined' || elem.nopdf === true){
      elem = fallback;
      NAFlag = true;
    }

    /** MARRY ITEM DESCRIPTION WITH USER INPUT */
    inputItem.description = elem.label;
    /** attach numbers if item is element from array */
    if (elem.type === 'custom' && elem.array === true){
      inputItem.description = inputItem.description + ' ' + (parseFloat(key.match(/[0-9]+/g)[0]) + 1) + (elem.labelExtension || '');
    }

    /** attach label to value if defined */
    /** have to check whether element is a number-select and we thus have two input values per elem (usually term and termperiods, i.e. a number and its units), so label is a user choice */
    if(typeof elem !== 'undefined' && elem.idselect && typeof elem.idselect !== "undefined"){
      /** identify item and, find user input value, find coding of selected value and attach it to addon */
      numberSelect = elem.idselect.split('-').pop();
      inputItem.label = _.find(elem.options, function(selected){return (selected.id === inputObj[numberSelect]);}).description;
    } else {
      inputItem.label = elem.addon;
    }

    inputItem.index = index;
    if (elem.type === 'select'){
      // find selected item and map description to value of select input
      selected = _.find(elem.options, function(selected){return (selected.id === inputObj[key]);});
      inputItem.value = selected.description;
    } else {
      inputItem.value = inputObj[key];
    }
    // format numbers that are indicted as such, but not for select fields, as the vtype refers to the id format and to the display format
    if(elem.vtype === 'number' && elem.type !== 'select'){
      //console.log(inputItem);
      inputItem.value = format({value: inputItem.value, type: 'number', digits: helpers.decimalPlaces(inputItem.value)});
      //console.log(inputItem);
    }

    /** attach element to print array if not undefined */
    if(!NAFlag){
      inputPrintArr.push(inputItem);
    }

    NAFlag = false;
  });


  /** sort print object by assigned index */
  inputPrintArr = _.sortBy(inputPrintArr, function(item){return item.index;});


  calcFun(inputObj)
      .then(function(results) {
        /** create timestamp */
        //console.log(results._1);
        var dateTime = {
          date:  moment().format('DD.MM.YYYY'),
          time: moment().format("HH:mm")
        };
        var html = jade.renderFile(config.FILEURI, {obj: obj, inputObj: inputPrintArr, outputObj: results._1, format: format, dateTime:  dateTime});

        generate(html, function (err, response) {
          if (err) return console.log(err);
          return res.sendFile(response.filename);
        });
      })
      .onReject(function(e){
        console.log('Error occurred');
        console.log(e);
      });

};


