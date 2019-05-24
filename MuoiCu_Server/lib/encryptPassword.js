const {
    genSaltSync,
    hashSync,
    compare
} = require('bcrypt-nodejs');

class Encrypt {
    constructor(Password) {
        this.Password = Password
    }
    hash() {
        let salt = genSaltSync(10);
        let hash = hashSync(this.Password, salt);
        return hash;
    }
    static compare(password, hashPassword) {
        return new Promise((resolve, reject) => {
            compare(password, hashPassword, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            })
        })
    }
}



module.exports = Encrypt;