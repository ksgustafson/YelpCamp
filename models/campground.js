const mongoose = require('mongoose');

// campgrounds contain a name, image, description and comments
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
	{
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Comment'
	}
    ]
});

// export Campground model object
module.exports = mongoose.model('Campground', campgroundSchema);