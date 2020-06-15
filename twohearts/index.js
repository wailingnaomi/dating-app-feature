const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongo = require ('mongodb')
const multer = require('multer')
const session = require('express-session')

require('dotenv').config()

// Connect server with database
let db = null
const url = process.env.DB_URL
const ObjectId = require('mongodb').ObjectID;

mongo.MongoClient.connect(url, function(err, client){
    if (err) {
        throw err
    }

    db = client.db(process.env.DB_NAME) 
});



// A folder where the uploaded files are stored
var uploadFile = multer ({dest: 'static/uploads/'})

// What files should de stored
const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, Date.now() + '.jpg');
	}
});


app
.set('view engine', 'ejs')
.set('views', 'views')
.use(express.static('static'))
.use(bodyParser.urlencoded({extended:true}))
.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))

.get('/', start) // register and login
.get('/home', users) // homepage with all the users

.get('/myprofile', myprofile) //profile
.post('/myprofile', uploadFile.single('profilepicture'), addprofile) // add a profile?

.get('/myprofile/edit', editProfile) //edit profile form
.post('/myprofile/:id', uploadFile.single('profilepicture'), updateProfile) //update profile

.delete('/home/:id', remove) // dislike user
.use(notFound)
.listen(8000)


function start(req, res){
    res.render('start.ejs')
}

let dataProfile;


function addprofile(req, res){
    if(req.session.user){
        res.redirect("/home")
    } else {
        dataProfile = {
            img: req.file ? req.file.filename : null,
            username:req.body.name,
            age: req.body.age,
            bio: req.body.bio,
            interests: req.body.interests
        };
        console.log(dataProfile)
        res.redirect("/home");
    }
}





function users(req, res, next){
    // Find array in collection userdata and send that to list.ejs
    db.collection('userdata').find({gender: "male"}).toArray(done)

    function done(err, data) {
        if (err){
            next(err)
        }else{
            res.render('list.ejs', {data: data, user: req.session.user})
            console.log(req.session.user)
        }
    }

    try{
        req.session.user = dataProfile
        console.log(dataProfile)
        db.collection('userdata').insertOne(req.session.user, registerUser);

        function registerUser(err, data) {
            if (err) {
                next(err);
                console.log('yoooo')
            } else {
                req.session.user._id = data.insertedId;
                console.log(req.session.user)
                console.log('ewaaaaa')
            }
        }

    }catch(e){
        console.log('nooooopeeeeeeee')
        console.log(e);
        res.status(400).send(e)
    }

}





// Class mate helped me to write this function
function remove(req, res){
    // Get ID of a user
    const itemID = req.params.id;

    try{
        // delete a id from the collection userdata
        db.collection('userdata').deleteOne({"_id": ObjectId(itemID)});
        console.log(itemID); // To check which ID is going to be deleted
        console.log('deleted');
        res.status(200).send('deleted');
    } catch(e){
        console.log('failed')
        console.log(e);
        res.status(400).send(e)
    }
}



function myprofile(req, res, next){
    db.collection('userdata').findOne({_id: mongo.ObjectId(req.session.user._id) }, done);
    console.log(req.session.user._id)

    
    function done(err, data) {
        if (err){
            next(err)
        }else{
            res.render('myprofile.ejs', {data: data})
            console.log(data)
            console.log('this is' + req.session.user._id)
        }
    }


}




function updateProfile(req, res) {

        //https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
        db.collection('userdata').updateOne({
            _id: ObjectId(req.session.user._id) }, 
        {$set: //To update the values of the form
            {
            img: req.file ? req.file.filename : null,
            username:req.body.name,
            age: req.body.age,
            bio: req.body.bio,
            interests: req.body.interests
            }
        }, done)  ;
        // console.log('updated'),
        
        // res.status(200).send('updated')
  
        function done(err){
            if(err){
                next(err);
            }else{
                res.redirect('/myprofile')
            }
        }
}



function editProfile(req, res){
    res.render('editprofile')

}

function notFound(req, res){
    res.status(404).render('notfound.ejs')
}