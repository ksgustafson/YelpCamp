const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// +++++++++++++++++++++++
// comments routes
// +++++++++++++++++++++++

// new comment route (only accessible if logged in)
router.get('/new', isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
	if (err) {
	    console.log(err);
	} else {
	    res.render('comments/new', {campground: campground});
	}
    });
});

// create comment route (and prevent anyone from adding a comment if they are not logged in)
router.post('/', isLoggedIn, function (req, res) {
    // look up campground using id
    Campground.findById(req.params.id, function (err, campground) {
	if (err) {
	    console.log(err);
	    res.redirect('/campgrounds');
	} else {
	    Comment.create(req.body.comment, function (err, comment) {
		if (err) {
		    console.log(err);
		} else {
		    // add username and id to comment
		    comment.author.id = req.user._id;
		    comment.author.username = req.user.username;
		    // save comment
		    comment.save();
		    // add comment to campground
		    campground.comments.push(comment);
		    campground.save();
		    res.redirect(`/campgrounds/${campground._id}`);
		}
	    });
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
