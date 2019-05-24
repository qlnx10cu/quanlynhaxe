class Item {
    static getNameTable() {
        return "chitietphutung";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['maphutung', 'mamau', 'model'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`maphutung`,`model`,`mamau`";
    }
    static getSelect(tb) {
        return `${tb}.mamau,${tb}.model`;
    }
    static getKey() {
        return "ma";
    }
    static getLike(k) {
        let tmp = ['mamau', 'model'];
        return tmp.includes(k);
    }
    static getParam(param) {
        let tmp = ['mamau', 'model'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getForgenKey() {
        return "ma";
    }
    static getArrayParam(param) {
        let tmp = ['mamau', 'model'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static getDuplicate() {
        return "";
    }
}

module.exports = Item;
