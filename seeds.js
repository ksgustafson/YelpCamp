const mongoose = require('mongoose');
const Comment = require('./models/comment');
const Station = require('./models/station');


const seeds = [
    {
	name: "KALX",
	source: "http://stream.kalx.berkeley.edu:8000/kalx-320.aac",
	description: "Broadcasts from the University of California in Berkeley, California at 90.7FM."
    },
    {
	name: "KFJC",
	source: "https://netcast.kfjc.org/kfjc-320k-aac",
	description: "Broadcasts from Foothill College in Los Altos Hills, California at 89.7FM."
    },
    {
	name: "KPFA",
	source: "https://icecast.pacifica.org:8443/kpfa",
	description: "Broadcasts from Berkeley, California at 94.1FM."
    }
];

async function seedDB () {
    try {
	await Station.deleteMany({});
	console.log('stations removed');
	await Comment.deleteMany({});
	console.log('comments removed');

	for ( const seed of seeds ) {
	    const station = await Station.create(seed);
	    console.log('station created');
	}
    } catch (err) {
	console.log(err);
    }

};

module.exports = seedDB;
