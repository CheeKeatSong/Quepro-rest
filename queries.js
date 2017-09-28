var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://fricllllwdgdcz:c662f335a1a8860c37703282aceed22775e180a99935ad6a9b0a06247d0ad4db@ec2-204-236-239-225.compute-1.amazonaws.com:5432/dr861gshs4lib?ssl=true';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllRegistration: getAllRegistration,
  getSingleRegistration: getSingleRegistration,
  createRegistration: createRegistration,
  accountVerification: accountVerification,
  // updateRegistration: updateRegistration,
  // removeRegistration: removeRegistration,
  resendEmailCode: resendEmailCode,
  resendSMSCode : resendSMSCode
};

function getAllRegistration(req, res, next) {
  db.any('select * from Registration')
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved ALL registration'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getSingleRegistration(req, res, next) {

  var email = req.params.id;

  db.any('select * from Registration where userId = $1', userId)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved ALL registration'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}


function createRegistration(req, res, next) {

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var mobileNumber = req.body.mobileNumber;

  // verification code generator
  var CodeGenerator = require('node-code-generator');
  var generator = new CodeGenerator();
  var pattern = '######';
  var howMany = 1;
  var options = {};
  // Generate an array of random unique codes according to the provided pattern: 
  var codes = generator.generateCodes(pattern, howMany, options);

  db.one('INSERT INTO registration(userid, firstname, lastname, email, password, mobilenumber, verificationCode)' +
    'VALUES(DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING userId', [firstName, lastName, email, password, mobileNumber, parseInt(codes)])
  .then(function (data) {

// SMS verification code
// Twilio Credentials 
var accountSid = 'ACc6ba408ad0b43567ab05fb4e01405ed9'; 
var authToken = '95c544416ee5345130c78a828c57e9c3'; 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

client.messages.create({ 
  to: "+60192691128", 
  from: "+15005550006", 
  body: "Use this code to verify your account."
}, function(err, message) { 
  console.log(message.sid); 
});

res.status(200)
.json({
  status: 'success',
  data: data,
  message: 'Inserted one registration'
});
})
  .catch(function (err) {
    return next(err);
  });

}

// Verify account
function accountVerification(req, res, next) {

  var accountVerificationId = req.body.id;
  var accountVerificationCode = req.body.verificationcode;

  db.any('select * from Registration where userId = $1', accountVerificationId)
  .then(function (DBdata) {
    var arr = Object.keys(DBdata).map(function(k) { return DBdata[k] });

            res.status(200)
        .json({
          status: 'success',
          message: 'Account Verified' + arr[0].verificationcode
        });

    // if (arr[0].verificationcode == accountVerificationCode){
    //   db.none('INSERT INTO User(userid, firstname, lastname, email, password, mobilenumber, verificationCode, smsInterval, smsActivation, pushInterval, pushActivation, points)' +
    //     'VALUES(DEFAULT, $1, $2, $3, $4, $5, 60, true, 60, true, ) RETURNING userId', [arr[0].firstname, arr[0].lastname, arr[0].email, arr[0].password, arr[0].mobilenumber])
    //   .then(function () {

      //   res.status(200)
      //   .json({
      //     status: 'success',
      //     message: 'Account Verified' + arr[0].verificationcode + ' ' + accountVerificationCode + ' ' + check
      //   });
      // })
    //   .catch(function (err) {
    //     return next(err + '\n' + DBdata);
    //   });
    // }else{
    //   return ("Verification code does not match!");
    // }
  }).catch(function (err) {
   return next(err);
 });
}

function resendSMSCode(req, res, next) {

  var userId = parseInt(req.params.id);

  db.any('select * from Registration where userid = $1', userId)
  .then(function (DBdata) {

// SMS verification code
// Twilio Credentials 
var accountSid = 'ACc6ba408ad0b43567ab05fb4e01405ed9'; 
var authToken = '95c544416ee5345130c78a828c57e9c3'; 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var arr = Object.keys(DBdata).map(function(k) { return DBdata[k] });

client.messages.create({ 
  to: "+60192691128", 
  // to: '"' + arr[0].mobilenumber '"', 
  from: "+15005550006", 
  body: 'Your QuePro verification code is ' + arr[0].verificationcode
}, function(err, message) { 
  console.log(message.sid); 
});

res.status(200)
.json({
  status: 'success',
  message: 'Verification code SMS is sent to your phone'
});
})
  .catch(function (err) {
    return next(err);
  });

}

function resendEmailCode(req, res, next) {

  var userId = parseInt(req.params.id);

  db.any('select * from Registration where userid = $1', userId)
  .then(function (DBdata) {

  // send email with mailgun services - 2
  var mailgun = require("mailgun-js");
  var api_key = 'key-f05bf83bbab5abdaf494b79f996fd7c3';
  var DOMAIN = 'sandbox0cff8999c890489eb0fe3704c00da3f5.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

  var arr = Object.keys(DBdata).map(function(k) { return DBdata[k] });

  var data = {
    // from: '"'QuePro + arr[0].email + '"',
    from: 'QuePro <CKSong@queuepro.com>',
    to: '0116708@kdu-online.com',
    subject: 'Verify Your Account',
    text: 'Your QuePro verification code is ' + arr[0].verificationcode
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

  res.status(200)
  .json({
    status: 'success',
    message: 'Verification code email is sent to your phone'
  });
})
  .catch(function (err) {
    return next(err);
  });
}


// // Send mail with registered email - 1
// var nodemailer = require('nodemailer');

// // create reusable transporter object using SMTP transport
// var transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'cheekeatsong@gmail.com',
//     pass: 'sck.5309'
//   }
// });

// // setup e-mail data with unicode symbols
// var mailOptions = {
// // sender address
// from: 'CK Song <cheekeatsong@gmail.com>', 
// // list of receivers
// to: '0116708@kdu-online.com',  
// // Subject line
// subject: 'Verify your account', 
// // plaintext body
// text: 'Your QuePro verification code is ' + codes,
// // rich text html body
// html: "<p>It works</p>",
// };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, function(error, info){
//       if(error){
//         console.log(error);
//       }else{
//         console.log('Message sent: ' + info.response);
//       }
//     });



