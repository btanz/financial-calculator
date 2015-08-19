var fse  = require('./quandl.fse');
var wiki = require('./quandl.wiki');

var quandl = {};

/** convert descriptions to uppercase */
fse.map(function(obj){
  obj.description = obj.description.toUpperCase();
  return obj;
});

wiki.map(function(obj){
  obj.description = obj.description.toUpperCase();
  return obj;
});

/** attach databases to object */
quandl.fse = fse;
quandl.wiki = wiki;


/** exports quandl object */
module.exports = quandl;