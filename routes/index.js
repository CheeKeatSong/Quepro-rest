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

//Account verification method
router.post('/api/accountVerification', db.accountVerification);
router.post('/api/createUserAccount', db.createUserAccount);

//Account verification code method
router.get('/api/resendSMSCode/:id', db.resendSMSCode);
router.get('/api/resendEmailCode/:id', db.resendEmailCode);

//Account login
router.post('/api/loginCredentialRetrieval', db.loginCredentialRetrieval);

//Password reset
router.get('/api/resetPasswordVerificationCode', db.resetPasswordVerificationCode);
router.post('/api/resetPassword', db.resetPassword);

module.exports = router;
