/**
 * Created by benjamintanz on 22.09.15.
 * Configuration for html-pdf package
 */

var pdf = require('html-pdf');
var path = require('path');
var appDir = path.dirname(require.main.filename);



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

module.exports = function(html, filename, cb){
  return pdf.create(html, options).toFile(path.join(options.directory,'/',filename), cb)
};







