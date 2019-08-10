const query = require('../lib/db')

class Customer {
    static getNameTable() {
        return "khachhang";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ten', 'sodienthoai', 'diachi', 'biensoxe', 'loaixe', 'sokhung', 'somay'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ten`,`sodienthoai`,diachi`,`biensoxe`,`loaixe,`sokhung`,`somay`";
    }
    static getLike(k) {
        let tmp = ['ten', 'sodienthoai', 'diachi', 'biensoxe'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }
    static async getChitiet(param) {
        let sql = "SELECT mahoadon,ngaythanhtoan,yeucaukhachhang,tuvansuachua,sokm FROM hoadon where makh=? AND trangthai=1 AND loaihoadon=0 order by mahoadon DESC";
        var res = await query(sql, [param]);
        return res;
    }
    static getParam(param) {
        let tmp = ['ten', 'sodienthoai', 'diachi', 'biensoxe', 'loaixe', 'sokhung', 'somay'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ten', 'sodienthoai', 'diachi', 'biensoxe', 'loaixe', 'sokhung', 'somay'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
}

module.exports = Customer;