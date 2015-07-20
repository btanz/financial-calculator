var debug = require('debug')('calculata_v2:server');

// check whether app is started in debugging mode and include associated env config files
if(debug.enabled){
  module.exports = require('./env/development.js');
} else {
  module.exports = require('./env/production.js');
}