const express = require('express');
const router = express.Router();


var kontr = require('../controllers/controllers');
var spremembe = require('../controllers/spremembe')
var db = require('../controllers/db');
var podatki = require('../controllers/podatki')
var urnik = require('../controllers/urniki')
var izleti = require('../controllers/izleti')
var noviUrnik = require('../controllers/noviUrnik')
router.get('/ure', podatki.ure)

// Podatki zacetek

router.get('/vsiProf', podatki.vsiProfesorji);
router.get('/vsiRazredi', podatki.vsiRazredi);
router.get('/urnikVsehRazredov', podatki.urnikVsehRazredov);
router.get('/vseSpremembe', podatki.vseSpremembe);

// Sprememba urniki
router.get('/potrdiUrnik', urnik.potrdiUrnik)
router.get('/shraniUrnik', urnik.shraniUrnik)
router.get('/uporabljajPotrjenUrnik', urnik.uporabljajPotrjenUrnik)
router.get('/uporabljajShranjenUrnik', urnik.uporabljajShranjenUrnik)
router.get('/uporabljajStalenUrnik', urnik.uporabljajStalenUrnik)
router.get('/uporabljajTedenskiUrnik', urnik.uporabljajTedenskiUrnik)
router.get('/potrjen', urnik.potrjenUrnik)
router.get('/shranjen', urnik.shranjenUrnik)
router.get('/stalen', urnik.stalenUrnik);
router.get('/stalenStalen', urnik.stalenStalenUrnik);

// Sprememba mail
router.post('/mailCopy', urnik.pridobiMaile)

// Sprememba spremembe
router.post('/prostaUra', spremembe.prostaUra);
router.post('/zamenjajPredmet', spremembe.zamenjajPredmet);
router.post('/dodajRazred', spremembe.dodajRazred)
router.post('/zamenjavaUre', spremembe.zamenjavaDvehUr);
router.post('/odsoten2', spremembe.odsoten2);
router.post('/izbrisiSpremembo', spremembe.izbrisiSpremembo)
router.post('/PotrdiProsto', spremembe.potrdiProsto);
router.post('/spremembaProsto', spremembe.spremembaProsto);
router.post('/dva', spremembe.sprostiEnegaProfesorja)
router.post('/sprememba', spremembe.novaSprememba);
router.post('/dodanNeSprosti', spremembe.dodanNeSprosti);


// Izleti
router.post('/celodnevneDejavnosti', izleti.celodnevneDejavnosti);
router.post('/dejavnosti', izleti.dejavnost);

// Novi urnik
router.get('/zeUrnik', podatki.zeUrnik);
router.post('/mail', noviUrnik.vnesiMail)
router.post('/noviUrnik', noviUrnik.noviUrnik);
//router.post('/potrdi', spremembe.potrdi);









// Podatki
router.get('/provetta', spremembe.provetta);
router.get('/admin/:mail', podatki.admin);
router.get('/urnik/dijaki/:razred', podatki.najdiUrnik)
router.get('/urnikNaDan/:profesor/:dan', podatki.urnikProfesorjaNaDan)
router.get('/prosto/:dan', podatki.prosto);
router.get('/urnik/prof/:razred', podatki.getUrnikprof);
router.get('/urnikPriSpremembi/:razredi/:dan', podatki.urnikPriSpremembi)
// Urniki
// Spremembe
router.post('/urnik', kontr.urnikDijaka);
router.post('/baza', kontr.mailDijaka);
router.post('/urnikProf', kontr.urnikProfesorja);
router.post('/urnikNaDan', kontr.urnikProfesorjaNaDan)
router.post('/prova', kontr.prova)
router.post('/izbrisProfesorja', kontr.izbrisiProfesorjaNaDan);
router.get('/kopiraj', podatki.kopiraj)
router.get('/urnikVsehProf', podatki.urnikVsehProf)
router.post('/prikazi', spremembe.prikazi) // ----------------
// Spremembe
// Get
router.get('/getSuplenti', podatki.getSuplenti);
router.get('/uredi/:dan', spremembe.urediBazo)
router.get('/ura/:dan/:j/:profesor', spremembe.najdiUro);
// Post
//router.post('/sprememba', spremembe.sprememba);
router.post('/odsoten', spremembe.odsoten);
router.post('/spremembaProf', spremembe.spremembaUrnikaProfesorja)
router.post('/vrstniRed', spremembe.vrstniRed);
router.post('/nazaj', spremembe.nazaj);
router.post('/dodajProfesorja', spremembe.dodajProfesorja);
router.post('/nazajNaProsto', spremembe.nazajNaProsto)
router.post('/nazajOdsoten', spremembe.nazajOdsoten);
// Podatki
router.post('/dijak', podatki.dijak);
router.post('/razred', podatki.razred);
// GET
router.get('/download', podatki.download);
router.get('/dodaj/:razred', kontr.dodaj);
router.get('/vnesi/:dan', kontr.vnesiProf)
router.get('/prova1/:array', (req, res) => {
    console.log(req.params)
})



router.post("/placilo", podatki.placilo)
router.post("/jePlacal", podatki.jePlacal)








module.exports = router;