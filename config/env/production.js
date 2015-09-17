/**
 * PRODUCTION environment config
 */

var dbSettings = {
  "USER": "",
  "PASS": "",
  "HOST": "localhost",
  "PORT": "27017",
  "DATABASE": "simplyfi"
};


module.exports = {

  /** MongoDB connection URI */
  db: "mongodb://" + dbSettings.USER + ":" + dbSettings.PASS + "@" + dbSettings.HOST + ":"+ dbSettings.PORT + "/"+ dbSettings.DATABASE,

  /** response compression */
  compression: true
};