
const model = require("../models/models");
require('dotenv').config();

const nodemailer = require('nodemailer');
const { urnikProfesorja } = require("./controllers");

const StalenProfesorji = model.StalenProfesorji;
const StalenPredmeti = model.StalenPredmeti;
const StalenZaProfesorja = model.StalenZaProfesorja;

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

const Sprememba = model.Sprememba;

const Suplenti = model.Suplenti;
const Podatki = model.PodatkiUrnika;

const PotrjenDijaki = model.PrikazDijaki
const PotrjenProf = model.PrikazProf
const PotrjenZaProfesorja = model.PrikazProfesorji

const StalenStalenDijaki = model.StalenStalenDijaki
const StalenStalenProf = model.StalenStalenProfeosorji
const StalenStalenZaProfesorja = model.StalenStalenZaProfesorja

// Prosta ura
var prostaUra = (req, res) => {
    var ura = req.body.ura;
    var dan = req.body.dan;
    var razred = req.body.razred;
    var profesor = req.body.profesor;

    var a = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = 'Prosto';
        r.save();
    })

    var b = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = 'Prosto';
        r.save();
    })

    var c = UrnikZaProfesorja.findOne({profesor: profesor}).then(function(r) {
        if (r) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
        
    })

    Promise.all([a,b,c]).then(() => {
        res.send({a: "OK"});
    })
}

// Zamenjaj predmet

var zamenjajPredmet = (req, res) => {
    var ura = req.body.ura;
    var dan = req.body.dan;
    var razred = req.body.razred;
    var profesor = req.body.profesor;
    var predmet = req.body.predmet;

    var a = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = predmet;
        r.save();
    })

    var c = UrnikZaProfesorja.findOne({profesor: profesor}).then(function(r) {
        r[dan][ura] = razred.toLowerCase() + ':'+ predmet;
        r.save();
    })

    Promise.all([a,c]).then(() => {
        res.send({a: "OK"});
    })
}

// Dodaj razred

var dodajRazred = (req, res) => {
    var ura = req.body.ura;
    var dan = req.body.dan;
    var razredi = req.body.razredi;
    var profesor = req.body.profesor;
    var predmet = req.body.predmet;

    console.log(razredi)

    var a = UrnikPredmeti.find({razred: razredi}).then(function(r) {
        r.forEach((s) => {
            s[dan][ura] = predmet;
            //s.save();
        })
    })

    var b = Profesorji.find({razred: razredi}).then(function(r) {
        r.forEach((s) => {
            s[dan][ura] = profesor;
            s.save();
        })
    })

    var c = UrnikZaProfesorja.findOne({profesor: profesor}).then(function(r) {
        r[dan][ura] = razredi[0];
        for (var i = 1; i < razredi.length; i++) {
            r[dan][ura] += ',' + razredi[i];
        }
        
        r.save();
    })

    Promise.all([a,b,c]).then(() => {
        res.send({a: 'OK'})
    })
}

// Zamenjava dveh ur

var zamenjavaDvehUr = async (req, res) => {

    console.log("ZAMENJAVA DVEH UR")

    var prva = req.body.prvaUra;
    var druga = req.body.drugaUra;
    var dan = req.body.dan;
    var nazaj = req.body.nazaj;
    var id = req.body.id;
    var dodatna = req.body.dodatnaSprememba;

    if (dodatna == 1) {
        var p = req.body.podatek;
        
        if (p.p1 != undefined) {
            var razred = p.ura1.toUpperCase();
            var a = UrnikPredmeti.findOne({razred: razred});
            var b = Profesorji.findOne({razred: razred});

            Promise.all([a,b]).then(r => {
                if (r[0] && r[1]) {
                    r[0][dan][druga.ura] = 'Prosto';
                    r[1][dan][druga.ura] = 'Prosto';
                    r[0].save();
                    r[1].save();
                }
                
            })
        }
        if (p.p2 != undefined) {
            var razred = p.ura2.toUpperCase();
            var a = UrnikPredmeti.findOne({razred: razred});
            var b = Profesorji.findOne({razred: razred});

            Promise.all([a,b]).then(r => {
                if (r[0] && r[1]) {
                    r[0][dan][prva.ura] = 'Prosto';
                    r[1][dan][prva.ura] = 'Prosto';
    
                    r[0].save();
                    r[1].save();
                }
            })
        }
    }


    if (id) {
        Sprememba.findByIdAndRemove(id, function(err, ok) {
            console.log(ok)
        })
    }

    if (prva.predmet == " ") prva.predmet = "Prosto";
    if (druga.predmet == " ") druga.predmet = "Prosto";

    if (prva.razred != druga.razred) {
        return 0;
    } else {
        var a = UrnikPredmeti.findOne({razred: prva.razred}).then(function(r) {
            r[dan][prva.ura] = druga.predmet;
            r[dan][druga.ura] = prva.predmet;
            r.save();
        })

        var b = Profesorji.findOne({razred: prva.razred}).then(function(r) {
            r[dan][prva.ura] = druga.prof;
            r[dan][druga.ura] = prva.prof;
            r.save();
        });

        if (prva.prof.includes(',')) {
            var vecProf = prva.prof.split(',');
            var c = UrnikZaProfesorja.find({profesor: vecProf}).then(function(r) {
                r.forEach((s) => {
                    s[dan][prva.ura] = 'Prosto';
                    s[dan][druga.ura] = druga.razred;
                    s.save();
                })
            })
        } else {
            var c = UrnikZaProfesorja.findOne({profesor: prva.prof}).then(function(r) {
                if (r) {
                    r[dan][prva.ura] = 'Prosto';
                    r[dan][druga.ura] = druga.razred;
                    r.save();
                }
            })
        }

        if (druga.prof.includes(',')) {
            var vecProf = druga.prof.split(',');
            var c = UrnikZaProfesorja.find({profesor: vecProf}).then(function(r) {
                r.forEach((s) => {
                    s[dan][druga.ura] = 'Prosto';
                    s[dan][prva.ura] = prva.razred;
                    s.save();
                })
            })
        } else {
            var d = UrnikZaProfesorja.findOne({profesor: druga.prof}).then(function(r) {
                if (r) {
                    r[dan][druga.ura] = 'Prosto';
                    r[dan][prva.ura] = prva.razred;
                    r.save();
                }
            })
        }
        
        

        Promise.all([a,b,c,d]).then(() => {
            if (nazaj != 1) {
                var s = new Sprememba({
                    prvaUra: prva,
                    drugaUra: druga,
                    dan: dan
                });
                s.tipSpremembe = 'Zamenjava dveh ur';
                s.save();
            }

            res.send({a: "Zamenjano"});
        })
    }
}

// Odsoten profesor

var odsoten2 = (req, res) => {
    var prof = req.body.profesor;
    var dan = req.body.dan;
    var razredi = req.body.razredi;

    console.log("SEM TLE")

    const s = new Sprememba({
        profesor: prof,
        urnikPredmeti: req.body.urnikPredmeti,
        urnikProfesorji: req.body.urnikProfesorja,
        dan: dan
    })
    s.tipSpremembe = 'Odsoten';
    s.save();

    var a = UrnikPredmeti.find({razred: razredi});
    var b = Profesorji.find({razred: razredi});
    var c = UrnikZaProfesorja.findOne({profesor: prof});

    Promise.all([a,b,c]).then((r) => {
        for (var i = 0; i < razredi.length; i++) {
            if (r[0][i]) {
                for (var j = 0; j < r[0][i][dan].length; j++) {
                    if (r[1][i][dan][j] == prof) {
                        r[1][i][dan][j] = 'Prosto';
                        r[0][i][dan][j] = 'Prosto';
                    }
                    if (r[1][i][dan][j].includes(',') && r[1][i][dan][j].includes(prof)) {
                        console.log("SEM TLE")
                        var rp = r[1][i][dan][j].replace(prof, '');
                        r[1][i][dan][j] = rp.replace(',', '');
                    } 
                }
                r[0][i].save();
                r[1][i].save();
            }
        }

        for (var i = 0; i < r[2][dan].length; i++) {
            r[2][dan][i] = 'Prosto';
        }
        r[2].save();

        

        res.send({a: "Profesor odsoten"});

    })
}

// Izbrisi spremembo

var izbrisiSpremembo = (req, res) => {
    var stalenUrnikProfesorji =  req.body.stalenUrnikProfesorji
    var stalenUrnikZaProfesorja = req.body.stalenUrnikZaProfesorja
    var stalenUrnikPredmeti = req.body.stalenUrnikPredmeti 
    var dan = req.body.dan;

    Sprememba.deleteMany({dan: dan}, function(err) {});

    var a = UrnikZaProfesorja.find({}).then(r => {
       
        for (var i in r) {
            var profesor = r[i].profesor
            const index = stalenUrnikZaProfesorja.map(e => e.profesor).indexOf(profesor);
            r[i][dan] = stalenUrnikZaProfesorja[index][dan]
            r[i].save()
            console.log(r[i])
        }
    })


    var b = UrnikPredmeti.find({}).then(r => {
      
        for (var i in r) {
            var razred = r[i].razred
            const index = stalenUrnikPredmeti.map(e => e.razred).indexOf(razred);

            r[i][dan] = stalenUrnikPredmeti[index][dan]

            r[i].save()
            console.log(r[i])
        }
    })

    var c = Profesorji.find({}).then(r => {
        for (var i in r) {
            var razred = r[i].razred
            const index = stalenUrnikPredmeti.map(e => e.razred).indexOf(razred);

            r[i][dan] = stalenUrnikProfesorji[index][dan]

            r[i].save()
            console.log(r[i])
        }
    })

    Promise.all([a,b,c]).then(() => {
        res.send({message: "Spremenjeno"})
    })
}

// Potrdi prosto uro

var potrdiProsto = async (req, res) => {
    var razred = req.body.razred;
    var dan = req.body.dan;
    var ura = req.body.ura;

    var a = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = 'prosto';
        r.save();
    })

    var b = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = 'prosto';
        r.save();
    })

    Promise.all([a,b]).then(function() {

        const s = new Sprememba({
            razred: razred,
            dan: dan,
            ura: ura
        })
        s.tipSpremembe = 'Potrdi prosto uro';
        s.save();

        res.send({a: "Spremenjeno"});
    })

   
}

// Sprememba na prosto

var spremembaProsto = (req, res) => {
    
    var profesor = req.body.profesor;
    var razred = req.body.razred;
    var razred2 = req.body.razred2;
    var ura = req.body.ura;
    var dan = req.body.dan;
    var predmet = req.body.predmet;

    if (profesor == undefined) profesor = "" 

    var s1 = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = predmet;
        r.save()
    })

    var s2 = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = profesor;
        r.save()
    })

    var s3 = UrnikZaProfesorja.findOne({profesor: profesor}).then(function(r) {
        if (r) {
            r[dan][ura] = razred;
            r.save()
        }
        
    })

    var s4 = UrnikPredmeti.findOne({razred: razred2}).then(function(r) {
        if (r) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    var s5 = Profesorji.findOne({razred: razred2}).then(function(r) {
        if (r) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    Promise.all([s1,s2,s3,s4,s5]).then(() => {

        const s = new Sprememba({
            dan: dan,
            ura: ura,
            profesor: profesor,
            razred: razred,
            sproscenRazred: razred2
        });
        s.tipSpremembe = 'Sprememba iz proste ure';
        console.log(s)
        s.save();

        res.send({a: "Spremenjeno"});
    })

}

// Sprosti enega profesorja

var sprostiEnegaProfesorja = (req, res) => {
    var ura = req.body.ura;
    var dan = req.body.dan;
    var razred = req.body.razred;
    var profesor = req.body.profPouk;
    var neProfesor = req.body.drugiProf;
    var predmet = req.body.predmet;
    console.log(req.body)

    var a = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = predmet;
        r.save();
    })

    var b = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = profesor;
        r.save();
    })

    var c = UrnikZaProfesorja.findOne({profesor: neProfesor}).then(function(r) {
        r[dan][ura] = 'Prosto';
        r.save();
    })


    Promise.all([a,b,c]).then(() => {
        res.send({a: "OK"});
    })
}

// Nova sprememba
var novaSprememba = (req, res) => {
    var profesor1 = req.body.profesor1;
    var profesor2 = req.body.profesor2;
    var razred = req.body.razred;
    var razred2 = req.body.razred2;
    var ura = req.body.ura;
    var dan = req.body.dan;
    var predmet = req.body.predmet;

    console.log(req.body);

    // Sprosti profesorja
    var s1 = UrnikZaProfesorja.findOne({profesor: profesor1}).then(function(r) {
        if (r && profesor1 != profesor2) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    // Zamenjaj predmet
    var s2 = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = predmet;
        r.save();
    })

    // Zamenjan profesorja
    var s3 = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = profesor2;
        r.save();
    })

    // Novi profesor
    var s4 = UrnikZaProfesorja.findOne({profesor: profesor2}).then(function(r) {
        r[dan][ura] = razred;
        r.save();
    })

    // Sprosti razred
    var s5 = UrnikPredmeti.findOne({razred: razred2}).then(function(r) {
        if (r && profesor1 != profesor2) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    var s6 = Profesorji.findOne({razred: razred2}).then(function(r) {
        if (r && profesor1 != profesor2) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    Promise.all([s1,s2,s3,s4,s5,s6]).then(() => {
        
        res.send({a: "OK"});
    })



}

// Dodan ne sprosti
var dodanNeSprosti = (req, res) => {
    var dan = req.body.dan;
    var ura = req.body.ura;
    var predmet = req.body.predmet;
    var razred = req.body.razred;
    var profesorji = req.body.profesorji;

    var stringProfesorji = "";

    var dolzina = profesorji.length;

    for (var i = 0; i < profesorji.length; i++) {
        stringProfesorji += profesorji[i];
        if (i != profesorji.length-1) stringProfesorji += ',';
    }

    var a = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = stringProfesorji;
        r.save();
    })

    var b = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = predmet;
        r.save();
    })

    Promise.all([a,b]).then(() => {
        res.send({a: "OK"});
    })

    
}


// --------------------------NE UPORABLJENI------------------------------------------

var urediBazo = (req, res) => {

    var dan = req.params.dan;
    

    UrnikPredmeti.find({}).exec(function(err, urnik) {
        for (var i = 0; i < urnik.length; i++) {
            for (var j = 0; j < 7; j++) {
                if (urnik[i][dan][j] != undefined) {
                    var a = urnik[i][dan][j].split(',')
                    urnik[i][dan][j] = a[0];
                }
            }
            //urnik[i].save();
        }
    })

    res.send("A")
}

function shraniSprememboPredmeti(s) {
    console.log(s)
    var a = new Sprememba();
    a.profesor = s.profesor;
    a.noviProfesor = s.noviProfesor;
    a.razred = s.razred;
    a.sproscenRazred = s.zamenjanRazred;
    a.dan = s.dan;
    a.ura = s.j;
    a.save();
}



var sprememba = (req, res) => {

    console.log(req.body)

    var profesor = req.body.profesor;
    var noviProfesor = req.body.noviProfesor;
    var predmet = req.body.predmet;
    var dan = req.body.dan;
    var razred = req.body.razred;
    var j = req.body.j;
    var i = req.body.i
    var zamenjanRazred = req.body.zamenjanRazred.toUpperCase();

    shraniSprememboPredmeti(req.body)

    // Novi predmet
    
    // Sprosti predmet
    if (zamenjanRazred != razred && razred != 'Prosta ura') {
        UrnikPredmeti.findOne({razred: zamenjanRazred}).exec(function(err, rezultat) {
            if (rezultat) {
                console.log("Zamenjan razred: ", zamenjanRazred)
                rezultat[dan][j] = "Prosto"
                rezultat.save()
            }
        })
    }
    
    // Novi profesor
    if (razred != 'Prosta ura') {
        Profesorji.findOne({razred: razred}).exec(function(err, rezultat) {
            if (rezultat) {
                console.log("Novi profesor: ", noviProfesor)
                rezultat[dan][j] = noviProfesor;
                rezultat.save();
            }
        })
    }
    

    // Sprosti profesorja
    if (zamenjanRazred.toUpperCase() != razred.toUpperCase()) {
        Profesorji.findOne({razred: zamenjanRazred}).exec(function(err, rezultat) {
            if (rezultat) {
                console.log("Sprosti profesorja: ", rezultat[dan][j])
                rezultat[dan][j] = "Prosto";
                rezultat.save();
            } 
        })
    }
    
    // Urnik profesorja
    if (profesor != noviProfesor) {
        UrnikZaProfesorja.findOne({profesor: profesor}).exec(function(err, rezultat) {
            if (rezultat) {
                console.log("Sproscen profesor: ", profesor)
                rezultat[dan][j] = "Prosto";
                rezultat.save()
            }
        })
    }
    
    // Urnik novega profesorja
    UrnikZaProfesorja.findOne({profesor: noviProfesor}).exec(function(err, rezultat) {
        if (rezultat) {
            rezultat[dan][j] = razred.toLowerCase() + ':' + predmet.toLowerCase();
            console.log("Novi urnik: ", noviProfesor, ": ", rezultat[dan][j])
            rezultat.save()
        }
        
    })

    UrnikPredmeti.findOne({razred: razred}).exec(function(err, rezultat) {
        if (rezultat) {
            console.log("Stari predmet: ", rezultat[dan][j], " Novi predmet: ", predmet)
            rezultat[dan][j] = predmet;
            rezultat.save();
        }
        
        res.send({
            dan: dan,
            predmet: rezultat[dan][j],
            zamenjanRazred: razred,
            razred: zamenjanRazred,
            profesor: noviProfesor,
            noviProfesor: profesor,
            i: i,
            j: j
        })
    })
    
}

var najdiUro = (req, res) => {

    var profesor = req.params.profesor;
    var dan = req.params.dan;
    var j = req.params.j;

    console.log(profesor, dan, j)
    
    UrnikZaProfesorja.findOne({profesor: profesor}).exec(function(err, rezultat) {
        console.log(rezultat[dan][j])
        if (rezultat[dan][j] != undefined) {
            var a = rezultat[dan][j].split(':')
            
            if (a.length < 2) {
                res.send({predmet: "Prosta ura"})
            }
            
            else {
                res.send({
                    razred: a[0],
                    predmet: a[1]
                })
            }
        } else {
            res.send({predmet: "Prosta ura"})
        }
    })
}

function sprostiRazrede(s) {
    var a = new Sprememba();
    a.profesor = s.profesor;
    a.noviProfesor = s.profesor;
    a.razred = s.razredi.toString();
    a.sproscenRazred = s.razredi.toString();
    a.dan = s.dan;
    a.ura = 100;
    a.save();
}

var odsoten = async (req, res) => {
    var profesor = req.body.profesor;
    var dan = req.body.dan;
    var razredi = req.body.razredi;
    var indeksi = req.body.indeksi;

    /*

    await UrnikZaProfesorja.findOne({profesor: profesor}).exec(function(err, rezultat) {
        for (var i = 0; i < rezultat[dan].length; i++) {
            rezultat[dan][i] = "Prosto";  
        }
        rezultat.save();
    })

    await Profesorji.find({razred: razredi}).exec(function(err, rezultat) {
        rezultat.forEach(function(r, i) {
            var j = indeksi[i];
            r[dan][j] = 'Prosto'
            r.save()
        })
    })

    await UrnikPredmeti.find({razred: razredi}).exec(function(err, rezultat) {
        rezultat.forEach(function(r, i) {
            var j = indeksi[i];
            r[dan][j] = 'Prosto'
            r.save()
        })
    })

    await sprostiRazrede(req.body);
    */
    res.send({a: "Spremenjeno"})
}



function shraniSprememboProf(s) {
    console.log(s)
    var a = new Sprememba();
    a.profesor = s.profesor;
    a.noviProfesor = s.sproscenProfesor;
    a.razred = s.noviRazred;
    a.sproscenRazred = s.sproscenRazred;
    a.dan = s.dan;
    a.ura = s.ura;
    a.save();
}

var spremembaUrnikaProfesorja = (req, res) => {
    
    var profesor = req.body.profesor;
    var noviRazred = req.body.noviRazred;
    var sproscenRazred = req.body.sproscenRazred;
    var ura = req.body.ura;
    var dan = req.body.dan;
    var predmet = req.body.predmet;
    var sproscenProfesor = req.body.sproscenProfesor;

    shraniSprememboProf(req.body)

    // Zamenjan urnik profesorja
    UrnikZaProfesorja.findOne({profesor: profesor}).exec(function(err, rezultat) {
        if (rezultat) {
            rezultat[dan][ura] = noviRazred + ':' + predmet;
            rezultat.save();
        }
    })

    // Zamenjaj urnik predmetov
    UrnikPredmeti.findOne({razred: noviRazred}).exec(function(err, rezultat) {
        if (rezultat) {
            rezultat[dan][ura] = predmet;
            rezultat.save();
        }
    })

    // Zamenjaj urnik profesorjev
    Profesorji.findOne({razred: noviRazred}).exec(function(err, rezultat) {
        if (rezultat) {
            rezultat[dan][ura] = profesor;
            rezultat.save();
        }
    })

    // Sprosti zamenjan razred
    UrnikPredmeti.findOne({razred: sproscenRazred}).exec(function(err, rezultat) {
        if (rezultat) {
            rezultat[dan][ura] = 'Prosto';
            rezultat.save();
        }
    })

    if (sproscenProfesor != profesor) {
        // Sprosti zamenjanega profesorja
            
        UrnikZaProfesorja.findOne({profesor: sproscenProfesor}).exec(function(err, rezultat) {
            if (rezultat) {
                rezultat[dan][ura] = 'Prosto';
                rezultat.save();
            }
        })
    }
    // Sprosti profesorja zamenjanega razreda
    Profesorji.findOne({razred: sproscenRazred}).exec(function(err, rezultat) {
        if (rezultat) {
            rezultat[dan][ura] = 'Prosto';
            rezultat.save();
        }
        
    })

    

    res.send({a: "anton"})
}


var vrstniRed = (req, res) => {
    
    console.log("VRSTNI RED")
    
    var dan = req.body.dan.toLowerCase();
    var prvi =  req.body.prvi;
    var drugi =  req.body.drugi;
    var razredi = req.body.razredi;

    // Zamenjaj predmet
    UrnikPredmeti.find({razred: razredi}).exec(function(err, rezultat) {
        
        var i1 = rezultat.findIndex(x => x.razred == razredi[prvi[0]])
        var i2 = rezultat.findIndex(x => x.razred == razredi[drugi[0]])
        
        var a = rezultat[i1][dan][prvi[1]]
        var b = rezultat[i2][dan][drugi[1]]

        rezultat[prvi[0]][dan][prvi[1]] = b;
        rezultat[drugi[0]][dan][drugi[1]] = a;

        rezultat[prvi[0]].save();
        rezultat[drugi[0]].save();

        console.log(a, ' -> ', rezultat[prvi[0]][dan][prvi[1]])
        console.log(b, ' -> ', rezultat[drugi[0]][dan][drugi[1]])
        
        var predmeti = [a,b];

        Profesorji.find({razred: razredi}).exec(function(err, rezultat) {
            var a = rezultat[i1][dan][prvi[1]]
            var b = rezultat[i2][dan][drugi[1]]

            rezultat[prvi[0]][dan][prvi[1]] = b;
            rezultat[drugi[0]][dan][drugi[1]] = a;

            rezultat[prvi[0]].save();
            rezultat[drugi[0]].save();

            console.log(a, ' -> ', rezultat[prvi[0]][dan][prvi[1]])
            console.log(b, ' -> ', rezultat[drugi[0]][dan][drugi[1]])
        
            var profesorji = [a,b];

            if (a != b) {
                UrnikZaProfesorja.find({profesor: profesorji}).exec(function(err, rezultat) {

                    var a = rezultat[0][dan][prvi[1]].split(':')
                    var b = rezultat[1][dan][drugi[1]].split(':')

                    rezultat[0][dan][prvi[1]] = b[0] + ':' + a[1];
                    rezultat[1][dan][drugi[1]] = a[0] + ':' + b[1];

                    rezultat[0].save();
                    rezultat[1].save();
                    
                })
            }
            else {
                UrnikZaProfesorja.find({profesor: profesorji}).exec(function(err, rezultat) {
                    var a = rezultat[0][dan][prvi]
                   
                })
            }
        })
    })


    res.send({a: "a"})
}



var nazaj = (req, res) => {
    console.log(req.body);

    var ura = req.body.ura;
    var dan = req.body.dan;

    if (req.body.sproscenRazred != 'Prosta ura') {
        UrnikPredmeti.findOne({razred: req.body.sproscenRazred.toUpperCase()}).exec(function(err, r) {
            StalenPredmeti.findOne({razred: req.body.sproscenRazred.toUpperCase()}).exec(function(err, r2) {
                if (r) {
                    console.log('1: ', r[dan][ura], r2[dan][ura])
                    r[dan][ura] = r2[dan][ura];
                    r.save();
                }
            })
        })
    
        Profesorji.findOne({razred: req.body.sproscenRazred.toUpperCase()}).exec(function(err, r) {
            StalenProfesorji.findOne({razred: req.body.sproscenRazred.toUpperCase()}).exec(function(err, r2) {
                if (r) {
                    console.log('2: ', r[dan][ura], r2[dan][ura])
                    r[dan][ura] = r2[dan][ura];
                    r.save();
                }
            })
        })
    }

    // Predmeti

    UrnikPredmeti.findOne({razred: req.body.razred}).exec(function(err, r) {
        StalenPredmeti.findOne({razred: req.body.razred}).exec(function(err, r2) {
            if (r) { 
                console.log('1: ', r[dan][ura], r2[dan][ura])
                r[dan][ura] = r2[dan][ura];
                r.save();
            }
        })
    })

    // Profesorji

    Profesorji.findOne({razred: req.body.razred}).exec(function(err, r) {
        StalenProfesorji.findOne({razred: req.body.razred}).exec(function(err, r2) {
            if (r) {
                console.log('2: ', r[dan][ura], r2[dan][ura])
                r[dan][ura] = r2[dan][ura];
                r.save();
            }
        })
    })

    // Urnik profesorja

    UrnikZaProfesorja.findOne({profesor: req.body.profesor}).exec(function(err, r) {
        StalenZaProfesorja.findOne({profesor: req.body.profesor}).exec(function(err, r2) {
            if (r) {
                console.log('3: ', r[dan][ura], r2[dan][ura])
                r[dan][ura] = r2[dan][ura];
                r.save();
            }
        })
    })

    UrnikZaProfesorja.findOne({profesor: req.body.noviProfesor}).exec(function(err, r) {
        StalenZaProfesorja.findOne({profesor: req.body.noviProfesor}).exec(function(err, r2) {
            if (r) {
                console.log('3: ', r[dan][ura], r2[dan][ura])
                r[dan][ura] = r2[dan][ura];
                r.save();
            }
        })
    })

    console.log(req.body.id)

    Sprememba.deleteOne({_id: req.body._id}, function(err) {
        if (err) console.log(err)
        else {
            res.send({m: "Spremenjeno"})
        }
    })

}


var mail = (req, res) => {

    var razredi = req.body.razredi;
    var profesorji = req.body.profesorji;
    var dan = req.body.dan;

    var htmlZaRazred = "";

    var html = '<table style="border: 1px solid black; text-align: center" >'

    html += '<tr><th>Razred</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>'

    UrnikPredmeti.find({razred: razredi}).exec(async function(err, r) {
        for (var i = 0; i < r.length; i++) {
            html += '<tr style="border: 1px solid black" >'
            html += `<th style="border: 1px solid black; padding: 5px; width: 5%">${r[i]['razred']}</th>`
            for (var j = 0; j < 7; j++) {
                if (r[i][dan][j] != undefined) html += `<td style="border: 1px solid black; padding: 5px; width: 5%">${r[i][dan][j]}</td>`
                else html += '<td style="border: 1px solid black; padding: 5px; width: 5%">' + '&nbsp;' + '</td>'
            }
        }

        htmlZaRazred = html;

        html += '</table> <br> <br> <table style="border: 1px solid black; text-align: center">'

        html += '<tr><th>Profesor</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>'

        

        UrnikZaProfesorja.find({profesor: profesorji}).exec(async function(err, r) {
            for (var i = 0; i < r.length; i++) {
                html += '<tr style="border: 1px solid black" >'
                html += `<th style="border: 1px solid black; padding: 5px; width: 5%">${r[i]['profesor']}</th>`
                for (var j = 0; j < 7; j++) {
                    if (r[i][dan][j] != undefined) html += `<td style="border: 1px solid black; padding: 5px; width: 5%">${r[i][dan][j].split(':')[0]}</td>`
                    //if (r[i]['pon'][j] == 'Prosto') html += `<td style="border: 1px solid black; padding: 5px; width: 5%">&nbsp;</td>`
                    else html += '<td style="border: 1px solid black; padding: 5px">' + '&nbsp;' + '</td>'
                }
            }

            html += '</table>'

            main(html, htmlZaRazred)
        })

       
    })



    async function main(html, htmlZaRazred) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'tjas.leghissa@preseren.edu.it',// generated ethereal user
            pass: process.env.PASSWORD_MAIL, // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        
        let prof = await transporter.sendMail({
          from: 'tjas.leghissa@preseren.edu.it', // sender address
          to: "t.leghissa@gmail.com", // list of receivers
          subject: "Sprememba urnika za " + dan, // Subject line
          text: "", // plain text body
          html: html, // html body
        });

        let razredi = await transporter.sendMail({
            from: 'tjas.leghissa@preseren.edu.it', // sender address
            to: "dorjanajurincic@gmail.com", // list of receivers
            subject: "Sprememba urnika "  + dan, // Subject line
            text: "", // plain text body
            html: htmlZaRazred, // html body
          });
        
      
       
        res.send("OK")
      }
}

var provetta = (req, res) => {

    var a = Sprememba.find({});

    var b = UrnikPredmeti.find({});
    var c = UrnikZaProfesorja.find({});

    Promise.all([a,b,c]).then((r) => {
        
        

        var ur = r[0][0]['urnikPredmeti']
        var ur2 = r[0][0]['']

       

        for (var i = 0; i < r[1].length; i++) {
            r[1][i]['pon'] = ur[i]['pon'];
            r[1][i]['tor'] = ur[i]['tor'];
            r[1][i]['sre'] = ur[i]['sre'];
            r[1][i]['cet'] = ur[i]['cet'];
            r[1][i]['pet'] = ur[i]['pet'];
            r[1][i]['sob'] = ur[i]['sob'];
            r[1][i].save();
        }

      
       
    })
}


// Potrdi
/*
var potrdi = (req, res) => {
    var urnikProf = req.body.profesorji;
    var urnikPredmeti = req.body.urnikPredmeti;
    var razredi = req.body.razredi;
    var urnik = req.body.urnikProf;

    console.log(urnik)

    UrnikPredmeti.remove({}, function(err, ok) {
        console.log(ok)
    });

    Profesorji.remove({}, function(err, ok) {
        console.log(ok)
    });

    StalenPredmeti.remove({}, function(err, ok) {
        console.log(ok)
    });

    StalenProfesorji.remove({}, function(err, ok) {
        console.log(ok)
    });

    UrnikZaProfesorja.remove({}, function(err, ok) {
        console.log(ok)
    })

    StalenZaProfesorja.remove({}, function(err, ok) {
        console.log(ok)
    })

    for (var i = 0; i < urnik.length; i++) {
       
        const ur = new UrnikZaProfesorja();

        var dni = ['pon', 'tor', 'sre', 'cet', 'pet', 'sob'];

        for (var d = 0; d < dni.length; d++) {
            var u = urnik[i][dni[d]]
            for (var j = 0; j < u.length; j++) {
                if (u[j] == ' ' || u[j] == '') urnik[i][dni[d]][j] = 'Prosto';
            }
        }
        
        var profesor = urnik[i].ime;
        console.log(profesor)
        ur.profesor = profesor;
        ur.pon = urnik[i]['pon']
        ur.tor = urnik[i]['tor']
        ur.sre = urnik[i]['sre']
        ur.cet = urnik[i]['cet']
        ur.pet = urnik[i]['pet']
        ur.sob = urnik[i]['sob']
        ur.save();

        const ur2 = new StalenZaProfesorja();
        ur2.profesor = profesor;
        ur2.mail = urnik[i].mail;
        ur2.pon = urnik[i]['pon']
        ur2.tor = urnik[i]['tor']
        ur2.sre = urnik[i]['sre']
        ur2.cet = urnik[i]['cet']
        ur2.pet = urnik[i]['pet']
        ur2.sob = urnik[i]['sob']
        ur2.save();
    }

   
    for (var i = 0; i < razredi.length; i++) {
        var razred = razredi[i];
        
        const urnik = new UrnikPredmeti();
        console.log(razred)

        urnik.razred = razred;
        urnik.pon = urnikPredmeti[razred]['pon']
        urnik.tor = urnikPredmeti[razred]['tor']
        urnik.sre = urnikPredmeti[razred]['sre']
        urnik.cet = urnikPredmeti[razred]['cet']
        urnik.pet = urnikPredmeti[razred]['pet']
        urnik.sob = urnikPredmeti[razred]['sob']
        urnik.save();

        const prof = new Profesorji();
        prof.razred = razred;
        prof.pon = urnikProf[razred]['pon']
        prof.tor = urnikProf[razred]['tor']
        prof.sre = urnikProf[razred]['sre']
        prof.cet = urnikProf[razred]['cet']
        prof.pet = urnikProf[razred]['pet']
        prof.sob = urnikProf[razred]['sob']
        prof.save();

        const urnik2 = new StalenPredmeti();
        
        urnik2.razred = razred;
        urnik2.pon = urnikPredmeti[razred]['pon']
        urnik2.tor = urnikPredmeti[razred]['tor']
        urnik2.sre = urnikPredmeti[razred]['sre']
        urnik2.cet = urnikPredmeti[razred]['cet']
        urnik2.pet = urnikPredmeti[razred]['pet']
        urnik2.sob = urnikPredmeti[razred]['sob']
        urnik2.save();

        const prof2 = new StalenProfesorji();
        prof2.razred = razred;
        prof2.pon = urnikProf[razred]['pon']
        prof2.tor = urnikProf[razred]['tor']
        prof2.sre = urnikProf[razred]['sre']
        prof2.cet = urnikProf[razred]['cet']
        prof2.pet = urnikProf[razred]['pet']
        prof2.sob = urnikProf[razred]['sob']
        prof2.save();


    }

    var pod = new Podatki();

    pod.stUr = 5;
    pod.save();

    res.send({a: "OK"})

}
*/

var nazajNaProsto = (req, res) => {
    var razred = req.body.razred;
    var ura = req.body.ura;
    var dan = req.body.dan;
    var id = req.body.id;

    Sprememba.findByIdAndRemove(id, function(){});

    var a = UrnikPredmeti.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = 'Prosto';
        r.save();
    })

    var b = Profesorji.findOne({razred: razred}).then(function(r) {
        r[dan][ura] = 'Prosto';
        r.save();
    })

    Promise.all([a,b]).then(() => {
        res.send({m: "OK"});
    })
}


var dodajProfesorja = (req, res) => {
    var noviProfesor = req.body.noviProfesor;
    var zamenjanProfesor = req.body.zamenjanProfesor;

    console.log(req.body)

    const sup = new Suplenti();
    sup.profesor = noviProfesor;
    sup.zamenjanProfesor = zamenjanProfesor;
    sup.save();

    var b = StalenZaProfesorja.findOne({profesor: zamenjanProfesor}).then(function(r) {
        const novi = new UrnikZaProfesorja();
        novi.profesor = noviProfesor;
        novi.pon = r.pon;
        novi.tor = r.tor;
        novi.sre = r.sre;
        novi.cet = r.cet;
        novi.pet = r.pet;
        novi.sob = r.sob;
        novi.save();

        const novi2 = new StalenZaProfesorja();
        novi2.profesor = noviProfesor;
        novi2.pon = r.pon;
        novi2.tor = r.tor;
        novi2.sre = r.sre;
        novi2.cet = r.cet;
        novi2.pet = r.pet;
        novi2.sob = r.sob;
        novi2.save();
    });

   Promise.all([b]).then(() => {
       res.send({a: "DODAN"});
   })
}


var nazajOdsoten = (req, res) => {
    var profesor = req.body.profesor;
    var dan = req.body.dan;
    var id = req.body.id;

    Sprememba.findByIdAndRemove(id, function(){});

    var s1 = UrnikZaProfesorja.findOne({profesor: profesor});
    var s2 = StalenZaProfesorja.findOne({profesor: profesor});

    var s3 = StalenProfesorji.find({});
    var s4 = StalenPredmeti.find({});

    var s5 = Profesorji.find({});
    var s6 = UrnikPredmeti.find({});

    Promise.all([s1,s2,s3,s4,s5,s6]).then(r => {
        r[0][dan] = r[1][dan];
        r[0].save();

        for (var i = 0; i < r[2].length; i++) {
            for (var j = 0; j < r[2][i][dan].length; j++) {
                if (r[2][i][dan][j].includes(profesor)) {
                    r[4][i][dan][j] = r[2][i][dan][j];
                    r[5][i][dan][j] = r[3][i][dan][j];
                }
            }
            r[4][i].save();
            r[5][i].save();
        }
        res.send({a: "SKDKSMD"});
    })
}

var prikazi = (req, res) => {
    var urnikDijaki = req.body.urnikDijaki;
    var urnikProf = req.body.urnikProf;
    var dan = req.body.dan.toLowerCase();
    

    var a = model.PrikazProfesorji.find({}).then(r => {
       
        for (var i in r) {
            var profesor = r[i].profesor
            const index = urnikProf.map(e => e.profesor).indexOf(profesor);
            r[i][dan] = urnikProf[index][dan]
            r[i].save()
            console.log(r[i])
        }
    })


    var b = model.PrikazDijaki.find({}).then(r => {
      
        for (var i in r) {
            var razred = r[i].razred
            const index = urnikDijaki.map(e => e.razred).indexOf(razred);
            console.log(razred)
            r[i][dan] = urnikDijaki[index][dan]

            r[i].save()
            console.log(r[i])
        }
    })

    Promise.all([a,b]).then(() => {
        res.send({message: "Spremenjeno"})
    })
}



module.exports = {
    urediBazo,
    sprememba,
    najdiUro,
    odsoten,
    izbrisiSpremembo,
    spremembaUrnikaProfesorja,
    vrstniRed,
    nazaj,
    mail,
    zamenjavaDvehUr,
    odsoten2,
    potrdiProsto,
    spremembaProsto,
    nazajNaProsto, 
    novaSprememba,
    dodanNeSprosti,
    dodajProfesorja,
    prostaUra,
    nazajOdsoten,
    zamenjajPredmet,
    provetta,
    dodajRazred,
    prikazi,
    sprostiEnegaProfesorja
}