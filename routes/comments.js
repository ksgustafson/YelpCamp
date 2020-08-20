const express = require('express');
const router = express.Router({mergeParams: true});
const Station = require('../models/station');
const Comment = require('../models/comment');

// requiring a directory automatically requires index.js
const middleware = require('../middleware');

// +++++++++++++++++++++++
// comments routes
// +++++++++++++++++++++++

// new comment route (only accessible if logged in)
router.get('/new', middleware.isLoggedIn, function (req, res) {
    // find station by id
    Station.findById(req.params.id, function (err, station) {
	if (err) {
	    req.flash('error', 'Station was not found');
	    console.log(err);
	    res.redirect('/stations');
	} else {
	    res.render('comments/new', {station: station});
	}
    });
});

// create comment route (and prevent anyone from adding a comment if they are not logged in)
router.post('/', middleware.isLoggedIn, function (req, res) {
    // look up station using id
    Station.findById(req.params.id, function (err, station) {
	if (err) {
	    console.log(err);
	    res.redirect('/stations');
	} else {
	    Comment.create(req.body.comment, function (err, comment) {
		if (err) {
		    req.flash('error', 'Something went wrong when creating new comment');
		    console.log(err);
		    res.redirect('back');
		} else {
		    // add username and id to comment
		    comment.author.id = req.user._id;
		    comment.author.username = req.user.username;
		    // save comment
		    comment.save();
		    // add comment to station
		    station.comments.push(comment);
		    station.save();
		    res.redirect(`/stations/${station._id}`);
		}
	    });
	}
    });
});

// comment edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    Station.findById(req.params.id, function (err, foundStation) {
	if (err || !foundStation) {
	    req.flash('error', 'Station not found.');
	    return res.redirect('back');
	}
	
	Comment.findById(req.params.comment_id, function (err, foundComment) {
	    if (err) {
		req.flash('error', 'Comment could not be found.');
		res.redirect('back');
	    } else {
		// id refers to the station id, defined in app.js
		res.render('comments/edit', {station_id: req.params.id, comment: foundComment});
	    }
	});
    });
});

// comment update route
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
	if (err) {
	    req.flash('error', 'Comment could not be updated.');
	    res.redirect('back');
	} else {
	    res.redirect(`/stations/${req.params.id}`);
	}
    });
});

// comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    // findByIdAndRemove...
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
	if (err) {
	    req.flash('error', 'Comment could not be removed.');
	    res.redirect('back');
	} else {
	    res.redirect(`/stations/${req.params.id}`);
	}
    });
});


// export router
module.exports = router;
