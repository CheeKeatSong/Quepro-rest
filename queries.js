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

  db.none('INSERT INTO registration(userid, firstname, lastname, email, password, mobilenumber)' +
    'VALUES(DEFAULT, $1, $2, $3, $4, $5)', [firstName, lastName, email, password, mobileNumber])
  .then(function () {

    var text = require('textbelt');
    text.sendText('60192691128', 'Bonjour!', 'intl', function(err) {
      console.log(err);
    });

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