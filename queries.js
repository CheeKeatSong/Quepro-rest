var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

// var pgp = require('pg-promise')(options);
// var connectionString = 'postgres://localhost:5432/puppies';
// var db = pgp(connectionString);

// add query functions

// module.exports = {
//   getAllPuppies: getAllPuppies,
//   getSinglePuppy: getSinglePuppy,
//   createPuppy: createPuppy,
//   updatePuppy: updatePuppy,
//   removePuppy: removePuppy
// };

// function getAllPuppies(req, res, next) {
//   db.any('select * from pups')
//     .then(function (data) {
//       res.status(200)
//         .json({
//           status: 'success',
//           data: data,
//           message: 'Retrieved ALL puppies'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
// }

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://fricllllwdgdcz:c662f335a1a8860c37703282aceed22775e180a99935ad6a9b0a06247d0ad4db@ec2-204-236-239-225.compute-1.amazonaws.com:5432/dr861gshs4lib?ssl=true';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllRegistration: getAllRegistration,
  // getSingleRegistration: getSingleRegistration,
  createRegistration: createRegistration,
  // updateRegistration: updateRegistration,
  // removeRegistration: removeRegistration
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

function createRegistration(req, res, next) {

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var mobileNumber = req.body.mobileNumber;

// Send SMS with twilio
  // const accountSid = 'AC9b778d92ad406516f2204e0698134b5d';
  //   const authToken = '2521fd35eab9c2fa1697976a4e9dce59';

  //   const client = require('twilio')(accountSid, authToken);

  //   client.messages
  //   .create({
  //     to: '+0192691128',
  //     from: '+0192691128',
  //     body: "quepro testing",
  //     mediaUrl: 'https://climacons.herokuapp.com/clear.png',
  //   })
  //   .then((message) => console.log(message.sid));


  // verification code generator
  var CodeGenerator = require('node-code-generator');
  var generator = new CodeGenerator();
  var pattern = '######';
  var howMany = 1;
  var options = {};
  // Generate an array of random unique codes according to the provided pattern: 
  var codes = generator.generateCodes(pattern, howMany, options);

  db.none('INSERT INTO registration(userid, firstname, lastname, email, password, mobilenumber, verificationCode)' +
    'VALUES(DEFAULT, $1, $2, $3, $4, $5, $6)', [firstName, lastName, email, password, mobileNumber, parseInt(codes)])
  .then(function () {


var client = require('twilio')(
  process.env.'AC9b778d92ad406516f2204e0698134b5d',
  process.env.'2521fd35eab9c2fa1697976a4e9dce59'
);

client.messages.create({
  from: process.env.'+15005550006',
  to: process.env.'+60192691128',
  body: "You just sent an SMS from Node.js using Twilio!"
}).then((message) => console.log(message.sid));


// // Send SMS with textbelt
// var text = require('textbelt');
// var opts = {
//   fromAddr: 'cheekeatsong@gmail.com',  // "from" address in received text 
//   fromName: 'QuePro',       // "from" name in received text 
//   region:   'intl',              // region the receiving number is in: 'us', 'canada', 'intl' 
//   subject:  'Your validation number'        // subject of the message 
// }

// var msg = "";

// text.sendText('+60122381128', 'A sample text message!', opts, function(err) {
//   if (err) {
//     console.log(err);
//     msg = err;
//   }
// });



// // Send mail with registered email - 1
//     var nodemailer = require('nodemailer');

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



  // // send email with mailgun services - 2
  // var mailgun = require("mailgun-js");
  // var api_key = 'key-f05bf83bbab5abdaf494b79f996fd7c3';
  // var DOMAIN = 'sandbox0cff8999c890489eb0fe3704c00da3f5.mailgun.org';
  // var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

  // var data = {
  //   from: 'QuePro <CKSong@quepro.com>',
  //   to: 'cheekeatsong@gmail.com',
  //   subject: 'Verify Your Account',
  //   text: 'Your QuePro verification code is ' + codes
  // };

  // mailgun.messages().send(data, function (error, body) {
  //   console.log(body);
  // });



  res.status(200)
  .json({
    status: 'success',
    message: 'Inserted one registration'
  });
})
  .catch(function (err) {
    return next(err);
  });

}