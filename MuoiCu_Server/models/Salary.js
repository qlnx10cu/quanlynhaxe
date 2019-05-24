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
}

module.exports = Salary;