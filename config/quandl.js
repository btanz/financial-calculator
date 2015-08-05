/** config file for quandl API */
var Quandl = require('quandl');

module.exports = function(){

  var quandl = new Quandl({
    auth_token: 'bFFadrPJz7EcsEgB_xaz',
    api_version: 3
  });

  return quandl;

};