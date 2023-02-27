const query = require('../lib/db');
const Customer = require('./Customer');

class BillChan {
    static getNameTable() {
        return "chitiethoadonsuachua";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['mahoadon', 'tenphutungvacongviec', 'maphutung', 'dongia', 'nhacungcap', 'soluongphutung', 'loaiphutung', 'tienpt', 'chietkhau',
                'tienchietkhau', 'tiencongchietkhau', 'tiencong', 'thanhtiencong', 'thanhtienpt', 'tongtien', 'manvsuachua'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`mahoadon`,`tenphutungvacongviec`,`maphutung`,`dongia`,`nhacungcap`,`soluongphutung`,`loaiphutung`,`tienpt`,`chietkhau`,`tienchietkhau`,`tiencongchietkhau`,`tiencong`,`thanhtiencong`,`thanhtienpt,`tongtien`,`manvsuachua`";
    }
    static getLike(k) {
        return false;
    }
    static getSelect(tb) {
        return `${tb}.tenphutungvacongviec,${tb}.maphutung,${tb}.soluongphutung,${tb}.tiencong,${tb}.chietkhau,${tb}.tienchietkhau${tb}.tiencongchietkhau,${tb}.loaiphutung,${tb}.tienpt,${tb}.thanhtiencong,${tb}.thanhtienpt,${tb}.tongtien,${tb}.manvsuachua`;
    }
    static getParam(param) {
        let tmp = ['mahoadon', 'tenphutungvacongviec', 'maphutung', 'dongia', 'nhacungcap', 'soluongphutung', 'loaiphutung', 'tienpt', 'chietkhau',
            'tienchietkhau', 'tiencongchietkhau', 'tiencong', 'thanhtiencong', 'thanhtienpt', 'tongtien', 'manvsuachua'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['mahoadon', 'tenphutungvacongviec', 'maphutung', 'dongia', 'nhacungcap', 'soluongphutung', 'loaiphutung', 'tienpt', 'chietkhau',
            'tienchietkhau', 'tiencongchietkhau', 'tiencong', 'thanhtiencong', 'thanhtienpt', 'tongtien', 'manvsuachua'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static async delete(param) {
        let sql = "update hoadon set trangthai=2 where mahoadon= ?";
        var res = await query(sql, param);
    }
    static async getChitiet(param) {
        let sql = "select * from hoadon where mahoadon= ? and trangthai!=2  and loaihoadon=0";
        var result = [];
        var res = await query(sql, param);
        if (!res || res.length == 0)
            return null;
        sql = "select * from " + Customer.getNameTable() + " where ma = ?";
        var resKH = await query(sql, [res[0].makh]);


        result = Object.assign(res[0], resKH[0]);

        if (res[0].manvsuachua) {
            sql = "select * from nhanvien where ma= ?"
            var resNV = await query(sql, [res[0].manvsuachua]);
            if (resNV) {
                result.tennvsuachua = resNV[0].ten
            }
        }

        sql = "select * from chitiethoadonsuachua where mahoadon = ? ";
        res = await query(sql, param);
        result["chitiet"] = res;
        return result;
    }

    static async getChitietThanhToan(param, trangthai) {
        try {
            let sql = `select * from hoadon where mahoadon= ? and trangthai = ${trangthai}  and loaihoadon=0`;
            var result = [];
            var res = await query(sql, param);
            if (!res || res.length == 0) {
                return null;
            }
            sql = "select * from " + Customer.getNameTable() + " where ma = ?";
            var resKH = await query(sql, [res[0].makh]);


            result = Object.assign(res[0], resKH[0]);

            if (res[0].manvsuachua) {
                sql = "select * from nhanvien where ma= ?"
                var resNV = await query(sql, [res[0].manvsuachua]);
                if (resNV) {
                    result.tennvsuachua = resNV[0].ten
                }
            }

            sql = "select * from chitiethoadonsuachua where mahoadon = ? ";
            res = await query(sql, param);
            result["chitiet"] = res;
            return result;
        } catch (ex) {

        }
        return null;
    }

    static getDuplicate() {
        return "";
    }

    static async deleteMahoaDon(param) {
        var sql = "DELETE FROM chitiethoadonsuachua WHERE mahoadon= ?";
        var res = await query(sql, param);
        return res;
    }

    static async getChitietHungTrang(param) {
        try {
            let sql = "select * from hoadon where mahoadon= ? and trangthai!=2";
            var result = [];
            var res = await query(sql, param);
            if (!res || res.length == 0)
                return [];
            result = res[0];
            sql = "select * from chitiethoadonsuachua ct where ct.mahoadon=?  AND maphutung!=''";
            res = await query(sql, param);
            result["chitiet"] = res;
            return result;
        } catch (e) {
            return [];
        }
    }

    static async giamSoLuongPhuTung(mahoadon) {
        var sql = "update phutung pt left join ( select maphutung, soluongphutung, mahoadon from chitiethoadonsuachua where mahoadon = ?) ct on pt.maphutung=ct.maphutung " +
            " set pt.soluongtonkho=pt.soluongtonkho - ct.soluongphutung " +
            " where mahoadon=? AND ct.maphutung IS NOT NULL AND ct.maphutung !='' ";
        var res = await query(sql, [mahoadon, mahoadon]);
        return res;
    }

    static async tangSoLuongPhuTung(mahoadon) {
        var sql = "update phutung pt left join ( select maphutung, soluongphutung, mahoadon from chitiethoadonsuachua where mahoadon = ?) ct on pt.maphutung=ct.maphutung " +
            " set pt.soluongtonkho=pt.soluongtonkho + ct.soluongphutung " +
            " where mahoadon=? AND ct.maphutung IS NOT NULL AND ct.maphutung !='' ";
        var res = await query(sql, [mahoadon, mahoadon]);
        return res;
    }
}

module.exports = BillChan;