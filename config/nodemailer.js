/**
 * Created by benjamintanz on 21.09.15.
 */
var nodemailer = require('nodemailer');

// create and export reusable transporter object using SMTP transport
module.exports = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'webserveruser@simplyfi.de',
      pass: 'nimajneb83'
    }
  });




