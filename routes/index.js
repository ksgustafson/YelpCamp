const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// root route
router.get('/', function (req, res) {
    res.render('landing');
});

// show register form
router.get('/register', function (req, res) {
    res.render('register');
});

// sign up logic
router.post('/register', function (req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
	if (err) {
	    req.flash('error', err.message);
	    res.redirect('/register');
	}
	passport.authenticate("local") (req, res, function() {
	    req.flash('success', `Welcome to YelpCamp ${user.username}!`);
	    res.redirect('/campgrounds');
	});
    });
});

// show login form
router.get('/login', function (req, res) {
    res.render('login');
});

// login logic
router.post('/login', passport.authenticate('local',
    {
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	failureFlash: true
    }), function (req, res) {
});

// logout route
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You have been logged out!');
    res.redirect('/campgrounds');
});

// export router
module.exports = router;
