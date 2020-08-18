// check for PORT and IP from environment (for running on a cloud server)
// and use localhost:3000 as a fallback
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || 'localhost';

// get database url from environment
const databaseURL = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp';

const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      flash          = require('connect-flash'),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      methodOverride = require('method-override'),
      Campground     = require('./models/campground'),
      Comment        = require('./models/comment'),
      User           = require('./models/user'),
      seedDB         = require('./seeds');

// require routes
const commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes       = require('./routes/index');

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to database.'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());

// seed database with campgrounds and comments
// seedDB();

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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// use routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(PORT, IP, function () {
    console.log(`YelpCamp server is listening on port ${PORT}.`);
});
