const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// requiring a directory automatically requires index.js
const middleware = require('../middleware');

// +++++++++++++++++++++++
// comments routes
// +++++++++++++++++++++++

// new comment route (only accessible if logged in)
router.get('/new', middleware.isLoggedIn, function (req, res) {
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
router.post('/', middleware.isLoggedIn, function (req, res) {
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

// comment edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
	if (err) {
	    res.redirect('back');
	} else {
	    // id refers to the campground id, defined in app.js
	    res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
	}
    });
});

// comment update route
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
	if (err) {
	    res.redirect('back');
	} else {
	    res.redirect(`/campgrounds/${req.params.id}`);
	}
    });
});

// comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    // findByIdAndRemove...
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
	if (err) {
	    res.redirect('back');
	} else {
	    res.redirect(`/campgrounds/${req.params.id}`);
	}
    });
});


// export router
module.exports = router;
