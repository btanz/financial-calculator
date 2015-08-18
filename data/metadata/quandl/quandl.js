var fse  = require('./quandl.fse');
var wiki = require('./quandl.wiki');

var quandl = {};

/** attach databases to object */
quandl.fse = fse;
quandl.wiki = wiki;



/** exports quandl object */
module.exports = quandl;