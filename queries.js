var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://fricllllwdgdcz:c662f335a1a8860c37703282aceed22775e180a99935ad6a9b0a06247d0ad4db@ec2-204-236-239-225.compute-1.amazonaws.com:5432/dr861gshs4lib';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllRegistration: getAllRegistration,
  // getSingleRegistration: getSingleRegistration,
  // createRegistration: createRegistration,
  // updateRegistration: updateRegistration,
  // removeRegistration: removeRegistration
};

function getAllRegistration(req, res, next) {
  db.any('select * from registration')
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