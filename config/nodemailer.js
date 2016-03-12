/**
 * Created by benjamintanz on 21.09.15.
 */
var nodemailer = require('nodemailer');
var keys = require('../keys/keys');

// create and export reusable transporter object using SMTP transport
module.exports = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: keys.user,
      pass: keys.pass
    }
  });




