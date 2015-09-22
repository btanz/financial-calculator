/**
 * phantompdf
 * Copyright 2015 Benjamin Tanz
 *
 * A library for pdf-generation with phantomjs
 *
 */

"use strict";
var phantom = require('phantom');
/** retrieve app root directory */
var path = require('path');
var appDir = path.dirname(require.main.filename);

/** SET OPTIONS */
var options = {
  dnodeOpts: { weak: false }
};


// storage and file options
var pdfOptions = {
  store: '/output/pdf',
  filename: 'spiegel.pdf',
  format: 'pdf',            // in {'png', 'gif', 'jpg', 'pdf'}
  quality: '100'            // in (0,100)
};




exports.sayHello = function(){

  /** span new phantom process */
  phantom.create(function(ph){

    /** create phantom page object */
    ph.createPage(function(page){

      /** open page */
      page.open('http://www.spiegel.de', function(status){
        //console.log("Opened page?", status);

        /** set page size and orientation */
        page.set('paperSize',{
          format: 'A4',
          orientation: 'portrait',
          margin: '1cm',
          header: {
            height: "1cm",
            contents: ph.callback(function(pageNum, numPages) {
              return "<h1>Header <span style='float:right'>" + pageNum + " / " + numPages + "</span></h1>";
            })
          }
        });

        // render the page
        page.render(path.join(appDir,pdfOptions.store,pdfOptions.filename), {format: pdfOptions.format, quality: pdfOptions.quality});



      });


    });


  }, options);



};
