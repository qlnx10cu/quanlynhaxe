const query = require('../lib/db')

class BanNang {
    static getNameTable() {
        return "bannang";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ma','mahoadon', 'biensoxe','trangthai'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ma`,`mahoadon`, `biensoxe`,`trangthai`";
    }
    static getLike(k) {
        let tmp = ['mahoadon'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }
    static getParam(param) {
        let tmp = ['ma','mahoadon', 'biensoxe','trangthai'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ma','mahoadon', 'biensoxe','trangthai'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
}

module.exports = BanNang;