const query = require('../lib/db')
const Encrypt = require('../lib/encryptPassword');

class Account {
    constructor(Username, Password, Chucvu, Ten) {
        this.Username = Username;
        this.Password = Password;
        this.Chucvu = Chucvu;
        this.Ten = Ten;
    }
    async save(params) {
        if (!this.Username || !this.Password || !this.Chucvu || !this.Ten) {
            let error = new Error();
            error.name = 'MISSINGDATA';
            error.name = 'Thiếu thông tin để tạo tài khoản.';
            throw error;
        }
        try {
            let HashPassword = new Encrypt(this.Password);
            let sql;
            sql = `INSERT INTO taikhoan (username, password, chucvu)values ('${this.Username}', '${HashPassword.hash()}', '${this.Chucvu}')`;
            await query(sql);
            sql = `INSERT INTO nhanvien (ten, taikhoan) values('${this.Ten}', '${this.Username}')`;
            await query(sql);
        } catch (error) {
            throw error;
        }
    }
    static async findByUsername(Username) {
        if (!Username)
            return null;
        let sql = `SELECT * FROM nhanvien where username='${Username}'`;
        let res = await query(sql);
        if (res) return res[0];
        return null;
    }

    static getNameTable() {
        return "taikhoan";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['username', 'password', 'chucvu'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`username`,`password`,`chucvu`";
    }
    static getSelect(tb) {
        return `${tb}.username,${tb}.chucvu`;
    }
    static getKey() {
        return `username`;
    }
    static getParam(param) {
        let tmp = ['username', 'password', 'chucvu'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['username', 'password', 'chucvu'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static getLike(k) {
        let tmp = ['username', 'password', 'chucvu'];
        return tmp.includes(k);
    }
    static getForgenKey() {
        return "taikhoan";
    }
}

module.exports = Account;