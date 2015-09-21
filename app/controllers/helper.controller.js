/**
 * Created by benjamintanz on 21.09.15.
 */
var testmailer = require('../../config/nodemailer');


exports.feedback = {

  submit: function(req, res){

    var message = req.query.message;

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: 'webserveruser@simplyfi.de', // sender address
      to: 'feedback@simplyfi.de', // list of receivers
      subject: 'New User Feedback', // Subject line
      text: 'Name Absender: ' + message.name + '\n' + 'E-Mail Absender: ' + message.email + '\n' + 'Text der Nachricht: ' + '\n' + message.text // plaintext body
    };


    // send mail
    testmailer.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      //console.log('Message sent: ' + info.response);
    });
    res.json({status: 'success'});
  }

};