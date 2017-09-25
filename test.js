
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

// client.incomingPhoneNumbers.create({
//     voiceUrl: "http://demo.twilio.com/docs/voice.xml",
//     phoneNumber: "+15005550006"
// }, function(err, number) {
//     process.stdout.write(number.sid);
// });

// client.messages.create(
//   {
//     body: 'All in the game, yo',
//     to: '+60192691128',
//     from: '+15005550006',
//   },
//   (err, sms) => {
//   	console.log(sms + '\n' + err);
//     // process.stdout.write(sms.sid);
//   }
// );