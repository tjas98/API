const express = require('express');
const router = express.Router();


var kontr = require('../controllers/controllers');
var spremembe = require('../controllers/spremembe')
var db = require('../controllers/db');
var podatki = require('../controllers/podatki')
var urnik = require('../controllers/urniki')

router.post('/urnik', kontr.urnikDijaka);
router.post('/baza', kontr.mailDijaka);
router.post('/urnikProf', kontr.urnikProfesorja);
router.post('/urnikNaDan', kontr.urnikProfesorjaNaDan)
router.post('/prova', kontr.prova)
router.post('/izbrisProfesorja', kontr.izbrisiProfesorjaNaDan);

router.get('/kopiraj', podatki.kopiraj)
router.get('/urnikVsehProf', podatki.urnikVsehProf)

router.post('/prikazi', spremembe.prikazi)

// Spremembe
// Get

router.get('/vseSpremembe', podatki.vseSpremembe);
router.get('/getSuplenti', podatki.getSuplenti);

router.get('/uredi/:dan', spremembe.urediBazo)
router.get('/ura/:dan/:j/:profesor', spremembe.najdiUro);


router.get('/zeUrnik', podatki.zeUrnik);
router.get('/ex', podatki.ex);
router.get('/ure', podatki.ure)

// Post
//router.post('/sprememba', spremembe.sprememba);
router.post('/izbrisiSpremembo', spremembe.izbrisiSpremembo)

router.post('/odsoten', spremembe.odsoten);
router.post('/spremembaProf', spremembe.spremembaUrnikaProfesorja)
router.post('/vrstniRed', spremembe.vrstniRed);
router.post('/nazaj', spremembe.nazaj);

router.post('/celodnevneDejavnosti', spremembe.celodnevneDejavnosti);
router.post('/zamenjavaUre', spremembe.zamenjavaDvehUr);
router.post('/odsoten2', spremembe.odsoten2);
router.post('/dejavnosti', spremembe.dejavnost);
router.post('/noviUrnik', spremembe.poskusNovegaUrnika);


router.post('/sprememba', spremembe.novaSprememba);
router.post('/dodanNeSprosti', spremembe.dodanNeSprosti);

router.post('/potrdi', spremembe.potrdi);
router.post('/PotrdiProsto', spremembe.potrdiProsto);
router.post('/spremembaProsto', spremembe.spremembaProsto);
router.post('/dodajProfesorja', spremembe.dodajProfesorja);

router.post('/nazajNaProsto', spremembe.nazajNaProsto)
router.post('/prostaUra', spremembe.prostaUra);
router.post('/nazajOdsoten', spremembe.nazajOdsoten);
router.post('/zamenjajPredmet', spremembe.zamenjajPredmet);

// Podatki
router.post('/dijak', podatki.dijak);
router.post('/razred', podatki.razred);
router.post('/dodajRazred', spremembe.dodajRazred)

router.get('/provetta', spremembe.provetta);
router.get('/admin/:mail', podatki.admin);

// GET
router.get('/urnikVsehRazredov', podatki.urnikVsehRazredov);
router.get('/urnik/dijaki/:razred', podatki.najdiUrnik)
router.get('/stalen', podatki.stalenUrnik);
router.get('/vsiProf', podatki.vsiProfesorji);
router.get('/urnikNaDan/:profesor/:dan', podatki.urnikProfesorjaNaDan)
router.get('/vsiRazredi', podatki.vsiRazredi);
router.get('/prosto/:dan', podatki.prosto);
router.get('/urnik/prof/:razred', podatki.getUrnikprof);
router.get('/urnikPriSpremembi/:razredi/:dan', podatki.urnikPriSpremembi)

router.get('/download', podatki.download);


router.get('/dodaj/:razred', kontr.dodaj);
router.get('/vnesi/:dan', kontr.vnesiProf)


router.get('/prova1/:array', (req, res) => {
    console.log(req.params)
})



router.get('/shraniUrnik', urnik.shraniUrnik)
router.get('/potrdiUrnik', urnik.potrdiUrnik)
router.get('/uporabljajPotrjenUrnik', urnik.uporabljajPotrjenUrnik)
router.get('/uporabljajShranjenUrnik', urnik.uporabljajShranjenUrnik)
router.get('/uporabljajStalenUrnik', urnik.uporabljajStalenUrnik)
router.get('/potrjen', urnik.potrjenUrnik)
router.get('/shranjen', urnik.shranjenUrnik)

router.post('/mail', urnik.vnesiMail)
router.post('/mailCopy', urnik.pridobiMaile)
router.post('/dva', spremembe.sprostiEnegaProfesorja)


router.get("/ip", (req, res) => {
    res.send({a: "DELA"})
})



module.exports = router;