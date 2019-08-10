const query = require('../lib/db')

class Salary {
    static getNameTable() {
        return "tiencong";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ten', 'tien'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ten`,`tien`";
    }
    static getLike(k) {
        let tmp = ['ten'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }
    static getParam(param) {
        let tmp = ['ten', 'tien'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ten', 'tien'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
}

module.exports = Salary;