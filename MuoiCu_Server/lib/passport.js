const {
    Strategy
} = require('passport-local')
const Account = require('../models/Account')
const Encrypt = require('./encryptPassword');
const TokenGenerator = require('./jwt');
const LocalStrategy = new Strategy({
    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: false,
    session: false
}, async function (Username, Password, done) {
    try {
        let account = await Account.findByUsername(Username);
        if (!account) {
            let error = new Error();
            error.name = 'NOTEXISTACCOUNT';
            error.message = `${Username} không tồn tại.`
            return done(error);
        }
        let compare = await Encrypt.compare(Password, account.password);
        if (!compare) {
            let error = new Error();
            error.name = 'NOTCORRECT';
            error.message = 'Mật khẩu không đúng';
            return done(error);
        }
        let payload = {
            account: account.username
        }
        const token = await TokenGenerator.sign(payload);
        return done(null, {
            token,
            role: account.chucvu
        })
    } catch (error) {
        let error1 = new Error();
        error1.name = 'NOTCORRECT';
        error1.message = error.message;
        return done(error1);
    }
})
module.exports = function (passport) {
    passport.serializeUser((user, cb) => {
        cb(null, user);
    })

    passport.deserializeUser((obj, cb) => {
        cb(null, obj);
    })

    passport.use("local", LocalStrategy);
}