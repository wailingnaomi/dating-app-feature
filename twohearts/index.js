const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongo = require ('mongodb')
const multer = require('multer')
const session = require('express-session') // Nog niks gedaan met sessions

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
.use(express.static('static'))
.use(bodyParser.urlencoded({extended:true}))
.set('view engine', 'ejs')
.set('views', 'views')
.get('/', users)
.delete('/:id', remove)
.get('/myprofile', myprofile)
.get('/myprofile/edit', editProfile)
.post('/myprofile/:id', uploadFile.single('profilepicture'),updateProfile)
.use(notFound)
.listen(8000)




function users(req, res, next){
    // Find array in collection userdata and send that to list.ejs
    db.collection('userdata').find().toArray(done)

    function done(err, data) {
        if (err){
            next(err)
        }else{
            res.render('list.ejs', {data: data})
        }
    }
}

// Class mate helped me to write this function
function remove(req, res, next){
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
    db.collection('main').find().toArray(done)

    function done(err, data) {
        if (err){
            next(err)
        }else{
            res.render('myprofile.ejs', {data: data})
        }
    }
}


function updateProfile(req, res, next) {
    try{
        //https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
        db.collection('main').updateOne({"_id": ObjectId("5ed56404252bf51450273018")}, 
        {$set: //To update the values of the form
            {
            img: req.file ? req.file.filename : null,
            username:req.body.name,
            age: req.body.age,
            bio: req.body.bio,
            }
        })   
        console.log('updated'),
        res.redirect('/myprofile'),
        res.status(200).send('updated')
    } catch(e){
        console.log('failed to update')
        console.log(e);
        res.status(400).send(e)
    }
}


function editProfile(req, res){
    res.render('editprofile.ejs')
}

function notFound(req, res){
    res.status(404).render('notfound.ejs')
}