// check for PORT from environment (for running on a cloud server)
// and use 3000 as a fallback
const PORT = process.env.PORT || 3000;

const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      Campground    = require('./models/campground'),
      Comment       = require('./models/comment'),
      User          = require('./models/user'),
      seedDB        = require('./seeds');

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

// passport configuration

// setup express session
app.use(require('express-session')({
    secret: 'another horribly insecure secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// to replace secret with env var:
//   1 - generate a secret in the shell with something like:
//         head -c20 /dev/urandom | base64
//       example output: GNSO5LU4617LlRPL6HrkXTiKSwc=
//   2 - keep that secret in a password vault (basically admin password)
//   3 - pass secret when starting the server:
//         SESSION_SECRET='GNSO5LU4617LlRPL6HrkXTiKSwc=' node app.js
//   4 - define secret here with:
//         secret: process.env.SESSION_SECRET   

// middleware to run on each route
//   to make current user accessible for each route
app.use( function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', function (req, res) {
    res.render('landing');
});

// index route - show all campgrounds
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

// new route - add a new campground
app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new');
});

// create route - save new campground in database
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

// new comment route (only accessible if logged in)
app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
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
app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
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

// ~~@~~~@~@~@~@@@~
// auth routes
// ~~@~~~@~@~@~@@@~

// show register form
app.get('/register', function (req, res) {
    res.render('register');
});

// sign up logic
app.post('/register', function (req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
	if (err) {
	    console.log(err);
	    return res.render('register');
	}
	passport.authenticate("local") (req, res, function() {
	    res.redirect('/campgrounds');
	});
    });
});

// show login form
app.get('/login', function (req, res) {
    res.render('login');
});

// login logic
app.post('/login', passport.authenticate('local',
    {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
    }), function (req, res) {
});

// logout route
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
	return next();
    }
    res.redirect('/login');
}

app.listen(PORT, function () {
    console.log(`YelpCamp server is listening on port ${PORT}.`);
});
