const express = require("express");
const app = express();

//static route, respond with "hi there" when a GET request is made
app.get("/", function (req, res) {
    res.send("Hi there");
});

//tatic route to test, respond with "this is a contact page" when a GET request is made with /contact
app.get("/contact", function (req, res) {
    res.send("this is a contact page");
});

//dynamic route, request any route that match the letter "a"
app.get(/a/, function(req, res){
    res.send("Succesful route path with the letter A ");
});

//dynamic route with params
app.get("/profile/:username", function(req, res){
    res.send("You requested to see a profile with the username of " + req.params.username);
});

// the server listens to port 8000
app.listen(8000);



