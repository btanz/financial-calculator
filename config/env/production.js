/**
 * PRODUCTION environment config
 */
var keys = require('../../keys/keys');

var dbSettings = {
  "USER": keys.dbUser,
  "PASS": keys.dbPass,
  "HOST": keys.dbHost,
  "PORT": keys.dbPort,
  "DATABASE": keys.dbDatabase
};


module.exports = {

  /** MongoDB connection URI */
  db: "mongodb://" + dbSettings.USER + ":" + dbSettings.PASS + "@" + dbSettings.HOST + ":"+ dbSettings.PORT + "/"+ dbSettings.DATABASE,

  /** response compression */
  compression: true,

  /** port where app is served */
  port: '80'

};