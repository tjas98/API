const mongoose = require('mongoose');

//const url = "mongodb://localhost:27017/test";
const url = "mongodb://3.70.237.147/test";


const publicUrl = 'mongodb+srv://urnik:UrnikPreseren@urnik.vpq0cxv.mongodb.net/Urnik'

mongoose.connect(url)
const db = mongoose.connection
db.once('open', _ => {
    console.log("MONGO Connected")
})
