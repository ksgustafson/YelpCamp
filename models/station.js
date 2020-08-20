const mongoose = require('mongoose');

// stations contain a name, source, description and comments
const stationSchema = new mongoose.Schema({
    name: String,
    source: String,
    description: String,
    author: {
	id: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: "User"
	},
	username: String
    },
    comments: [
	{
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Comment'
	}
    ]
});

// export Station model object
module.exports = mongoose.model('Station', stationSchema);
