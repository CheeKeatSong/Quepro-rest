  // send email with mailgun services - 2
  var mailgun = require("mailgun-js");
  var api_key = 'key-f05bf83bbab5abdaf494b79f996fd7c3';
  var DOMAIN = 'sandbox0cff8999c890489eb0fe3704c00da3f5.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

  var data = {
    from: 'QuePro <CKSong@queuepro.com>',
    to: '0116708@kdu-online.com',
    subject: 'Verify Your Account',
    text: 'Your QuePro verification code is '
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });