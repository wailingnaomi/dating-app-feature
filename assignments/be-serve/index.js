const express = require('express');
const app = express();

express()
    .use(express.static('static'))
    .listen(8000)


app.use(function (req, res, next) {
    res.status(404).send("Oh no I can't find it")
})

