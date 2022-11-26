const model = require("../models/models");
require('dotenv').config();

const mongoose = require('mongoose');
const { urnikDijaka } = require("./controllers");
const url = "mongodb://localhost:27017";

const StalenProfesorji = model.StalenProfesorji;
const StalenPredmeti = model.StalenPredmeti;
const StalenZaProfesorja = model.StalenZaProfesorja;

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

const Sprememba = model.Sprememba;
const Podatki = model.PodatkiUrnika;

// Shranjen
const ShranjenDijaki = model.SpremembeDijaki
const ShranjenProf = model.SpremembeProfesorji
const ShranjenZaProfesorja = model.SpremembeZaProfesorja

// Potrjen
const PotrjenDijaki = model.PrikazDijaki
const PotrjenProf = model.PrikazProf
const PotrjenZaProfesorja = model.PrikazProfesorji

const Mail = model.Mail;

const Database_dijaki = model.Database_dijaki
const Database_prof = model.Database_prof
const Database_za_profesorja = model.Database_za_profesorja


// -------------------


function vrziVDatabase() {
    Database_dijaki.remove({}).then(function(err, r) {
        console.log("Removed")
        
        UrnikPredmeti.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new Database_dijaki();

                console.log(r.razred)
                
                a.razred = r.razred;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    Database_prof.remove({}).then(function(err, r) {
        console.log("Removed")

        Profesorji.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new Database_prof();

                console.log(r.razred)
                
                a.razred = r.razred;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    Database_za_profesorja.remove({}).then(function(err, r) {
        console.log("Removed")

        UrnikZaProfesorja.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new Database_za_profesorja();
                
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })
}





// -----------------


var shraniUrnik = (req, res) => {

    var a = ShranjenDijaki.remove({}).then(function(err, r) {
        console.log("Removed")

        UrnikPredmeti.find({}).then(function(rez) {
            rez.forEach(function(r) {
                var a = new ShranjenDijaki();
                
                a.razred = r.razred;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    var b = ShranjenProf.remove({}).then(function(err, r) {
        console.log("Removed")

        Profesorji.find({}).then(function(rez) {
            rez.forEach(function(r) {
                var a = new ShranjenProf();
                
                a.razred = r.razred;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    var c = ShranjenZaProfesorja.remove({}).then(function(err, r) {
        console.log("Removed")

        UrnikZaProfesorja.find({}).then(function(rez) {
            rez.forEach(function(r) {
                var a = new ShranjenZaProfesorja();
                
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    Promise.all([a,b,c]).then(() => {
        res.send({m: "A"})
    })

    
    
    
}

var potrdiUrnik = (req, res) => {
    
    var a = PotrjenDijaki.remove({}).then(function(err, r) {
        console.log("Removed")
        
        UrnikPredmeti.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new PotrjenDijaki();

                console.log(r.razred)
                
                a.razred = r.razred;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    var b = PotrjenProf.remove({}).then(function(err, r) {
        console.log("Removed")

        Profesorji.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new PotrjenProf();

                console.log(r.razred)
                
                a.razred = r.razred;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    var c = PotrjenZaProfesorja.remove({}).then(function(err, r) {
        console.log("Removed")

        UrnikZaProfesorja.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new PotrjenZaProfesorja();
                
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
    })

    Promise.all([a,b,c]).then((r) => {
        res.send({m: "OK"})
        //vrziVDatabase()
    })
}


var uporabljajShranjenUrnik = (req, res) => {

    var a = UrnikPredmeti.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var b = Profesorji.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var c = UrnikZaProfesorja.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    Promise.all([a,b,c]).then(() => {
        ShranjenDijaki.find({}).then(function(rez) {
            ShranjenProf.find({}).then(function(rez2) {
                
                for (var i = 0; i < rez.length; i++) {

                    var r = rez[i];
                    var razred = r.razred

                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                    

                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()

                    var b = new Profesorji();
                
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                    
                    b.save()
                }
            })
        }) 

        ShranjenZaProfesorja.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new UrnikZaProfesorja();
                
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })

        res.send({m: "OK"})
    })

            
        
    

   

        
    

   
}


var uporabljajStalenUrnik = (req, res) => {

    var a = UrnikPredmeti.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var b = Profesorji.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var c = UrnikZaProfesorja.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    Promise.all([a,b,c]).then(() => {
        StalenPredmeti.find({}).then(function(rez) {
            StalenProfesorji.find({}).then(function(rez2) {
                
                for (var i = 0; i < rez.length; i++) {

                    var r = rez[i];
                    var razred = r.razred

                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                    

                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()

                    var b = new Profesorji();
                
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                    
                    b.save()
                }
            })
        }) 
        StalenZaProfesorja.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new UrnikZaProfesorja();
                
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
        res.send({m: "OK"})
    })  
}

var uporabljajPotrjenUrnik = (req, res) => {

    var a = UrnikPredmeti.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var b = Profesorji.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var c = UrnikZaProfesorja.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    Promise.all([a,b,c]).then(() => {
        PotrjenDijaki.find({}).then(function(rez) {
            PotrjenProf.find({}).then(function(rez2) {
                
                for (var i = 0; i < rez.length; i++) {

                    var r = rez[i];
                    var razred = r.razred

                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                    

                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()

                    var b = new Profesorji();
                
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                    
                    b.save()
                }
            })
        }) 
        PotrjenZaProfesorja.find({}).then(function(rez) {

            rez.forEach(function(r) {
                var a = new UrnikZaProfesorja();
                
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                
                a.save()
            }) 
        })
        res.send({m: "OK"})
    })  
}

var vnesiMail = (req, res) => {
    var mails = req.body.mails;

    Mail.remove({}, function() {
        console.log("Mails removed")
    })

    mails.forEach(function(r) {
        console.log(r[0])
        if (r[0] != undefined) {
            var a = new Mail()
            a.profesor = r[0]
            a.mail = r[1]
            a.save()
        }
    })
}

var pridobiMaile = (req, res) => {
    var prof = req.body.profesorji;
    var razredi = req.body.razredi;

    var mails = "";

    if (razredi != undefined) {
        for (var i = 0; i < razredi.length; i++) {
            razredi[i] = razredi[i].toLowerCase() + "@preseren.edu.it"
            mails += razredi[i] + ','
        }
        mails = mails.slice(0,-1) 
        res.send({mails: mails})
    }
    
    if (prof != undefined) {
        Mail.find({profesor: prof}).then((rez) => {
            rez.forEach(function(r) {
                mails += r.mail + ','
            })
            mails = mails.slice(0,-1) 
            res.send({mails: mails})
        })
    }
   
}

var potrjenUrnik = (req, res) => {

    var query = PotrjenDijaki.find({}).select({'_id': 0});
    var query2 = PotrjenProf.find({}).select({'_id': 0});
    var query3 = PotrjenZaProfesorja.find({}).select({'_id': 0})

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


var shranjenUrnik = (req, res) => {
    var query = ShranjenDijaki.find({}).select({'_id': 0});
    var query2 = ShranjenProf.find({}).select({'_id': 0});
    var query3 = ShranjenZaProfesorja.find({}).select({'_id': 0})

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

module.exports = {
    shraniUrnik,
    potrdiUrnik,
    uporabljajPotrjenUrnik,
    uporabljajShranjenUrnik,
    uporabljajStalenUrnik,
    vnesiMail,
    pridobiMaile,
    potrjenUrnik,
    shranjenUrnik
}