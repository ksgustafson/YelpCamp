const mongoose = require('mongoose');

// comments require text and an author
const commentSchema = new mongoose.Schema({
    text: String,
    author: {
	id: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	username: String
    }
});

// export Comment model object
module.exports = mongoose.model('Comment', commentSchema);
