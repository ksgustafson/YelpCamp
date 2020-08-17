const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// index route - show all campgrounds
router.get('/', function (req, res) {
    // get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
	if (err) {
	    // error, log it
	    console.log(err);
	} else {
	    // successfully retrieved campgrounds, render page
	    res.render('campgrounds/index', {campgrounds: allCampgrounds});
	}
    });
});

// new route - add a new campground
router.get('/new', function (req, res) {
    res.render('campgrounds/new');
});

// create route - save new campground in database
router.post('/', function (req, res) {
    // get data from form
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;

    // create new campground object
    const newCampground = {name: name, image: image, description: description};
    
    // add new campground to database
    Campground.create(newCampground, function (err, newlyCreated) {
	if (err) {
	    // send user back to form with some message (implement later)
	    console.log(err)
	} else {
	    // redirect back to campgrounds page
	    res.redirect('/');
	}
    });

});

// show route
// this route must be defined after //new to be able to access new
router.get('/:id', function (req, res) {
    // find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec( function (err, foundCampground) {
	if (err) {
	    console.log(err);
	} else {
	    // render show template with that campground
	    res.render('campgrounds/show', {campground: foundCampground});
	}
    });
});

// middleware
function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
	return next();
    }
    res.redirect('/login');
}

// export router
module.exports = router;
