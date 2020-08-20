const express = require('express');
const router = express.Router();
const Station = require('../models/station');

// requiring a directory automatically requires index.js
const middleware = require('../middleware');

// index route - show all stations
router.get('/', function (req, res) {
    // get all stations from database
    Station.find({}, function (err, allStations) {
	if (err) {
	    // error, log it
	    console.log(err);
	} else {
	    // successfully retrieved stations, render page
	    res.render('stations/index', {stations: allStations});
	}
    });
});

// new route - add a new station
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('stations/new');
});

// create route - save new station in database
router.post('/', middleware.isLoggedIn, function (req, res) {
    // get data from form
    const name = req.body.name;
    const source = req.body.source;
    const description = req.body.description;
    
    // create author object
    const author = {
	id: req.user._id,
	username: req.user.username
    };
    
    // create new station object
    const newStation = {
	name: name,
	source: source,
	description: description,
	author: author
    };
    
    // add new station to database
    Station.create(newStation, function (err, newlyCreated) {
	if (err) {
	    // send user back to form with some message (implement later)
	    req.flash('error', 'Station was not added to database.');
	    res.redirect('/new');
	} else {
	    // redirect back to stations page
	    req.flash('success', 'Station added successfully!');
	    res.redirect('/stations');
	}
    });

});

// show route
// this route must be defined after /new to be able to access new
router.get('/:id', function (req, res) {
    // find station with provided id
    Station.findById(req.params.id).populate('comments').exec( function (err, foundStation) {
	if (err || !foundStation) {
	    req.flash('error', 'Station not found.');
	    res.redirect('back');
	} else {
	    // render show template with that station
	    res.render('stations/show', {station: foundStation});
	}
    });
});

// edit station route
router.get('/:id/edit', middleware.checkStationOwnership, function (req, res) {
    // find station and render edit form
    Station.findById(req.params.id, function (err, foundStation) {
	if (err) {
	    req.flash('error', 'Station was not found.');
	    res.redirect('/stations');
	} else {
	    res.render('stations/edit', {station: foundStation});
	}
    });
});

// update station route
router.put('/:id', middleware.checkStationOwnership, function (req, res) {
    // find and update the correct station
    Station.findByIdAndUpdate(req.params.id, req.body.station, function (err, updatedStation) {
	if (err) {
	    req.flash('error', 'Something went wrong when updating the database.');
	    res.redirect('/stations');
	} else {
	    // redirect to that station's show page
	    req.flash('success', 'Successfully updated station!');
	    res.redirect(`/stations/${req.params.id}`);
	}
    });

});

// destroy station route
router.delete('/:id', middleware.checkStationOwnership, function (req, res) {
    Station.findByIdAndRemove(req.params.id, function (err) {
	if (err) {
	    req.flash('error', 'Something went wrong when removing station.');
	    console.log(err);
	    res.redirect('back');
	} else {
	    res.redirect('/stations');
	}
    });
});

// export router
module.exports = router;
