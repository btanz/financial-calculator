var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var configuration = require([__dirname, "config"].join("/"));


exports.create = function(config){

  var uri = [configuration.base_uri, config.uri].join('/');

  var options = {
    uri: [uri, config.format].join("."),
    method: "GET",
    qs: config.qs || {},
    proxy: config.proxy
  };


  return request(options);

};
