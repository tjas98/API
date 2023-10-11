const mongoose = require('mongoose');


var DijakSchema = new mongoose.Schema({
    ime: String,
    priimek: String,
    mail: String,
    razred: String,
    slika: String
  }, {
      collection: 'dijaki'
});

// 0 - Navaden urnik

var UrnikPredmetiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '0 - Predmeti'
})

var ProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '0 - Profesorji'
})

var UrnikProfesorjaSchema = new mongoose.Schema({
    profesor: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '0 - Za_profesorja'
})

// 1 - Tedenski urnik

var StalenPredmetiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Teden_predmeti'
})

var StalenProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '1 - Teden_profesorji'
})



var StalenUrnikProfSchema = new mongoose.Schema({
    profesor: String,
    mail: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
  }, {
      versionKey: false,
      collection: "1 - Teden_za_profesorja"
});

var SpremembaSchema = new mongoose.Schema({
    tipSpremembe: String,
    }, {
        collection: 'spremembe',
        strict: false
    }
)

var suplentiSchema = new mongoose.Schema({
    profesor: String, 
    zamenjanProfesor: String
    }, {
        collection: 'suplenti'
})

var AdminsSchema = new mongoose.Schema({
    mail: String   
    }, {
        collection: 'admins'
})

var PodatkiUrnikaSchema = new mongoose.Schema({
    stUr: Number,
    ure: Array
}, {
    collection: 'podatki'
})

var UrnikStringSchema = new mongoose.Schema({
    profesor: String,
    pon: String,
    tor: String,
    sre: String,
    cet: String,
    pet: String,
    sob: String
})

// 2 - Potrjen urnik

var PrikazDijakiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, {
    collection: '2 - Potrjen_predmeti'
})

var PrikazProfesorjiSchema = new mongoose.Schema({
    profesor: String,
    mail: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, {
    collection: '2 - Potrjen_za_profesorja'
})

var PrikazProfSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '2 - Potrjen_profesorji'
})

// 3 - Shranjen urnik

var SpremembeDijakiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '3 - Shranjen_predmeti'
})

var SpremembeProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '3 - Shranjen_profeosrji'
})

var SpremembeZaProfesorjaSchema = new mongoose.Schema({
    profesor: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '3 - Shranjen_za_profesorja'
})

// 4 - Stalen urnik

var StalenStalenDijakiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '4 - Stalen_predmeti'
})

var StalenStalenProfesorjiSchema = new mongoose.Schema({
    razred: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '4 - Stalen_profesorji'
})

var StalenStalenZaProfesorjaSchema = new mongoose.Schema({
    profesor: String,
    pon: Array,
    tor: Array,
    sre: Array,
    cet: Array,
    pet: Array,
    sob: Array
}, 
{
    collection: '4 - Stalen_za_profesorja'
})

var PlacalSchema = new mongoose.Schema({
    mail: String

})

var MailSchema = new mongoose.Schema({
    profesor: String,
    mail: String
})

const Dijak = mongoose.model('dijak', DijakSchema);
const Mail = mongoose.model('mail', MailSchema)

// Stalni
const StalenPredmeti = mongoose.model('stalenPredmeti', StalenPredmetiSchema);
const StalenProfesorji = mongoose.model('stalenProfeosrji', StalenProfesorjiSchema);
const StalenZaProfesorja = mongoose.model('', StalenUrnikProfSchema);

// Spremenjljivi

const Sprememba = mongoose.model('spremembe', SpremembaSchema);

const Profesorji = mongoose.model('profesorji', ProfesorjiSchema);
const UrnikPredmeti = mongoose.model('predmeti', UrnikPredmetiSchema);
const UrnikZaProfesorja = mongoose.model('urnikDijaki', UrnikProfesorjaSchema);

const Suplenti = mongoose.model('suplenti', suplentiSchema);
const Admins = mongoose.model('admins', AdminsSchema)

const PodatkiUrnika = mongoose.model('podatki', PodatkiUrnikaSchema)

const UrnikString = mongoose.model('string', UrnikStringSchema);

const PrikazDijaki = mongoose.model('PrikazDijaki', PrikazDijakiSchema);
const PrikazProfesorji = mongoose.model('PrikazProfesorji', PrikazProfesorjiSchema)
const PrikazProf = mongoose.model("PrikazMode", PrikazProfSchema)

const SpremembeDijaki = mongoose.model('SpremembeDijaki', SpremembeDijakiSchema)
const SpremembeProfesorji = mongoose.model(' SpremembeProfesorji', SpremembeProfesorjiSchema)
const SpremembeZaProfesorja = mongoose.model('SpremembeZaProfesorja', SpremembeZaProfesorjaSchema)

const StalenStalenDijaki = mongoose.model('StalenStalenDijaki', StalenStalenDijakiSchema)
const StalenStalenProfeosorji = mongoose.model(' StalenStalenProfeosorji', StalenStalenProfesorjiSchema)
const StalenStalenZaProfesorja = mongoose.model('StalenStalenZaProfesorja', StalenStalenZaProfesorjaSchema)

const Placal = mongoose.model("Placal", PlacalSchema)

//var conn = mongoose.createConnection('mongodb+srv://urnik:UrnikPreseren@urnik.vpq0cxv.mongodb.net/test')
//var Database_dijaki    = conn.model('Dijaki', SpremembeDijakiSchema);
//var Database_prof   = conn.model('Prof', SpremembeProfesorjiSchema);
//var Database_za_profesorja    = conn.model('ZaProfesorja', SpremembeZaProfesorjaSchema);


module.exports = {
    Dijak,
    UrnikZaProfesorja,
    Profesorji,
    UrnikPredmeti,
    StalenPredmeti,
    StalenProfesorji,
    StalenZaProfesorja,
    Sprememba,
    Suplenti,
    Admins,
    PodatkiUrnika,
    UrnikString,
    PrikazProfesorji,
    PrikazDijaki,
    SpremembeDijaki,
    SpremembeProfesorji,
    SpremembeZaProfesorja,
    PrikazProf,
    Mail,
    StalenStalenDijaki,
    StalenStalenProfeosorji,
    StalenStalenZaProfesorja,
    Placal
    //Database_dijaki,
    //Database_prof,
    //Database_za_profesorja
}