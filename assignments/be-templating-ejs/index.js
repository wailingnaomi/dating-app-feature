const express = require('express');
const app = express();
const ejsLint = require('ejs-lint');

//Template engine
app.set('view engine', 'ejs');

app.get('/', function (req, res){
    res.render('index');
});

app.get('/contact', function(req, res){
    res.render('contact');
});

app.get('/profile/:name', function(req, res){
    const data = {
        age: 20,
        job: 'ninja',
        hobbies: ['eating', 'travelling', 'fighting']
    };

    res.render('profile', {person: req.params.name, data: data});
});

app.listen(8000, () => {
    console.log("Server is starting at port ", 8000);
});