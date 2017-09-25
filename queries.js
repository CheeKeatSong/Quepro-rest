var promise = require('bluebird');
// send email with node mailer
const mailer = require('node-mailer');

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

// Send SMS with textbelt
// var text = require('textbelt');
// var opts = {
//   fromAddr: 'quepro@gmail.com',  // "from" address in received text 
//   fromName: 'QuePro',       // "from" name in received text 
//   region:   'intl',              // region the receiving number is in: 'us', 'canada', 'intl' 
//   subject:  'Your validation number'        // subject of the message 
// }

// var msg = "";

// text.sendText('+6019-2691128', 'A sample text message!', opts, function(err) {
//   if (err) {
//     msg = err;
//   }
// });


new mailer.Mail({
  from: 'quepro@domain.com',
  to: 'cheekeatsong@gmail.com',
  subject: 'Validate your new account now!',
  body: 'Here is your code, enter it on your validation page',
  callback: function(err, data){
    console.log(err);
    console.log(data);
  }
});

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: account.user, // generated ethereal user
//             pass: account.pass  // generated ethereal password
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"QuePro" <CKSong@quepro.com>', // sender address
//         to: 'cheekeatsong@gmail.com', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// });

db.none('INSERT INTO registration(userid, firstname, lastname, email, password, mobilenumber)' +
  'VALUES(DEFAULT, $1, $2, $3, $4, $5)', [firstName, lastName, email, password, mobileNumber])
.then(function () {
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