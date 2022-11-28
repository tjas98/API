const express = require('express');
const request = require('request');
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require("body-parser")
const passport = require('passport')
const passportSetup = require('./api/config/passport')
var https = require('https');
var fs = require('fs');

var privateKey  = fs.readFileSync('privatekey.pem', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};


app = express();

var indexApi = require('./api/routes/index');
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443);


 
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

const PORT = 3000;

/*
app.listen(PORT, function() {
    console.log("Listening on port " + PORT);
})*/

