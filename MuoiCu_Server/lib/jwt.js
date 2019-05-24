const jwt = require('jsonwebtoken');
const {
    token_generator: {
        secret_key,
        expires_in
    }
} = require('../config')

function TokenGenerator(secretKey, options) {
    this.secretKey = secretKey;
    this.options = options;
}

TokenGenerator.prototype.sign = function (payload) {
    return new Promise((resolve, reject) => {
        return jwt.sign(payload, this.secretKey, this.options, (err, token) => {
            if (err) return reject(err);
            return resolve(token);
        });
    })
}

TokenGenerator.prototype.verify = function (token) {
    return new Promise((resolve, reject) => {
        return jwt.verify(token, this.secretKey, (err, payload) => {
            if (err) return reject(err);
            return resolve(payload);
        })
    })
}

TokenGenerator.prototype.refreshtToken = function (token) {
    return new Promise((resolve, reject) => {
        return jwt.verify(token, this.secretKey, {
            ignoreExpiration: true
        }, (err, payload) => {
            if (err) return reject(err);
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;
            return jwt.sign({
                UserId: payload.UserId
            }, this.secretKey, this.options, (err, token) => {
                if (err) return reject(err);
                return resolve(token);
            })
        })
    })
}
const tokenGenerator = new TokenGenerator(secret_key, {
    expiresIn: expires_in
});
module.exports = tokenGenerator;