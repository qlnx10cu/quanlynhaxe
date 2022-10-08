const query = require('../lib/db')

class BillLe {
    static getNameTable() {
        return "chitiethoadonle";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['mahoadon', 'maphutung', 'tenphutung', 'dongia', 'soluong', 'ghichu', 'chietkhau', 'nhacungcap'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`mahoadon`,`maphutung`,`tenphutung`,`dongia`,`soluong`,`ghichu`,`chietkhau`,`nhacungcap`";
    }
    static getLike(k) {
        return false;
    }
    static getSelect(tb) {
        return `${tb}.maphutung,${tb}.tenphutung,${tb}.dongia,${tb}.soluong,${tb}.ghichu,${tb}.chietkhau,${tb}.nhacungcap`;
    }
    static getParam(param) {
        let tmp = ['maphutung', 'tenphutung', 'dongia', 'soluong', 'ghichu', 'chietkhau', 'nhacungcap'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['maphutung', 'tenphutung', 'dongia', 'soluong', 'ghichu', 'chietkhau', 'nhacungcap'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static async getChitiet(param) {
        let sql = "select * from hoadon where mahoadon= ? and trangthai!=2 and loaihoadon=1";
        var result = [];
        var res = await query(sql, param);
        result = res[0];
        if (result && result.makh) {
            sql = "select * from khachhang where ma=?";
            res = await query(sql, [result.makh]);
            if (res && res[0]) {
                result.diachi = res[0].diachi;
                result.sodienthoai = res[0].sodienthoai;
                result.thanhpho = res[0].thanhpho;
                result.gioitinh = res[0].gioitinh;
            }
        }

        sql = "select * from chitiethoadonle ct where ct.mahoadon=?";
        res = await query(sql, param);
        result["chitiet"] = res;
        return result;
    }

    static async getChitietThanhToan(param) {
        try {
            let sql = "select * from hoadon where mahoadon= ? and trangthai=1 and loaihoadon=1";
            var result = [];
            var res = await query(sql, param);
            if (!res || res.length == 0) {
                return null;
            }
            result = res[0];
            if (result && result.makh) {
                sql = "select * from khachhang where ma=?";
                res = await query(sql, [result.makh]);
                if (res && res[0]) {
                    result.diachi = res[0].diachi;
                    result.sodienthoai = res[0].sodienthoai;
                    result.thanhpho = res[0].thanhpho;
                    result.gioitinh = res[0].gioitinh;
                }
            }

            sql = "select * from chitiethoadonle ct where ct.mahoadon=?";
            res = await query(sql, param);
            result["chitiet"] = res;
            return result;
        } catch (ex) {
        }
        return null;
    }

    static async getChitietHungTrang(param) {
        let sql = "select * from hoadon where mahoadon= ? and trangthai=1 and loaihoadon=1";
        var result = [];
        var res = await query(sql, param);
        if (!res || res.length == 0)
            return [];
        result = res[0];
        sql = "select * from chitiethoadonle ct where ct.mahoadon=?  AND maphutung!=''";
        res = await query(sql, param);
        result["chitiet"] = res;
        return result;
    }
    static async getChitietCuaHoangNgoai(param) {
        let sql = "select * from hoadon where mahoadon= ? and trangthai=1  and loaihoadon=1";
        var result = [];
        var res = await query(sql, param);
        result = res[0];
        sql = "select * from chitiethoadonle ct where ct.mahoadon=?  AND maphutung=''";
        res = await query(sql, param);
        result["chitiet"] = res;
        return result;
    }
    static getDuplicate() {
        return "";
    }
    static async giamSoLuongPhuTung(bill) {
        for (var i in bill) {
            var sql = " UPDATE phutung SET soluongtonkho = soluongtonkho - ? WHERE maphutung = ? ";
            var res = await query(sql, [bill[i].soluong, bill[i].maphutung]);
        }
        return {};
    }

    static async tangSoLuongPhuTung(bill) {
        for (var i in bill) {
            var sql = " UPDATE phutung SET soluongtonkho = soluongtonkho + ? WHERE maphutung = ? ";
            var res = await query(sql, [bill[i].soluong, bill[i].maphutung]);
        }
        return {};
    }

    static async deleteMahoaDon(param) {
        var sql = "DELETE FROM chitiethoadonle WHERE mahoadon= ?";
        var res = await query(sql, param);
        return res;
    }

    static async tangSoLuongPhuTungByMaHD(mahoadon) {
        var sql = "update phutung pt left join  ( select maphutung, soluong from chitiethoadonle where mahoadon = ?) ct on pt.maphutung=ct.maphutung " +
            " set pt.soluongtonkho=pt.soluongtonkho + ct.soluong " +
            " where mahoadon=? AND ct.maphutung IS NOT NULL AND ct.maphutung !='' ";
        var res = await query(sql, [mahoadon, mahoadon]);
        return res;
    }

}

module.exports = BillLe;