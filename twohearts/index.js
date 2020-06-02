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
.get('/', users)
.delete('/:id', remove)
.get('/myprofile', myprofile)
.get('/myprofile/edit', editProfile) // gaat naar edit
.post('/myprofile', updateProfile) // update de profile
.listen(8000)




function users(req, res, next){
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


function updateProfile(req, res) {

    const itemID = req.params.id;

    db.collection('main').updateOne({"_id": ObjectId(itemID)}, {$set:{name:req.body.name}}, check)   

    function check(err, data){
        if(err){
            next(err)
        }else{
            res.redirect('/myprofile')
        }
    }
    // try{
    //     db.collection('main').updateOne({"_id": ObjectId(itemID)}, {$set:{name:req.body.name}})   
    //     console.log(itemID),
    //     console.log('updated'),
    //     res.status(200).send('updated')
    // } catch(e){
    //     console.log('failed to update')
    //     console.log(e);
    //     res.status(400).send(e)
    // }


}



function editProfile(req, res){
    res.render('editprofile.ejs')
}