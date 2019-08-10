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
    static getParam(param) {
        let tmp = ['tenphutung', 'nhacungcap','dongia','ghichu'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['tenphutung', 'nhacungcap','dongia','ghichu'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
}

module.exports = Salary;