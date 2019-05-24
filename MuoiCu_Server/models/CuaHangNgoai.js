const query = require('../lib/db')

class Salary {
    static getNameTable() {
        return "cuahangngoai";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['tenphutung', 'nhacungcap','dongia','ghichu'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`tenphutung`, `nhacungcap`,`dongia`,`ghichu`";
    }
    static getLike(k) {
        let tmp = ['tenphutung'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }
}

module.exports = Salary;