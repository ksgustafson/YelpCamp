const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to database.'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// db.collection.drop() to delete all entries from database
// (useful when making big changes to data instead of trying to fix existing data)

// compile Campground object
const Campground = mongoose.model("Campground", campgroundSchema);

/* for adding manually
Campground.create(
    {
	name: "Granite Hill",
	image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
	description: "It's a hill... well a pile really... of granite. Plenty of flat surfaces to sleep on."

    }, function (err, newlyCreated) {
    if (err) {
	// error
	console.log(err)
    } else {
	// new campground was added successfully
	console.log("success in adding: ");
	console.log(newlyCreated);
    }
});
*/

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    // get all campgrounds from database
    Campground.find({}, function (err, allCampgrounds) {
	if (err) {
	    // error, log it
	    console.log(err);
	} else {
	    // successfully retrieved campgrounds, render page
	    res.render("index", {campgrounds: allCampgrounds});
	}
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.post("/campgrounds", function (req, res) {
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
	    res.redirect("/campgrounds");
	}
    });

});

// this route must be defined after /campgrounds/new to be able to access new
app.get("/campgrounds/:id", function (req, res) {
    // find campground with provided id
    Campground.findById(req.params.id, function (err, foundCampground) {
	if (err) {
	    console.log(err);
	} else {
	    // render show template with that campground
	    res.render("show", {campground: foundCampground});
	}
    });
});

app.listen(3000, function () {
    console.log("YelpCamp server is listening on port 3000.");
});
