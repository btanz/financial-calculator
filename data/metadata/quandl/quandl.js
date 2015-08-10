var fse = require('./quandl.fse');

var quandl = {};

/** attach databases to object */
quandl.fse = fse;



/** exports quandl object */
module.exports = quandl;