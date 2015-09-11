var express = require('express');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
  	'title' : 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
  	'title' : 'Login'
  });
});

router.post('/register', function(req, res, next){
	// Get Form Values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Check for Image Field
/*	if (req.files.profileimage) {
		console.log('Uploading File...');

		// File Info
		var profileImageOriginalName = req.files.profileimage.originalname;
		var profileImageName         = req.files.profileimage.name;
		var profileImageMime         = req.files.profileimage.mimetype;
		var profileImagePath         = req.files.profileimage.path;
		var profileImageExt          = req.files.profileimage.extension;
		var profileImageName         = req.files.profileimage.size;

	} else {
		// Set a default imamge
		var profileImageName = 'noimage.png';
	}*/


	// Form Validation
	req.checkBody('name', 'Name Field is required').notEmpty();
	req.checkBody('email', 'Email Field is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username Field is required').notEmpty();
	req.checkBody('password', 'Password Field is required').notEmpty();
	req.checkBody('password2', 'Passwords should match!').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors,
			name : name,
			email : email,
			username : username,
			password : password,
			password2 : password2
		});
	} else {
		var newUser = new User({
			name : name,
			email : email,
			username : username,
			password : password,
/*			profileimage: profileImageName
*/		});

		// Create User
		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});

		// Success Message
		req.flash('success', 'You are now register and may log in');
		res.location('/');
		res.redirect('/');
	}
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});



passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if (err) throw err;
			if (!user) {
				console.log('Unkown User');
				return done(null, false, {message: 'Unkown user'});
			}


/*			User.comparePassword(password, user.password, function(err, isMatch){
				if (error) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message : 'Invalid Password'});
				}
			});*/
		});
	}));

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res) {
	console.log('Authentication Successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout;
	req.flash('success', 'You have logged out');
	res.redirect('/users/login')
});





module.exports = router;
