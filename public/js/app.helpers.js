/*
 * app.helpers.js
 * A client side module that provides various helpers to the application
 */

app.helpers = (function($) {

  var compileTemplate, numeralInit;

  // This function reads the Handlebars template with templateId and compiles it to html using the dataObj
  // Then, it removes all childs from the containerId and appends the compiled template as child to containerId
  compileTemplate = function(containerSelector,templateSelector,dataObj){
    var templateSource = $(templateSelector).text();
    var template = Handlebars.compile(templateSource);
    var HTML = template({obj: dataObj});
    $(containerSelector).children().remove();
    $(containerSelector).append(HTML);
  };

  clearResultsTemplate = function(containerSelector){
    $(containerSelector).children().remove();
  };

  clearAllResultsTemplates = function(){
    compileTemplate('#results-1','#main-results-input-template',{});
    clearResultsTemplate('#results-2');
    clearResultsTemplate('#results-3');
    clearResultsTemplate('#results-4');
    clearResultsTemplate('#results-5');
    clearResultsTemplate('#results-6');
  };

  return {
    compileTemplate: compileTemplate,
    clearResultsTemplate: clearResultsTemplate,
    clearAllResultsTemplates: clearAllResultsTemplates
  }



})(jQuery);