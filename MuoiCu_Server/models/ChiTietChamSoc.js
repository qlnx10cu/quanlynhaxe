class ChiTietChamSoc {
    static getNameTable() {
        return "chitietchamsoc";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['machamsoc', 'callid'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`machamsoc`, `callid`";
    }

    static getLike(k) {
        let tmp = ['ten', 'biensoxe', 'sodienthoai', 'zaloid'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }

    static getParam(param) {
        let tmp = ['machamsoc', 'callid'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['machamsoc', 'callid'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
}

module.exports = ChiTietChamSoc;