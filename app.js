const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// campgrounds array
const campgrounds = [
    {name: "Angel Island",
     image: "https://pixabay.com/get/57e4d64a4a54ad14f1dc84609620367d1c3ed9e04e507440722c72dc9044c5_340.jpg"},
    {name: "Devil's Canyon",
     image: "https://pixabay.com/get/55e4d5454b51ab14f1dc84609620367d1c3ed9e04e507440722c72dc9044c5_340.jpg"},
    {name: "Stagnant Pond",
     image: "https://pixabay.com/get/55e7d24a485aac14f1dc84609620367d1c3ed9e04e507440722c72dc9044c5_340.jpg"}
];

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.post("/campgrounds", function (req, res) {
    // get data from form
    const name = req.body.name;
    const image = req.body.image;

    // add to campgrounds array
    const newCampground = {name: name, image: image};
    campgrounds.push(newCampground);

    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.listen(3000, function () {
    console.log("YelpCamp server is listening on port 3000.");
});
