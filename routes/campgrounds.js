const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// requiring a directory automatically requires index.js
const middleware = require('../middleware');

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
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

// create route - save new campground in database
router.post('/', middleware.isLoggedIn, function (req, res) {
    // get data from form
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    
    // create author object
    const author = {
	id: req.user._id,
	username: req.user.username
    };
    
    // create new campground object
    const newCampground = {
	name: name,
	price: price,
	image: image,
	description: description,
	author: author
    };
    
    // add new campground to database
    Campground.create(newCampground, function (err, newlyCreated) {
	if (err) {
	    // send user back to form with some message (implement later)
	    req.flash('error', 'Campground was not added to database.');
	    res.redirect('/new');
	} else {
	    // redirect back to campgrounds page
	    req.flash('success', 'Campground added successfully!');
	    res.redirect('/campgrounds');
	}
    });

});

// show route
// this route must be defined after /new to be able to access new
router.get('/:id', function (req, res) {
    // find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec( function (err, foundCampground) {
	if (err || !foundCampground) {
	    req.flash('error', 'Campground not found.');
	    res.redirect('back');
	} else {
	    // render show template with that campground
	    res.render('campgrounds/show', {campground: foundCampground});
	}
    });
});

// edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
    // find campground and render edit form
    Campground.findById(req.params.id, function (err, foundCampground) {
	if (err) {
	    req.flash('error', 'Campground was not found.');
	    res.redirect('/campgrounds');
	} else {
	    res.render('campgrounds/edit', {campground: foundCampground});
	}
    });
});

// update campground route
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
	if (err) {
	    req.flash('error', 'Something went wrong when updating the database.');
	    res.redirect('/campgrounds');
	} else {
	    // redirect to that campground's show page
	    req.flash('success', 'Successfully updated campground!');
	    res.redirect(`/campgrounds/${req.params.id}`);
	}
    });

});

// destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
	if (err) {
	    req.flash('error', 'Something went wrong when removing campground.');
	    console.log(err);
	    res.redirect('back');
	} else {
	    res.redirect('/campgrounds');
	}
    });
});

// export router
module.exports = router;
