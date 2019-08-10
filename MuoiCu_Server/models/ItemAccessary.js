class Item {
    static getNameTable() {
        return "chitietphukien";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['maphutung', 'loaixe', 'mau', 'model'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`maphutung`,`loaixe`,`mau`, `model`";
    }
    static getSelect(tb) {
        return `${tb}.loaixe, ${tb}.mau, ${tb}.model`;
    }
    static getLike(k) {
        let tmp = ['loaixe', 'mau', 'model'];
        return tmp.includes(k);
    }
    static getKey() {
        return "ma";
    }
    static getParam(param) {
        let tmp = ['loaixe', 'mau', 'model'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getForgenKey() {
        return "ma";
    }
    static getArrayParam(param) {
        let tmp = ['loaixe', 'mau', 'model'];
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