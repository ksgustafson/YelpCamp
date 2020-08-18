const Campground = require('../models/campground');
const Comment = require('../models/comment');

// all middleware defined here
const middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
	Campground.findById(req.params.id, function (err, foundCampground) {
	    if (err) {
		res.redirect('back');
	    } else {
		// does the user own the campground?
		//  .equals method provided by mongoose as its id is not a string, it is an object
		if (foundCampground.author.id.equals(req.user._id)) {
		    next();
		} else {
		    res.redirect('back');
		}
	    }
	});
    } else {
	res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
	Comment.findById(req.params.comment_id, function (err, foundComment) {
	    if (err) {
		res.redirect('back');
	    } else {
		// does the user own the comment?
		//  .equals method provided by mongoose as its id is not a string, it is an object
		if (foundComment.author.id.equals(req.user._id)) {
		    next();
		} else {
		    res.redirect('back');
		}
	    }
	});
    } else {
	res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
	return next();
    }
    res.redirect('/login');
};

module.exports = middlewareObj;
