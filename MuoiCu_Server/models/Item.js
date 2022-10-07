const query = require("../lib/db");
const Abstract = require("./Abstract");

class Item {
    static getNameTable() {
        return "phutung";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['maphutung', 'tentienganh', 'tentiengviet', 'loaiphutung', 'giaban_head', 'giaban_le', 'soluongtonkho', 'ghichu', 'vitri', 'ngaycapnhat', 'loaixe', 'mau', 'model'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`maphutung`,`tentienganh`,`tentiengviet`,`loaiphutung`,`giaban_head`, `giaban_le`, `soluongtonkho`,`ghichu`,`vitri`,`ngaycapnhat`,`vat_head`,`vat_le`,`giaban_head_chuavat`,`giaban_le_chuavat`";
    }

    static getDuplicate() {
        return "ON DUPLICATE KEY UPDATE soluongtonkho = soluongtonkho + VALUES(soluongtonkho), giaban_le = VALUES(giaban_le) ";
    }

    static getLike(k) {
        let tmp = ['maphutung', 'tentienganh', 'tentiengviet'];
        return tmp.includes(k);
    }
    static getParam(param) {
        let tmp = ['maphutung', 'tentienganh', 'tentiengviet', 'loaiphutung', 'giaban_head', 'giaban_le', 'soluongtonkho', 'ghichu', 'vitri', 'ngaycapnhat', 'loaixe', 'mau', 'model'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }

    static getArrayParam(param) {
        let tmp = ['maphutung', 'tentienganh', 'tentiengviet', 'loaiphutung', 'giaban_head', 'giaban_le', 'soluongtonkho', 'ghichu', 'vitri', 'ngaycapnhat', 'loaixe', 'mau', 'model'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

    static async getChiTiet(param) {
        try {
            const maphutung = param.maphutung;
            var item = await Abstract.getOne(Item, param);
            if (!item || item.maphutung != maphutung)
                return {};
            var chitiet = [];
            let sql = '';
            var res = [];

            sql = "select * from lichsuphutung where maphutung=? order by timeindex desc limit 1000";
            res = await query(sql, [maphutung]);
            if (res && res.length != 0)
                item.lichsu = res;
            else
                item.lichsu = [];
            sql = "select ct.*,hd.ngaythanhtoan from chitiethoadonsuachua ct left join hoadon hd on ct.mahoadon = hd.mahoadon and hd.trangthai!=2  where maphutung=? order by hd.ngaythanhtoan limit 100";
            res = await query(sql, [maphutung]);
            if (res && res.length != 0)
                chitiet = chitiet.concat(res);

            sql = "select ct.*,hd.ngaythanhtoan from chitiethoadonle ct left join hoadon hd on ct.mahoadon = hd.mahoadon and hd.trangthai!=2  where maphutung=? order by hd.ngaythanhtoan limit 100";
            res = await query(sql, [maphutung]);
            if (res && res.length != 0)
                chitiet = chitiet.concat(res);

            item.chitiet = chitiet.sort((a, b) => (b.ngaythanhtoan || '').localeCompare(a.ngaythanhtoan || ''));

            return item;
        } catch (e) {
            console.log('daye', e);
            return {};
        }
    }

}

module.exports = Item;