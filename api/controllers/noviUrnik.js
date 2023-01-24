
const model = require("../models/models");
require('dotenv').config();

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

// Novi urnik
var noviUrnik = (req, res) => {
    var urnik = req.body.urnik;

    var urnik2 = req.body.urnik2

    var kateri = req.body.kateri
    console.log("KATERI:", kateri)
    

    var ure = [];

    for (var i = 1; i < urnik[1].length; i++) {
        if (urnik[1][i] == null) break
        ure.push(urnik[1][i])
    }

    console.log(ure)

    Podatki.remove({}, function(err, ok) {
        console.log(ok)
    })

    var p = new Podatki();
    p.stUr = ure.length;
    p.ure = ure;
    p.save()

    var razredi = [];
    var profesorji = [];

    for (var i = 2; i < urnik.length; i++)  {
        var profesor = urnik[i][0]
        if (profesor != undefined) profesorji.push(ime(profesor))
    }

    function ime(text) {
        const chars = {'č':'c','ž':'z','š':'s', 'Č':'C', 'Š':'S', 'Ž':'Z'};
        text = text.replace(/[čšžČŠŽ]/g, m => chars[m])
        return text
    }


    for (var i = 0; i < urnik2.length; i++) {
        var x = urnik2[i][0];
        if (x != null && x != "RAZRED" && x != undefined && x != "RAZ") razredi.push(x)
    }

    var urnikProfesorji = [];

    for (var i = 0; i < profesorji.length; i++) {
        var profesor = profesorji[i];
        urnikProfesorji[profesor] = {
            pon: ['Prosto','Prosto','Prosto','Prosto','Prosto','Prosto','Prosto'],
            tor: ['Prosto','Prosto','Prosto','Prosto','Prosto','Prosto','Prosto'],
            sre: ['Prosto','Prosto','Prosto','Prosto','Prosto','Prosto','Prosto'],
            cet: ['Prosto','Prosto','Prosto','Prosto','Prosto','Prosto','Prosto'],
            pet: ['Prosto','Prosto','Prosto','Prosto','Prosto','Prosto','Prosto']
        }
    }

    var urnikDijaki = []

    for (var i = 0; i < razredi.length; i++) {
        var razred = razredi[i];
        urnikDijaki[razred] = {
            pon: ['','','','','','',''],
            tor: ['','','','','','',''],
            sre: ['','','','','','',''],
            cet: ['','','','','','',''],
            pet: ['','','','','','','']
        }
    }

    
    for (var i = 2; i < urnik2.length; i++) {
        var a = []
        var razred = urnik2[i][0]

        if (razred == undefined) break
        for (var j = 0; j < urnik[i].length; j+=9) {
            var tab = urnik2[i].slice(j, j + 9)
            tab.shift()
            a.push(tab)
        }
        
        for (var j = 0; j < 7; j++) if (a[0][j] != null) urnikDijaki[razred]['pon'][j] = a[0][j].trim()
        for (var j = 0; j < 7; j++) if (a[1][j] != null) urnikDijaki[razred]['tor'][j] = a[1][j].trim()
        for (var j = 0; j < 7; j++) if (a[2][j] != null) urnikDijaki[razred]['sre'][j] = a[2][j].trim()
        for (var j = 0; j < 7; j++) if (a[3][j] != null) urnikDijaki[razred]['cet'][j] = a[3][j].trim()
        for (var j = 0; j < 7; j++) if (a[4][j] != null) urnikDijaki[razred]['pet'][j] = a[4][j].trim()


    }

    function preglej2(a) {
        if (a == "") return "Prosto"
        else return a
    }

    for (var i = 2; i < urnik.length; i++) {
       
        var a = []
        var profesor = urnik[i][0]

        if (profesor == undefined) break

        profesor = ime(profesor)

        if (profesor != undefined) {
            for (var j = 0; j < urnik[i].length; j+=9) {
                var tab = urnik[i].slice(j, j + 9)
                tab.shift()
                a.push(tab)
            }
            
            for (var j = 0; j < 7; j++) if (a[0][j] != null) urnikProfesorji[profesor]['pon'][j] = preglej2(a[0][j].trim())
            for (var j = 0; j < 7; j++) if (a[1][j] != null) urnikProfesorji[profesor]['tor'][j] = preglej2(a[1][j].trim())
            for (var j = 0; j < 7; j++) if (a[2][j] != null) urnikProfesorji[profesor]['sre'][j] = preglej2(a[2][j].trim())
            for (var j = 0; j < 7; j++) if (a[3][j] != null) urnikProfesorji[profesor]['cet'][j] = preglej2(a[3][j].trim())
            for (var j = 0; j < 7; j++) if (a[4][j] != null) urnikProfesorji[profesor]['pet'][j] = preglej2(a[4][j].trim())
        }
        
        
        
    }

    var urnikRazrediProfesorji = [];
    
    for (var i = 0; i < razredi.length; i++) {
        var razred = razredi[i];
        
        urnikRazrediProfesorji[razred] = {
            pon: ['','','','','','',''],
            tor: ['','','','','','',''],
            sre: ['','','','','','',''],
            cet: ['','','','','','',''],
            pet: ['','','','','','','']
        }
    }

    // urnikProfesorji.length
    
    // Urnik dijaki profesorji, naredi da jih je vec

   

    for (i in profesorji) {
        var profesor = profesorji[i]
        var urnik = urnikProfesorji[profesor]
        for (var j = 0; j < 7; j++) {
            var x = urnik['pon'][j]
            if (razredi.includes(x)) {
                var p = urnikRazrediProfesorji[x]['pon'][j].length

                if (p == 0)  urnikRazrediProfesorji[x]['pon'][j] = profesor;
                else urnikRazrediProfesorji[x]['pon'][j] += "," + profesor;

                
            }
            var x = urnik['tor'][j]
            if (razredi.includes(x)) {
                var p = urnikRazrediProfesorji[x]['tor'][j].length

                if (p == 0)  urnikRazrediProfesorji[x]['tor'][j] = profesor;
                else urnikRazrediProfesorji[x]['tor'][j] += "," + profesor;
                    
            }
            var x = urnik['sre'][j]
            if (razredi.includes(x)) {
                var p = urnikRazrediProfesorji[x]['sre'][j].length

                if (p == 0)  urnikRazrediProfesorji[x]['sre'][j] = profesor;
                else urnikRazrediProfesorji[x]['sre'][j] += "," + profesor;

               
            }
            var x = urnik['cet'][j]
            if (razredi.includes(x)) {
                var p = urnikRazrediProfesorji[x]['cet'][j].length

                if (p == 0)  urnikRazrediProfesorji[x]['cet'][j] = profesor;
                else urnikRazrediProfesorji[x]['cet'][j] += "," + profesor;

                
            }
            var x = urnik['pet'][j]
            if (razredi.includes(x)) {
                var p = urnikRazrediProfesorji[x]['pet'][j].length

                if (p == 0)  urnikRazrediProfesorji[x]['pet'][j] = profesor;
                else urnikRazrediProfesorji[x]['pet'][j] += "," + profesor;

               
            }
            
        }
    }

    
    for (var i = 0; i < profesorji.length; i++) {
        
        var a = urnikProfesorji[profesorji[i]]
        
        for (var j = 0; j < 7; j++) if (a['pon'][j] == " ") urnikProfesorji[profesorji[i]]['pon'][j] = 'Prosto';
        for (var j = 0; j < 7; j++) if (a['tor'][j] == " ") urnikProfesorji[profesorji[i]]['tor'][j] = 'Prosto';
        for (var j = 0; j < 7; j++) if (a['sre'][j] == " ") urnikProfesorji[profesorji[i]]['sre'][j] = 'Prosto';
        for (var j = 0; j < 7; j++) if (a['cet'][j] == " ") urnikProfesorji[profesorji[i]]['cet'][j] = 'Prosto';
        for (var j = 0; j < 7; j++) if (a['pet'][j] == " ") urnikProfesorji[profesorji[i]]['pet'][j] = 'Prosto';
       
    }

    database(profesorji, razredi, urnikProfesorji, urnikRazrediProfesorji, urnikDijaki)



    function database(profesorji, razredi, urnik1, urnik2, urnikDijaki) {
        Profesorji.remove({}, function(err, ok) {
            console.log(ok)
        });

        UrnikZaProfesorja.remove({}, function(err, ok) {
            console.log(ok)
        })

        UrnikPredmeti.remove({}, function(err, ok) {
            console.log(ok)
        });

        if (kateri == 1) {
            StalenPredmeti.remove({}, function(err, ok) {
                console.log(ok)
            });
    
            StalenProfesorji.remove({}, function(err, ok) {
                console.log(ok)
            });
    
            StalenZaProfesorja.remove({}, function(err, ok) {
                console.log(ok)
            })
        } 
        else if (kateri == 2) {
            PotrjenDijaki.remove({}, function(err, ok) {
                console.log(ok)
            });
    
            PotrjenProf.remove({}, function(err, ok) {
                console.log(ok)
            });
    
            PotrjenZaProfesorja.remove({}, function(err, ok) {
                console.log(ok)
            })
        }
        else {
            StalenStalenDijaki.remove({}, function(err, ok) {
                console.log(ok)
            });
    
            StalenStalenProf.remove({}, function(err, ok) {
                console.log(ok)
            });
    
            StalenStalenZaProfesorja.remove({}, function(err, ok) {
                console.log(ok)
            })
        }
        

        for (i in profesorji) {
            var profesor = profesorji[i];
            const ur = new UrnikZaProfesorja();
            ur.profesor = profesor
            
            ur.pon = urnik1[profesor]['pon']
            ur.tor = urnik1[profesor]['tor']
            ur.sre = urnik1[profesor]['sre']
            ur.cet = urnik1[profesor]['cet']
            ur.pet = urnik1[profesor]['pet']
            ur.save()

            if (kateri == 1) {
                var ur2 = new StalenZaProfesorja()
            }
            else if (kateri == 2)  {
                var ur2 = new PotrjenZaProfesorja()
            }
            else {
                var ur2 = new StalenStalenZaProfesorja
            }
           
            ur2.profesor = profesor
            ur2.pon = urnik1[profesor]['pon']
            ur2.tor = urnik1[profesor]['tor']
            ur2.sre = urnik1[profesor]['sre']
            ur2.cet = urnik1[profesor]['cet']
            ur2.pet = urnik1[profesor]['pet']
            ur2.save()

        }

    
        for (i in razredi) {
            var razred = razredi[i]

            const prof = new Profesorji();
            prof.razred = razred.toUpperCase();
            prof.pon = urnik2[razred]['pon']
            prof.tor = urnik2[razred]['tor']
            prof.sre = urnik2[razred]['sre']
            prof.cet = urnik2[razred]['cet']
            prof.pet = urnik2[razred]['pet']
            prof.save();

            if (kateri == 1) {var prof2 = new StalenProfesorji()}
            else if (kateri == 2) {var prof2 = new PotrjenProf()}
            else {var prof2 = new StalenStalenProf()}
            
            prof2.razred = razred.toUpperCase();
            prof2.pon = urnik2[razred]['pon']
            prof2.tor = urnik2[razred]['tor']
            prof2.sre = urnik2[razred]['sre']
            prof2.cet = urnik2[razred]['cet']
            prof2.pet = urnik2[razred]['pet']
            prof2.save();


            const ur = new UrnikPredmeti();
            ur.razred = razred.toUpperCase();
            ur.pon = urnikDijaki[razred]['pon']
            ur.tor = urnikDijaki[razred]['tor']
            ur.sre = urnikDijaki[razred]['sre']
            ur.cet = urnikDijaki[razred]['cet']
            ur.pet = urnikDijaki[razred]['pet']
            ur.save()

            if (kateri == 1) {var ur2 = new StalenPredmeti()}
            else if (kateri == 2) {var ur2 = new PotrjenDijaki()}
            else {var ur2 = new StalenStalenDijaki}
            ur2.razred = razred.toUpperCase();
            ur2.pon = urnikDijaki[razred]['pon']
            ur2.tor = urnikDijaki[razred]['tor']
            ur2.sre = urnikDijaki[razred]['sre']
            ur2.cet = urnikDijaki[razred]['cet']
            ur2.pet = urnikDijaki[razred]['pet']
            ur2.save()

        }

        console.log("OOOK")
    
    }

    res.send({a: "OK"})


    //console.log(urnikRazrediProfesorji)
}

// Mail
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



module.exports = {
    noviUrnik,
    vnesiMail
}