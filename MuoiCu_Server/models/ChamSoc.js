const query = require("../lib/db");

class ChamSoc {
    static getNameTable() {
        return "chamsoc";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ma', 'mahoadon', 'makh', 'tenkh', 'biensoxe', 'sodienthoai', 'zaloid', 'solangoi', 'ngayhen', 'kiemtralantoi', 'trangthai', 'ghichu', 'ngaythanhtoan', 'ngayupdate'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ma`, `mahoadon`, `makh`, `tenkh`, `biensoxe`, `sodienthoai`, `zaloid`, `solangoi`, `ngayhen`, `kiemtralantoi`, `trangthai`, `ghichu`, `ngaythanhtoan`, `ngayupdate`";
    }

    static getLike(k) {
        let tmp = ['ten','biensoxe', 'sodienthoai', 'zaloid'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }

    static getParam(param) {
        let tmp = ['ma', 'mahoadon', 'makh', 'tenkh', 'biensoxe', 'sodienthoai', 'zaloid', 'solangoi', 'ngayhen', 'kiemtralantoi', 'trangthai', 'ghichu', 'ngaythanhtoan', 'ngayupdate'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ma', 'mahoadon', 'makh', 'tenkh', 'biensoxe', 'sodienthoai', 'zaloid', 'solangoi', 'ngayhen', 'kiemtralantoi', 'trangthai', 'ghichu', 'ngaythanhtoan', 'ngayupdate'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    
    static async bydate (praram) {
        var param = [];
        var sql = "select * from chamsoc where 1=1 ";
        if (praram.start) {
            param.push(praram.start);
            sql = sql + "AND DATEDIFF(ngayhen,?) >= 0 ";
        }
        if (praram.end) {
            param.push(praram.end);
            sql = sql + "AND DATEDIFF(?,ngayhen) >= 0 ";
        }
        sql = sql + " ORDER BY ngayhen desc";
        let res = await query(sql, param);
        return res;
    }
}

module.exports = ChamSoc;