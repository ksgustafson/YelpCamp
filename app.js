const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campground = require('./models/campground'),
      Comment    = require('./models/comment'),
      seedDB     = require('./seeds');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to database.'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

// seed database with campgrounds and comments
seedDB();

/* for adding manually
Campground.create(
    {
	name: 'Granite Hill',
	image: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
	description: 'It's a hill... well a pile really... of granite. Plenty of flat surfaces to sleep on.'

    }, function (err, newlyCreated) {
    if (err) {
	// error
	console.log(err)
    } else {
	// new campground was added successfully
	console.log('success in adding: ');
	console.log(newlyCreated);
    }
});
*/

app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/campgrounds', function (req, res) {
    // get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
	if (err) {
	    // error, log it
	    console.log(err);
	} else {
	    // successfully retrieved campgrounds, render page
	    res.render('campgrounds/index', {campgrounds: allCampgrounds});
	}
    });
});

app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new');
});

app.post('/campgrounds', function (req, res) {
    // get data from form
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;

    // create new campground object
    const newCampground = {name: name, image: image, description: description};
    
    // add new campground to database
    Campground.create(newCampground, function (err, newlyCreated) {
	if (err) {
	    // send user back to form with some message (implement later)
	    console.log(err)
	} else {
	    // redirect back to campgrounds page
	    res.redirect('/campgrounds');
	}
    });

});

// this route must be defined after /campgrounds/new to be able to access new
app.get('/campgrounds/:id', function (req, res) {
    // find campground with provided id
    Campground.findById(req.params.id).populate('comments').exec( function (err, foundCampground) {
	if (err) {
	    console.log(err);
	} else {
	    // render show template with that campground
	    res.render('campgrounds/show', {campground: foundCampground});
	}
    });
});

// +++++++++++++++++++++++
// comments routes
// +++++++++++++++++++++++

// new comment route
app.get('/campgrounds/:id/comments/new', function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
	if (err) {
	    console.log(err);
	} else {
	    res.render('comments/new', {campground: campground});
	}
    });
});

// create comment route
app.post('/campgrounds/:id/comments', function (req, res) {
    // look up campground using id
    Campground.findById(req.params.id, function (err, campground) {
	if (err) {
	    console.log(err);
	    res.redirect("/campgrounds");
	} else {
	    Comment.create(req.body.comment, function (err, comment) {
		if (err) {
		    console.log(err);
		} else {
		    campground.comments.push(comment);
		    campground.save();
		    res.redirect(`/campgrounds/${campground._id}`);
		}
	    });
	}
    });
});

app.listen(3000, function () {
    console.log('YelpCamp server is listening on port 3000.');
});
