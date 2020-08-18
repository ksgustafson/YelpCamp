const mongoose = require('mongoose');
const Comment = require('./models/comment');
const Campground = require('./models/campground');


const seeds = [
    {
	name: "Cloud's Rest",
	image: "https://images.unsplash.com/photo-1483381719261-6620dfa2d28a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=755&q=80",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
	name: "Hell's Buns",
	image: "https://images.unsplash.com/photo-1487750404521-0bc4682c48c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
	name: "Wharf Slosh",
	image: "https://images.unsplash.com/photo-1587752799766-8eb9791261d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
];

async function seedDB () {
    try {
	await Campground.deleteMany({});
	console.log('campgrounds removed');
	await Comment.deleteMany({});
	console.log('comments removed');

/*	for ( const seed of seeds ) {
	    const campground = await Campground.create(seed);
	    console.log('campground created');
	    const comment = await Comment.create(
		{
		    text: 'This place is great, but I wish they had internet.',
		    author: 'Homer'
		}
	    );
	    console.log('comment created');
	    campground.comments.push(comment);
	    campground.save();
	    console.log('comment added to campground');
*/	}
    } catch (err) {
	console.log(err);
    }

};

module.exports = seedDB;
