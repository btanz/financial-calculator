var debug = require('debug')('simplyfi:server');

// check whether app is started in debugging mode and include associated env config files
if(debug.enabled){
  module.exports = require('./env/development.js');
} else {
  module.exports = require('./env/production.js');
}