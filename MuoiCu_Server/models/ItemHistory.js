const query = require("../lib/db");

class ItemHistory {
    static getNameTable() {
        return "lichsuphutung";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['maphutung', 'giaban_le', 'soluongtonkho', 'giaban_cu', 'soluongtruocdo', 'loai', 'timeindex', 'ngaycapnhat'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`maphutung`,`giaban_le`,`soluongtonkho`,`giaban_cu`,`soluongtruocdo`,`loai`,`timeindex`,`ngaycapnhat`";
    }

    static getDuplicate() {
        return "";
    }

    static getLike(k) {
        let tmp = ['maphutung', 'giaban_le', 'soluongtonkho', 'giaban_cu', 'soluongtruocdo', 'loai', 'timeindex', 'ngaycapnhat'];
        return tmp.includes(k);
    }
    static getParam(param) {
        let tmp = ['maphutung', 'giaban_le', 'soluongtonkho', 'giaban_cu', 'soluongtruocdo', 'loai', 'timeindex', 'ngaycapnhat'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }

    static getArrayParam(param) {
        let tmp = ['maphutung', 'giaban_le', 'soluongtonkho', 'giaban_cu', 'soluongtruocdo', 'loai', 'timeindex', 'ngaycapnhat'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

    static async addLichSuPhuTung(timeindex) {
        var sql = "update lichsuphutung lspt left join  phutung pt on lspt.maphutung=lspt.maphutung and lspt.timeindex = ?" +
            " set lspt.soluongtruocdo=pt.soluongtruocdo, lspt.giaban_cu = pt.giaban_le " +
            " where pt.maphutung IS NOT NULL AND pt.maphutung !='' and lspt.timeindex = ?";
        var res = await query(sql, [timeindex, timeindex]);
        return res;

    }
}

module.exports = ItemHistory;