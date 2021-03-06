const Campground = require('../models/campground');
const Comment = require('../models/comment');

// all middleware defined here
const middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
	Campground.findById(req.params.id, function (err, foundCampground) {
	    if (err || !foundCampground) {
		req.flash('error', 'Campground not found.');
		res.redirect('back');
	    } else {
		// does the user own the campground?
		//  .equals method provided by mongoose as its id is not a string, it is an object
		if (foundCampground.author.id.equals(req.user._id)) {
		    next();
		} else {
		    req.flash('error', 'You do not have permission to do that.');
		    res.redirect('back');
		}
	    }
	});
    } else {
	req.flash('error', 'You must be logged in to do that!');
	res.redirect('/login');
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
	Comment.findById(req.params.comment_id, function (err, foundComment) {
	    if (err || !foundComment) {
		req.flash('error', 'Comment not found.');
		res.redirect('back');
	    } else {
		// does the user own the comment?
		//  .equals method provided by mongoose as its id is not a string, it is an object
		if (foundComment.author.id.equals(req.user._id)) {
		    next();
		} else {
		    req.flash('error', 'You do not have permission to do that');
		    res.redirect('back');
		}
	    }
	});
    } else {
	req.flash('error', 'You must be logged in to do that!');
	return res.redirect('/login');
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
	return next();
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/login');
};

module.exports = middlewareObj;
