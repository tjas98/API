

const { admin_reports_v1 } = require("googleapis");
const model = require("../models/models");
const mongoose = require('mongoose');

const Dijak = model.Dijak;
const StalenProfesorji = model.StalenProfesorji;
const StalenPredmeti = model.StalenPredmeti;
const StalenZaProfesorja = model.StalenZaProfesorja;

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

const Spremembe = model.Sprememba;

const Suplenti = model.Suplenti;

const Admin = model.Admins;

var mailDijaka = (req, res) => {
    console.log(req.body.mail)

    Dijak.findOne({email: req.body.mail}, function(err, dijak) {
        if (err) res.send("Napaka")
        else res.send(dijak)
    })
}

var vsiProfesorji = (req, res) => {
    var quer = StalenZaProfesorja.find({}).select({ "profesor": 1, "_id": 0});
    quer.exec(function (err, value) {
        if (err) return next(err);
        res.send(value)
    });
}

var vsiRazredi = (req, res) => {

    var quer = StalenPredmeti.find({}).select({"razred": 1, "_id": 0});

    quer.exec(function (err, value) {
        if (err) return next(err)
        res.send(value)
    })
}

var najdiUrnik = (req, res) => {
    var razred = req.params.razred;
    
    var query = UrnikPredmeti.findOne({razred: razred}).select({'_id': 0, '_v': 0});
    var query2 = Profesorji.findOne({razred: razred}).select({'_id': 0, '_v': 0});

    var obj = {
        predmeti: Array,
        profesorji: Array
    }

    query.exec(function(err, rezultat) {
        obj.predmeti = rezultat;
        query2.exec(function(err, rezultat2) {
            obj.profesorji = rezultat2
            res.send(obj);
        })
    })
    
    
}

var urnikVsehRazredov = (req, res) => {
    var query = UrnikPredmeti.find({}).select({'_id': 0});
    var query2 = Profesorji.find({}).select({'_id': 0});
    var query3 = UrnikZaProfesorja.find({}).select({'_id': 0})

    var obj = {
        predmeti: Array,
        profesorji: Array,
        urnikProf: Array
    } 

    query.exec(function(err, rezultat1) {
        query2.exec(function(err, rezultat2) {
            query3.exec(function(err, rezultat3) {
                obj.predmeti = rezultat1;
                obj.profesorji = rezultat2;
                obj.urnikProf = rezultat3;
                res.send(obj);
            })
        })
    })
}

var stalenUrnik = (req, res) => {
    var a = StalenPredmeti.find({}).select({'_id': 0});
    var b = StalenProfesorji.find({}).select({'_id': 0});
    var c = StalenZaProfesorja.find({}).select({'_id': 0});

    var obj = {
        predmeti: Array,
        profesorji: Array,
        urnikZaProf: Array
    } 

    Promise.all([a,b,c]).then(r => {
        obj.predmeti = r[0];
        obj.profesorji = r[1];
        obj.urnikZaProf = r[2];
        res.send(obj)
    })
}

var prosto = (req, res) => {

    var dan = req.params.dan;
    

    StalenZaProfesorja.find({}).exec(function(err, rezultat) {
        
        for (var i = 0; i < rezultat.length; i++) {
            for (var j = 0; j < 7; j++) {
                
                if (rezultat[i][dan][j] == " " || rezultat[i][dan][j] == "" || rezultat[i][dan][j] == undefined || rezultat[i][dan][j] == "  ") {
                    rezultat[i][dan][j] = "Prosto"
                }
            }   
            //rezultat[i].save();
        }
        res.send("Zamenjano")

    })

}

var getUrnikprof = (req, res) => {
    var profesor = req.params.razred;
    
    var query = UrnikZaProfesorja.findOne({profesor: profesor}).select({'_id': 0, '_v': 0});
    query.exec(function(err, rezultat) {
        res.send(rezultat)
    })
}

var urnikProfesorjaNaDan = (req, res) => {
    var profesor = req.params.profesor;
    var dan = req.params.dan;
    var izbranDan = UrnikZaProfesorja.findOne({profesor: profesor}).select({"_id": 0});
    izbranDan.exec(function(err, value) {
        if (value) {
            res.send(value[dan])
        }
    })
}

var urnikPriSpremembi = (req, res) => {
    var razredi = req.params.razredi.split(',');
    var dan = req.params.dan.toLowerCase();
    var obj = { predmeti: Array, profesorji: Array }

    for (var i = 0; i < razredi.length; i++) {
        razredi[i] = razredi[i].toUpperCase();
    }

    var query1 = UrnikPredmeti.find().sort().where('razred').in(razredi)
    var query2 = Profesorji.find().sort().where('razred').in(razredi)

    var u = [];
    var p = [];

    query1.exec(function(err, rezultat) {
        query2.exec(function(err, rezultat2) {
            for (var i = 0; i < rezultat.length; i++) {
                u.push(rezultat[i][dan])
                p.push(rezultat2[i][dan])
            }
            obj.predmeti = u;
            obj.profesorji = p;
            res.send(obj)
        })
    })

    
}

var vseSpremembe = (req, res) => {
    Spremembe.find({}).exec(function(err, r) {
        res.send(r)
    })
}

var download = (req, res) => {
    const file = 'api/controllers/Urnik.xlsx';
    res.download(file);
}

var dijak = (req, res) => {
    var ime = req.body.ime;
    var priimek = req.body.priimek;
    var mail = req.body.mail;

    Dijak.findOne({mail: mail}, function(err, d) {
        if (d) {
            res.send({razred: d.razred});
        } else {
            const noviDijak = new Dijak();
            noviDijak.ime = ime;
            noviDijak.priimek = priimek;
            noviDijak.mail = mail;
            noviDijak.save();
            res.send("ok")
        }
    })
}

var razred = (req, res) => {
    var razred = req.body.razred;
    var mail = req.body.mail;

    Dijak.findOne({mail: mail}, function(err, d) {
        if (d) {
            d.razred = razred;
            d.save();
            res.send({razred: razred});
        }
    })
}

var getSuplenti = (req, res) => {
    Suplenti.find({}).then(function(r) {
        res.send(r);
    })
}

var admin = (req, res) => {

    var mail = req.params.mail;

    console.log(mail)
    

    Admin.findOne({mail: mail}).then(function(r) {
        console.log(r)
        if (r) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
    
    
}

var zeUrnik = (req, res) => {
    model.PodatkiUrnika.find({}).then(function(r) {
        console.log(r)
        if (r.length > 0) {
            res.send({info: "Ja"})
        } else {
            res.send({info: "Ne"})
        }
    })
}


var fs = require('fs');

var PDF = (req, res) => {

    
var writeStream = fs.createWriteStream("file.xls");

var header="Sl No"+"\t"+" Age"+"\t"+"Name"+"\n";
var row1 = "0"+"\t"+" 21"+"\t"+"Rob"+"\n";
var row2 = "1"+"\t"+" 22"+"\t"+"bob"+"\n";

writeStream.write(header);
writeStream.write(row1);
writeStream.write(row2);

writeStream.close();

    
}

var ex = (req, res) => {
    model.UrnikString.find({}).then(function(r)  {
        console.log(r)
        res.send(r);
    })
}

var ure = (req, res) => {
    model.PodatkiUrnika.find({}).then(function(r) {
        if (r[0] != undefined) {
            res.send(r[0].ure)
        } else {
            res.send([1,2,3,4,5,6,7])
        }
        
    })
}

var kopiraj = (req, res) => {

    const url = "mongodb://localhost:27017";
    mongoose.connect(url)
    const db = mongoose.connection

    var m = { copydb: 1,  fromhost: 'localhost', fromdb: "test", todb: "Prova"}
    
    db.once('open', _ => {
        var admin = db.admin()
        console.log("MONGO Connected")
        admin.command(m, function(err, res) {
            console.log(res)
        })
    })
    
    res.send("A")
    
}

var urnikVsehProf = (req, res) => {
    model.PrikazProfesorji.find({}).then(r => {
        res.send(r)
    })
}

module.exports = {
    mailDijaka,
    najdiUrnik,
    urnikVsehRazredov,
    stalenUrnik,
    prosto,
    vsiProfesorji,
    vsiRazredi,
    getUrnikprof,
    urnikProfesorjaNaDan,
    urnikPriSpremembi,
    vseSpremembe,
    download,
    dijak,
    razred,
    getSuplenti,
    admin,
    zeUrnik,
    PDF,
    ex,
    ure,
    kopiraj,
    urnikVsehProf

}