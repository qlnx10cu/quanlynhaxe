const query = require('../lib/db')

class Option {
    static getNameTable() {
        return "caidat";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['key', 'value'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`key`,`value`";
    }
    static getLike(k) {
        return false;
    }
    static getDuplicate() {
        return "";
    }
    static getParam(param) {
        let tmp = ['key', 'value'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['key', 'value'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static async getValue(key) {
        var sql = "select caidat.key,caidat.value from caidat where caidat.key=?";
        let res = await query(sql, [key]);
        if (res && res[0] && res[0].value) {
            return res[0].value;
        }
        return null;
    }
    static async getValueJson(key) {
        try {
            var sql = "select caidat.key,caidat.value from caidat where caidat.key=?";
            let res = await query(sql, [key]);
            if (res && res[0] && res[0].value) {
                return JSON.parse(res[0].value);
            }
        } catch (ex) {

        }
        return {};
    }
    static async setValue(key, value) {
        var sql = "update caidat set value = ? where `key` = ?";
        let res = await query(sql, [value, key]);
        return res;
    }
}

module.exports = Option;