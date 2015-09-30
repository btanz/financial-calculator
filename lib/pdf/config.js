/** configuration file for pdf */
"use strict";
var path = require('path');
var appDir = path.dirname(require.main.filename);
var numeral = require('numeral');
var moment = require('moment');

var config = exports;

/** PATH */
config.FILEURI    = path.join(appDir,'/lib/pdf/views/layout.jade');
config.FILEURIOUT = path.join(appDir,'/output/pdf');


/** PDF  */
config.options = {
  directory: config.FILEURIOUT,
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
    "contents": '<span style="font-size: 10px; position: absolute; top: 0; left: 75px; display: block;">Erstellt mit www.simplyfi.de am ' + moment().format('DD.MM.YYYY') + ' um ' + moment().format('HH:mm') + ' Uhr.<br>Alle Angaben und Berechnungen ohne Gewähr. </span><span style="font-size: 10px; position: absolute; top: 0; left: 600px; display: block;">Seite {{page}} von {{pages}}</span><br>'
  }/*,
  header: {
   height: "25mm",
   contents: '<div style="text-align: center;">Author: Benjamin Tanz</div>'
   }*/

};



/** NUMERIC OUTPUTS (NUMERALJS) */
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

config.numeral = numeral;