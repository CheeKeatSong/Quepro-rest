var promise = require('bluebird');
var bcrypt = require('bcryptjs');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://fricllllwdgdcz:c662f335a1a8860c37703282aceed22775e180a99935ad6a9b0a06247d0ad4db@ec2-204-236-239-225.compute-1.amazonaws.com:5432/dr861gshs4lib?ssl=true';
var db = pgp(connectionString);

// add query functions
module.exports = {

  //Registration method
  getAllRegistration: getAllRegistration,
  getSingleRegistration: getSingleRegistration,
  createRegistration: createRegistration,
  registrationValidation: registrationValidation,
  // updateRegistration: updateRegistration,
  // removeRegistration: removeRegistration,

  //Account verification method
  accountVerification: accountVerification,
  createUserAccount: createUserAccount,  
  sendAccountVerificationEmailCode: sendAccountVerificationEmailCode,
  sendAccountVerificationSMSCode : sendAccountVerificationSMSCode,

  //Account login
  loginCredentialRetrieval: loginCredentialRetrieval,

//User method
getUserById: getUserById,
getUserByMobileNumber: getUserByMobileNumber,

//Password reset
sendPasswordResetEmailCode: sendPasswordResetEmailCode,
sendPasswordResetSMSCode : sendPasswordResetSMSCode,
resetPasswordVerification: resetPasswordVerification,
resetPassword: resetPassword
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

  var userId = req.params.id;

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


// create registration
function createRegistration(req, res, next) {

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var mobileNumber = req.body.mobileNumber;

// generate verification code
var codes = generateVerificationCode();

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

// Delete the registration record after 24 hours
setInterval(function(){
 db.none('delete from registration WHERE userId=$1', data.userid)
 .then(function () {
 })
 .catch(function (err) {
  console.log(err);
    // return next(err);
  });
},86400000);

// return status and data
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

// validate registration - email and phone number
function registrationValidation(req, res, next) {

  var email = req.body.email;
  var mobileNumber = req.body.mobileNumber;
  var message = "Email and mobile number are allowed";
  var statusCode = 200;
  var status = "success";

  db.any('select * from users')
  .then(function (data) {

    for(var i = 0; i < data.length; i++) {
      var obj = data[i];
      
      console.log("registrationValidation   " + mobileNumber + "   " + obj.mobileNumber);
      
      if ((email).toLowerCase() == (obj.email).toLowerCase()) {
        statusCode = 400;
        message = "Email is already used to register, please enter another email";
        status = "fail";
        break;
      }
      if (mobileNumber == obj.mobileNumber) {
        statusCode = 400;
        message = "Mobile Number is already used to register, please enter another mobile number";
        status = "fail";
        break;
      }
    }

    res.status(statusCode)
    .json({
      status: status,
      message: message
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

  db.one('select * from Registration where userId = $1', accountVerificationId)
  .then(function (data) {

    if(data.verificationcode == accountVerificationCode) {
      res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Account Verification Success!'
      });
    }else{
      res.status(400)
      .json({
        status: 'fail',
        message: 'Verification Code Does Not Match Or Expired!'
      });
    }
  })
  .catch(function (err) {
    return next(err);
  });
}

function createUserAccount(req, res, next) {

  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var mobileNumber = req.body.mobilenumber;

  db.none('INSERT INTO users VALUES(DEFAULT, $1, $2, $3, $4, $5, 0, 60, true, 60, true, 0)', [firstName, lastName, email, password, mobileNumber])
  .then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'User account is created!'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function sendAccountVerificationSMSCode(req, res, next) {

  var id = parseInt(req.params.id);

  db.one('select * from registration WHERE userId=$1', id)
  .then(function (data) {

    var registration = Object.keys(data).map(function(k) { return data[k] });

    if ( registration[6] == "0" ) {
      var code = generateVerificationCode();
      console.log(id + ' ' + code);
      db.none('update registration set verificationcode=$1 WHERE userId=$2', [code,id])
      .then(function () {
        twilioSMSVerificationCode(code);
      })
      .catch(function (err) {
        return next(err);
        console.log(err);
      });
    }else{
     db.one('select * from registration WHERE userId=$1', id)
     .then(function (data) {
       var registration = Object.keys(data).map(function(k) { return data[k] });
       twilioSMSVerificationCode(registration[6]);
     }) .catch(function (err) {
      return next(err);
      console.log(err);
    });
   }

   removeAccountVerificationCodeAfter60Seconds(id);

   res.status(200)
   .json({
    status: 'success',
    message: 'Verification code SMS is sent to your phone'
  });
 })
  .catch(function (err) {
    console.log(err);
    return next(err);
  });
}

function sendAccountVerificationEmailCode(req, res, next) {

  var id = parseInt(req.params.id);

  db.one('select * from registration WHERE userId=$1', id)
  .then(function (data) {

    var registration = Object.keys(data).map(function(k) { return data[k] });

    if ( registration[6] == "0" ) {
      var code = generateVerificationCode();
      console.log(id + ' ' + code);
      db.none('update registration set verificationcode=$1 WHERE userId=$2', [code,id])
      .then(function () {
        mailgunVerificationCode(code);
      })
      .catch(function (err) {
        return next(err);
        console.log(err);
      });
    }else{
     db.one('select * from registration WHERE userId=$1', id)
     .then(function (data) {
       var registration = Object.keys(data).map(function(k) { return data[k] });
       mailgunVerificationCode(registration[6]);
     }) .catch(function (err) {
      return next(err);
      console.log(err);
    });
   }

   removeAccountVerificationCodeAfter60Seconds(id);

   res.status(200)
   .json({
    status: 'success',
    message: 'Verification code email is sent to your phone'
  });
 })
  .catch(function (err) {
    console.log(err);
    return next(err);
  });
}


// create registration
function loginCredentialRetrieval(req, res, next) {

  var email = req.body.email;

  db.one('select * from users WHERE email=$1', email)
  .then(function (data) {

// return status and data
res.status(200)
.json({
  status: 'success',
  data: data,
  message: 'Found the email'
});
})
  .catch(function (err) {
    return next(err);
  });
}


function getUserById(req, res, next) {

  var userId = req.params.id;

  db.one('select * from users WHERE' + '"userId"' + '=$1', userId)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved user'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getUserByMobileNumber(req, res, next) {

  var mobileNumber = req.params.mobileNumber;

  db.one('select * from users WHERE' + '"mobileNumber"' + '=$1', mobileNumber)
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved user'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}


function sendPasswordResetSMSCode(req, res, next) {

  var id = parseInt(req.params.id);

  db.one('select * from users WHERE '+'"userId"'+'=$1', id)
  .then(function (data) {

    var newUser = Object.keys(data).map(function(k) { return data[k] });

    if ( newUser[6] == "0" ) {
      var code = generateVerificationCode();
      console.log(id + ' ' + code);
      db.none('update users set verificationCode=$1 WHERE '+'"userId"'+'=$2', [code,id])
      .then(function () {
        twilioSMSVerificationCode(code);
      })
      .catch(function (err) {
        return next(err);
        console.log(err);
      });
    }else{
     db.one('select * from users WHERE '+'"userId"'+'=$1', id)
     .then(function (data) {
       var newUser = Object.keys(data).map(function(k) { return data[k] });
       twilioSMSVerificationCode(newUser[6]);
     }) .catch(function (err) {
      return next(err);
      console.log(err);
    });
   }
   removePasswordResetVerificationCodeAfter60Seconds(id);

   res.status(200)
   .json({
    status: 'success',
    message: 'Verification code SMS is sent to your phone'
  });
 })
  .catch(function (err) {
    console.log(err);
    return next(err);
  });
}

function sendPasswordResetEmailCode(req, res, next) {

  var id = parseInt(req.params.id);

  db.one('select * from users WHERE '+'"userId"'+'=$1', id)
  .then(function (data) {

    var newUser = Object.keys(data).map(function(k) { return data[k] });

    if ( newUser[6] == "0" ) {
      var code = generateVerificationCode();
      console.log(id + ' ' + code);
      db.none('update users set verificationCode=$1 WHERE '+'"userId"'+'=$2', [code,id])
      .then(function () {
        mailgunVerificationCode(code);
      })
      .catch(function (err) {
        return next(err);
        console.log(err);
      });
    }else{
     db.one('select * from users WHERE '+'"userId"'+'=$1', id)
     .then(function (data) {
       var newUser = Object.keys(data).map(function(k) { return data[k] });
       mailgunVerificationCode(newUser[6]);
     }) .catch(function (err) {
      return next(err);
      console.log(err);
    });
   }

   removePasswordResetVerificationCodeAfter60Seconds(id);

   res.status(200)
   .json({
    status: 'success',
    message: 'Verification code email is sent to your phone'
  });
 })
  .catch(function (err) {
    console.log(err);
    return next(err);
  });
}

// Verify account
function resetPasswordVerification(req, res, next) {

  var resetPasswordVerificationId = req.body.id;
  var resetPasswordVerificationCode = req.body.verificationCode;

  db.one('select * from users where '+'"userId"'+'=$1', resetPasswordVerificationId)
  .then(function (data) {

    console.log(data.verificationCode + "   " + data.verificationCode);

    if(data.verificationCode == resetPasswordVerificationCode) {
      res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Account Verification Success!'
      });
    }else{
      res.status(400)
      .json({
        status: 'fail',
        message: 'Verification Code Does Not Match Or Expired!'
      });
    }
  })
  .catch(function (err) {
    return next(err);
  });
}


function resetPassword(req, res, next) {

 var resetPasswordVerificationId = req.body.id;
 var newPassword = req.body.newPassword;

 db.one('update users set password=$1 where '+'"userId"'+'=$2', [newPassword, resetPasswordVerificationId])
 .then(function () {
  res.status(200)
  .json({
    status: 'success',
    message: 'Password Renewal Success!'
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
//     pass: '12345678'
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

function removeAccountVerificationCodeAfter60Seconds(id) {
  setInterval(function(){
    db.none('update registration set verificationcode=0 WHERE userId=$1', id)
    .then(function () {
    })
    .catch(function (err) {
      console.log(err);
    // return next(err);
  });
  },60000);
}

function removePasswordResetVerificationCodeAfter60Seconds(id) {
  setInterval(function(){
    db.none('update users set verificationCode=0 WHERE '+'"userId"'+'=$1', id)
    .then(function () {
    })
    .catch(function (err) {
      console.log(err);
    // return next(err);
  });
  },60000);
}

function mailgunVerificationCode(code) {

      // send email with mailgun services - 2
      var mailgun = require("mailgun-js");
      var api_key = 'key-f05bf83bbab5abdaf494b79f996fd7c3';
      var DOMAIN = 'sandbox0cff8999c890489eb0fe3704c00da3f5.mailgun.org';
      var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

      var data = {
    // from: '"'QuePro + arr[0].email + '"',
    from: 'QuePro <CKSong@queuepro.com>',
    to: '0116708@kdu-online.com',
    subject: 'Verify Your Account',
    text: 'Your QuePro verification code is ' + code
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}

function twilioSMSVerificationCode(code) {
// SMS verification code
// Twilio Credentials 
var accountSid = 'ACc6ba408ad0b43567ab05fb4e01405ed9'; 
var authToken = '95c544416ee5345130c78a828c57e9c3'; 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

client.messages.create({ 
  to: "+60192691128", 
  // to: '"' + arr[0].mobilenumber '"', 
  from: "+15005550006", 
  body: 'Your QuePro verification code is ' + code
}, function(err, message) { 
  console.log(message.sid); 
});
}

function generateVerificationCode() {
  // verification code generator
  var CodeGenerator = require('node-code-generator');
  var generator = new CodeGenerator();
  var pattern = '######';
  var howMany = 1;
  var options = {};
  // Generate an array of random unique codes according to the provided pattern: 
  var codes = generator.generateCodes(pattern, howMany, options);
  return parseInt(codes);
}

