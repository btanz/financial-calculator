/*
 * app.helpers.js
 * A client side module that provides various helpers to the application
 */

app.helpers = (function($) {

  var compileTemplate;

  // This function reads the Handlebars template with templateId and compiles it to html using the dataObj
  // Then, it removes all childs from the containerId and appends the compiled template as child to containerId
  compileTemplate = function(containerSelector,templateSelector,dataObj){
    var templateSource = $(templateSelector).text();
    var template = Handlebars.compile(templateSource);
    var HTML = template({obj: dataObj});
    $(containerSelector).children().remove();
    $(containerSelector).append(HTML);
  };

  return {
    compileTemplate: compileTemplate
  }



})(jQuery);