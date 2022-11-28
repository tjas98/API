const express = require('express');
const request = require('request');
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require("body-parser")
const passport = require('passport')
const passportSetup = require('./api/config/passport')
var https = require('https');
var http = require('http')
var fs = require('fs');

var key = fs.readFileSync('selfsigned.key');
var cert = fs.readFileSync('selfsigned.crt');

var options = {
  key: key,
  cert: cert
};


app = express();

var indexApi = require('./api/routes/index');



 
app.use(bodyParser.json()) 

app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/', (req, res) => {
 res.send("DELA")
})

app.use('/api', indexApi);

var server = https.createServer(options, app);

const PORT = 3000;

server.listen(4000, () => {
  console.log("server starting on port : " + port)
});

/*
app.listen(PORT, function() {
    console.log("Listening on port " + PORT);
})*/

