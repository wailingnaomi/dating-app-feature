const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongo = require ('mongodb')

require('dotenv').config()

let db = null
const url = process.env.DB_URL
const ObjectId = require('mongodb').ObjectID;

mongo.MongoClient.connect(url, function(err, client){
    if (err) {
        throw err
    }

    db = client.db(process.env.DB_NAME)
});



app
.use(express.static('static'))
.use(bodyParser.urlencoded({extended:true}))
.set('view engine', 'ejs')
.set('views', 'views')
.get('/', start)
.get('/match', profiles)
.delete('/match/:id', remove)
.listen(8000)


function start(req, res){
    res.render('start.ejs')
}



function profiles(req, res, next){
    db.collection('userdata').find().toArray(done)

    function done(err, data) {
        if (err){
            next(err)
        }else{
            res.render('list.ejs', {data: data})
        }
    }
}




function remove(req, res, next){
    const itemID = req.params.id;

    try{
        db.collection('userdata').deleteOne({"_id": ObjectId(itemID)});
        console.log(itemID);
        console.log('deleted');
        res.status(200).send('deleted');
    } catch(e){
        console.log('failed')
        console.log(e);
        res.status(400).send(e)
    }
}