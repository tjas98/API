const express = require('express');
const request = require('request');
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require("body-parser")
const classeviva = require('classeviva')
const passport = require('passport')
const passportSetup = require('./api/config/passport')

app = express();

var indexApi = require('./api/routes/index');


 
app.use(bodyParser.json()) 

app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/', (req, res) => {
    res
      .status(200)
      .send('Hello server is running')
      .end();
  });

app.use('/api', indexApi);

const PORT = 80;


app.listen(PORT, function() {
    console.log("Listening on port " + PORT);
})

