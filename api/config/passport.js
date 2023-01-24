const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy({
        callbackURL: 'http://localhost:4200/home',
        clientID: '314791559985-1umcmcn2letbsqn3ncvek2uptk6l6956.apps.googleusercontent.com',
        clientSecret: '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'
    }, () => {

    })
)