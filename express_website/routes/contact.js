var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send', function(req, res, next) {
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'durant0515@gmail.com',
			pass: '2020462dl'
		}
	});

	var mailOptions = {
		from: 'Lin Du <lindu0515@gmail.com>',
		to: 'durant0515@gmail.com',
		subject: 'Website Submission',
		text: 'You have a new submission with the following details...
		Name: '+req.body.name + 'Email:' + req.body.email + 'Message:'
		+ req.body.email;
		html: '<p> You got a new submission </p>' 
	}

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
			res.redirect('/');
		} else {
			console.log('Message sent!');
			res.redirect('/');
		}
	});
});

module.exports = router;
