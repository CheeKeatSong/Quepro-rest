var express = require('express');
var router = express.Router();

var db = require('../queries');

//Registraton method
router.get('/api/registration', db.getAllRegistration);
router.get('/api/registration/:id', db.getSingleRegistration);
router.post('/api/registration', db.createRegistration);
router.post('/api/registrationValidation', db.registrationValidation);
// router.put('/api/registration/:id', db.updateRegistration);
// router.delete('/api/registration/:id', db.removeRegistration);

//User method
router.get('/api/getUserById/:id', db.getUserById);
router.get('/api/getUserByMobileNumber/:mobileNumber', db.getUserByMobileNumber);

//Account verification method
router.post('/api/accountVerification', db.accountVerification);
router.post('/api/createUserAccount', db.createUserAccount);
router.get('/api/sendAccountVerificationSMSCode/:id', db.sendAccountVerificationSMSCode);
router.get('/api/sendAccountVerificationEmailCode/:id', db.sendAccountVerificationEmailCode);

//Account login
router.post('/api/loginCredentialRetrieval', db.loginCredentialRetrieval);

//Password reset
router.get('/api/sendPasswordResetSMSCode/:id', db.sendPasswordResetSMSCode);
router.get('/api/sendPasswordResetEmailCode/:id', db.sendPasswordResetEmailCode);
router.post('/api/resetPasswordVerification', db.resetPasswordVerification);
router.post('/api/resetPassword', db.resetPassword);

module.exports = router;
