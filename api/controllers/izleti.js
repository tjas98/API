const model = require("../models/models");
require('dotenv').config();

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;


// Celodnevne dejavnosti

var celodnevneDejavnosti = (req, res) => {
    var dnevi = req.body.dnevi;
    var razredi = req.body.razredi;
    var profesorji = req.body.profesorji;
    var dejavnost = req.body.dejavnost;

    if (!razredi) razredi = [];
    if (!profesorji) profesorji = [];

    var stDni = dnevi.length;

    var a = UrnikPredmeti.find({razred: razredi});
    var b = Profesorji.find({razred: razredi});
    var c = UrnikZaProfesorja.find({profesor: profesorji});

    var d = UrnikPredmeti.find({})
    var e = Profesorji.find({})
    var f = UrnikZaProfesorja.find({});

    Promise.all([a,b,c,d,e,f]).then((r) => {

        // Predmeti
        r[0].forEach(function(s) {
            for (var i = 0; i < stDni; i++) {
                var dan = dnevi[i].toLowerCase();
                for (var j = 0; j < s[dan].length; j++) s[dan][j] = dejavnost;
            }
            s.save();
        })

        // Profesorji
        r[1].forEach(function(s) {
            for (var i = 0; i < stDni; i++) {
                var dan = dnevi[i].toLowerCase();
                for (var j = 0; j < s[dan].length; j++) s[dan][j] = dejavnost;
            }
            s.save();
        })

        // Urnik profesorja
        r[2].forEach(function(s) {
            for (var i = 0; i < stDni; i++) {
                var dan = dnevi[i].toLowerCase();
                for (var j = 0; j < s[dan].length; j++) {
                    s[dan][j] = dejavnost;
                }
            }
            s.save();
        })

        var a = r[3].length;
        for (var i = 0; i < a; i++) {
            for (var d = 0; d < stDni; d++) {
                var dan = dnevi[d].toLowerCase();
                for (var j = 0; j < r[4][i][dan].length; j++) {
                    
                    if (r[4][i][dan][j].includes(',')) {
                        
                        
                    } else {
                        if (profesorji.includes(r[4][i][dan][j]) && !razredi.includes(r[3][i].razred)) {
                            r[4][i][dan][j] = 'Prosto';
                            r[3][i][dan][j] = 'Prosto';
                        }
                    }
                }
            }
            r[3][i].save();
            r[4][i].save();
        }

        var dolzina = r[5].length;
        for (var i = 0; i < dolzina; i++) {
            for (var d = 0; d < stDni; d++) {
                var dan = dnevi[d].toLowerCase();
                for (var j = 0; j < r[5][i][dan].length; j++) {
                    if (r[5][i][dan][j] != 'Prosto') {
                        var raz = r[5][i][dan][j].split(':')[0].toUpperCase();
                        if (razredi.includes(raz) && !profesorji.includes(r[5][i].profesor)) {
                            r[5][i][dan][j] = 'Prosto';
                        }
                    }
                }
            }
            r[5][i].save();
        }
        

        res.send({a: "OK"})  
    })
}

// Dejavnosti 
var dejavnost = (req, res) => {
    var dan = req.body.dan.toLowerCase();
    var razredi = req.body.razredi;
    var profesorji = req.body.profesorji;
    var dejavnost = req.body.dejavnost;
    var ure = [];
    ure = req.body.ure;

    if (!razredi) razredi = [];
    if (!profesorji) profesorji = [];


    var a = UrnikPredmeti.find({razred: razredi});
    var b = Profesorji.find({razred: razredi});
    var c = UrnikZaProfesorja.find({profesor: profesorji});

    var s1 = UrnikPredmeti.find({});
    var s2 = Profesorji.find({});
    var s3 = UrnikZaProfesorja.find({});

    Promise.all([a,b,c]).then(r => {
        r[0].forEach(function(s) {
            for (var i = 0; i < s[dan].length; i++) if (ure.includes(i+1)) s[dan][i] = dejavnost;
            s.save()
        })

        r[1].forEach(function(s) {
            for (var i = 0; i < s[dan].length; i++) if (ure.includes(i+1)) s[dan][i] = dejavnost;
            s.save()
        })

        r[2].forEach(function(s) {
            for (var i = 0; i < s[dan].length; i++) if (ure.includes(i+1)) s[dan][i] = dejavnost;
            s.save()
        })
    })

    Promise.all([s1,s2, s3]).then((r) => {
        for (var i = 0; i < r[0].length; i++) {
            for (var j = 0; j < r[0][i][dan].length; j++) {
                if (ure.includes(j+1) && profesorji.includes(r[1][i][dan][j]) && !razredi.includes(r[0][i].razred)) {
                    r[0][i][dan][j] = 'Prosto';
                    r[1][i][dan][j] = 'Prosto';
                }
            }
            r[0][i].save();
            r[1][i].save();
        }

        for (var i = 0; i < r[2].length; i++) {
            for (var j = 0; j < r[2][i][dan].length; j++) {
                if (r[2][i][dan][j] != 'Prosto') {
                    var raz = r[2][i][dan][j].split(':')[0].toUpperCase();
                    if (ure.includes(j+1) && razredi.includes(raz) && !profesorji.includes(r[2][i].profesor)) {
                        r[2][i][dan][j] = 'Prosto';
                    }
                }
            }
            r[2][i].save();
        }
        res.send({a: "OK"});
    })
}

module.exports = {
    celodnevneDejavnosti,
    dejavnost
}