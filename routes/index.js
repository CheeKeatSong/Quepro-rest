var express = require('express');
var router = express.Router();

var db = require('../queries');

//Registraton method
router.get('/api/registration', db.getAllRegistration);
router.get('/api/registration/:id', db.getSingleRegistration);
router.post('/api/registration', db.createRegistration);
router.put('/api/registration/:id', db.updateRegistration);
router.delete('/api/registration/:id', db.removeRegistration);

module.exports = router;
