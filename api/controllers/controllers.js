const mysql = require('mysql');
const mongoose = require('mongoose');
const router = require('../routes');
const { response } = require('express');
const model = require("../models/models");
const { send } = require('express/lib/response');

const Dijak = model.Dijak;

const StalenProfesorji = model.StalenProfesorji;
const StalenPredmeti = model.StalenPredmeti;
const StalenZaProfesorja = model.StalenZaProfesorja;

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

/*
const conn = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "sasatjas1A+",
    database: 'preseren'
});


conn.connect(function(err) {
    if (err) console.log(err)
    else console.log("Connected");
})
*/

var dodaj = (req, res) => {
    
    var pon = []
    var tor = []
    var sre = []
    var cet = []
    var pet = []
    var sob = []

    var query = Urnik.find()

    

    query.exec(function(err, x) {
        for (var i = 0; i < x.length; i++) {
            console.log(x[i])
            var a = new UrnikDijaka2();
            a.razred = x[i]["razred"]
            pon = x[i]["pon"].split(',')
            tor = x[i]["tor"].split(',')
            sre = x[i]["sre"].split(',')
            cet = x[i]["cet"].split(',')
            pet = x[i]["pet"].split(',')
            sob = x[i]["sob"].split(',')
            a.pon = pon
            a.tor = tor
            a.sre = sre
            a.cet = cet
            a.pet = pet
            a.sob = sob
            //a.save()
        }
    })

   
    res.send("a")
}

var mailDijaka = (req, res) => {
    console.log(req.body.mail)

    Dijak.findOne({email: req.body.mail}, function(err, dijak) {
        if (err) res.send("Napaka")
        else res.send(dijak)
    })
}

var urnikDijaka = (req, res) => {

    var razred = req.body.razred;

    var urnik = UrnikDijaka2.findOne({razred: razred}).select({'_id': 0, '__v': 0})

    urnik.exec(function(err, x) {
        res.send(x)
    })

    /*
    Urnik.find({razred: razred}, function(err, urnik) {
        if (err) res.send(err)
        else res.send(urnik)
    })
    */
}

var urnikProfesorja = (req, res) => {
    var profesor = req.body.profesor;
    const urprof = UrnikProfesorja2.findOne({profesor: profesor})

    urprof.exec(function(err, urnikProfesorja) {
        res.status(200).send(urnikProfesorja)
    })
}

var vsiProfesorji = (req, res) => {

    var quer = model.StalenProfesorji.find({}).select({ "profesor": 1, "_id": 0});
    quer.exec(function (err, value) {
        console.log(value)
        if (err) return next(err);
        res.send(value)
    });
}

var vsiRazredi = (req, res) => {

    var quer = Urnik.find({}).select({"razred": 1, "_id": 0});

    quer.exec(function (err, value) {
        if (err) return next(err)
        res.send(value)
    })
}

var urnikProfesorjaNaDan = (req, res) => {
    var profesor = req.body.profesor;
    var dan = req.body.dan;
    var izbranDan = UrnikProfesorja2.findOne({profesor: profesor}).select({"_id": 0});
    izbranDan.exec(function(err, value) {
        res.send(value[dan])
    })
}


var urnikDijaka2 = (req, res) => {
    var razredi = req.body.razredi;
    var dan = req.body.dan.toLowerCase();

    console.log(razredi)
    

    for (var i = 0; i < razredi.length; i++) {
        razredi[i] = razredi[i].toUpperCase();
    }

    var a = UrnikDijaka2.find().sort().where('razred').in(razredi)

    var urnik = [];

    a.exec(function(err, resa) {
        for (var i = 0; i < resa.length; i++) {
            urnik.push(resa[i][dan])
        }
        res.send(urnik)
    })  
}

var prova = (req, res) => {

    var razredi = req.body.razredi;
    var dan = req.body.dan.toLowerCase()

    for (var i = 0; i < razredi.length; i++) {
        razredi[i] = razredi[i].toLowerCase();
    }
    var query = UrnikProf.find({})

        var a = [];
        var tabela = [];

        var tabela = new Array(razredi.length).fill("").map(() => new Array(7).fill(""));

        query.exec((err, v) => {

            for (var x = 0; x < razredi.length; x++) {
                for (var i = 0; i < v.length; i++) {
                    if (v[i][dan].includes(razredi[x])) {
                        a.push((v[i]["ime"] +","+ v[i][dan]).split(','))
                    }
                }
    
                var dolzina = a.length;
                
                
                for (var i = 0; i < dolzina; i++) {
                    for (var j = 0; j < a[i].length; j++) {
                        if (a[i][j].includes(razredi[x])) {
                            tabela[x][j-1] = a[i][0];
                        }
                    }
                }
            }

            console.log(tabela)

            res.send(tabela)
    
        })


}



var izbrisiProfesorjaNaDan = (req, res) => {
    var dan = req.body.dan;
    var profesor = req.body.profesor;

    console.log(dan, profesor)

    //var query = UrnikProfesorja2.findOne({profesor: profesor});

    UrnikDijaka2.find().exec(function(err, urnik) {
        for (var i = 0; i < urnik.length; i++) {

        
            for (var j = 0; j < urnik[i][dan].length; j++) {
                if (urnik[i][dan][j].includes(profesor)) {
                    console.log(urnik[i][dan][j])
                    urnik[i][dan][j] = "Prazno";
                }
            }
            //urnik[i].save();
            
        }
        
    }) 

    res.send("a")


   
    
}

var vnesiProf = (req, res) => {

    
    var dan = req.params.dan.toLowerCase()

    
    var query = UrnikProf.find({})
    var r = UrnikDijaka2.find({}).select({razred: 1, _id: 0});

    r.exec(function(err, abcd) {
        var razredi = [];
        for (var i = 0; i < abcd.length; i++) {
            razredi.push(abcd[i].razred.toLowerCase())
        }
        
        var a = [];
        var tabela = [];

        var tabela = new Array(razredi.length).fill("").map(() => new Array(7).fill(""));

        query.exec((err, v) => {

            

            for (var x = 0; x < razredi.length; x++) {
                for (var i = 0; i < v.length; i++) {
                    if (v[i][dan].includes(razredi[x])) {
                        a.push((v[i]["ime"] +","+ v[i][dan]).split(','))
                    }
                }
    
                var dolzina = a.length;
                
                
                for (var i = 0; i < dolzina; i++) {
                    for (var j = 0; j < a[i].length; j++) {
                        if (a[i][j].includes(razredi[x])) {
                            tabela[x][j-1] = a[i][0];
                        }
                    }
                }
            }

            var anton = 0;
            for (var i = 0; i < razredi.length; i++) {
                console.log(razredi[i])
                StalniUrnikDijaka.findOne({razred: razredi[i].toUpperCase()}).exec(function(err, rezultat) {
                    for (var j = 0; j < 7; j++) {
                        if (rezultat.sob[j] !== undefined) rezultat.sob[j] += "," + tabela[anton][j];
                        console.log(anton, " ", rezultat.pon[j], " ", tabela[anton][j])
                    }
                   anton++;
                   rezultat.save()
                }); 
                
            }
            
      
            res.send(tabela)


        })
            
     })
        
       
}



        

    



var urnikVsehRazredov = (req, res) => {
    
    UrnikDijaka2.find({}).select({'_id': 0}).exec(function(err, urnik) {
        res.send(urnik)
    })

}

var getUrnik = (req, res) => {
    var razred = req.params.razred;
    
    var query = UrnikDijaka2.findOne({razred: razred}).select({'_id': 0, '_v': 0});

    query.exec(function(err, rezultat) {
        res.send(rezultat)
    })
}

var getUrnikprof = (req, res) => {
    var profesor = req.params.razred;
    
    var query = UrnikProfesorja2.findOne({profesor: profesor}).select({'_id': 0, '_v': 0});

    query.exec(function(err, rezultat) {
        res.send(rezultat)
    })
}

module.exports = {
    mailDijaka,
    urnikDijaka,
    urnikProfesorja,
    vsiProfesorji,
    vsiRazredi,
    urnikProfesorjaNaDan,
    urnikDijaka2,
    prova,
    dodaj,
    izbrisiProfesorjaNaDan,
    vnesiProf,
    urnikVsehRazredov,
    getUrnik,
    getUrnikprof
}