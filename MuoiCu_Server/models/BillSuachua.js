const query = require('../lib/db')

class BillChan {
    static getNameTable() {
        return "chitiethoadonsuachua";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['mahoadon', 'tenphutungvacongviec', 'maphutung', 'dongia', 'nhacungcap', 'soluongphutung', 'tiencong', 'tongtien', 'manvsuachua'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`mahoadon`,`tenphutungvacongviec`,`maphutung`,`dongia`,`nhacungcap`,`soluongphutung`,`tiencong`,`tongtien`,`manvsuachua`";
    }
    static getLike(k) {
        return false;
    }
    static getSelect(tb) {
        return `${tb}.tenphutungvacongviec,${tb}.maphutung,${tb}.soluongphutung,${tb}.tiencong,${tb}.tongtien,${tb}.manvsuachua`;
    }
    static getParam(param) {
        let tmp = ['mahoadon', 'tenphutungvacongviec', 'maphutung', 'dongia', 'nhacungcap', 'soluongphutung', 'tiencong', 'tongtien', 'manvsuachua'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['mahoadon', 'tenphutungvacongviec', 'maphutung', 'dongia', 'nhacungcap', 'soluongphutung', 'tiencong', 'tongtien', 'manvsuachua'];
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
        console.log(res);
    }
    static async getChitiet(param) {
        let sql = "select * from hoadon where mahoadon= ? and trangthai!=2";
        var result = [];
        var res = await query(sql, param);
        if (!res)
            return null;
        sql = "select * from khachhang where ma = ?";
        var resKH = await query(sql, [res[0].makh]);


        result = Object.assign(res[0], resKH[0]);

        if(res[0].manvsuachua){
            sql="select * from nhanvien where ma= ?"
            var resNV = await query(sql, [res[0].manvsuachua]);
            if(resNV){
                result.tennvsuachua=resNV[0].ten
            }
        }
      
        sql = "select * from chitiethoadonsuachua where mahoadon = ? ";
        res = await query(sql, param);
        result["chitiet"] = res;
        return result;
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
            if (!res||res.count==0)
                return [];
            result = res[0];
            sql = "select * from chitiethoadonsuachua ct where ct.mahoadon=?  AND maphutung!=''";
            res = await query(sql, param);
            console.log(res);
            result["chitiet"] = res;
            return result;
        } catch (e) {
            return [];
        }
    }
    static async giamSoLuongPhuTung(param) {
        var sql = "update chitiethoadonsuachua ct left join phutung pt on pt.maphutung=ct.maphutung " +
            " set pt.soluongtonkho=pt.soluongtonkho-ct.soluongphutung " +
            " where mahoadon=? AND ct.maphutung IS NOT NULL AND ct.maphutung !='' ";
        var res = await query(sql, [param]);
        return res;

    }
    static async tangSoLuongPhuTung(param) {
        var sql = "update chitiethoadonsuachua ct left join phutung pt on pt.maphutung=ct.maphutung " +
            " set pt.soluongtonkho=pt.soluongtonkho+ct.soluongphutung " +
            " where mahoadon=? AND ct.maphutung IS NOT NULL AND ct.maphutung !='' ";
        var res = await query(sql, [param]);
        return res;

    }
}

module.exports = BillChan;