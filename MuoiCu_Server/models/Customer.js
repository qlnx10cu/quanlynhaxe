const query = require('../lib/db')
const utils = require('../lib/utils')
const Abstract = require('./Abstract');

class Customer {
    static getNameTable() {
        return "quanlytrungtrang.khachhang";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ten', 'sodienthoai', 'diachi', 'biensoxe', 'loaixe', 'sokhung', 'somay', 'gioitinh', 'thanhpho', 'updatetime', 'zaloid', 'tenzalo'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ten`,`sodienthoai`,diachi`,`biensoxe`,`loaixe,`sokhung`,`somay`,`gioitinh`,`thanhpho`,`updatetime`,`zaloid`,`tenzalo`";
    }
    static getLike(k) {
        let tmp = ['ten', 'sodienthoai', 'biensoxe', 'sokhung', 'somay', 'zaloid', 'tenzalo'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }
    static async getChitiet(param) {
        let sql = "SELECT mahoadon,manvsuachua,ngaythanhtoan,yeucaukhachhang,tuvansuachua,sokm,kiemtradinhky FROM hoadon where makh=? AND trangthai=1 AND loaihoadon=0 order by mahoadon DESC";
        var res = await query(sql, [param]);
        return res;
    }
    static async getHistoryCall(param) {
        let sql = "SELECT * FROM quanlytrungtrang.lichsucuocgoi where makh=? order by starttime DESC";
        var res = await query(sql, [param]);
        return res;
    }
    static async getHistoryCSKH(param) {
        let sql = "SELECT * FROM quanlytrungtrang.chamsoc where makh=? order by ngayhen DESC";
        var res = await query(sql, [param]);
        return res;
    }

    static async addOrUpdateSuaChua(body) {
        try {
            var data = {};
            data.sodienthoai = body.sodienthoai;
            data.diachi = body.diachi;
            data.loaixe = body.loaixe;
            data.gioitinh = body.gioitinh;
            data.thanhpho = body.thanhpho;
            data.ten = body.tenkh;
            data.biensoxe = utils.normalizeStr(body.biensoxe);
            data.somay = utils.normalizeStr(body.somay);
            data.sokhung = utils.normalizeStr(body.sokhung);
            data.updatetime = new Date();

            var makh = body.makh;

            if (!makh) {
                let r = null;
                if (data.biensoxe || data.somay || data.sokhung) {
                    r = await Abstract.getOneSearch(Customer, { biensoxe: data.biensoxe, somay: data.somay, sokhung: data.sokhung }, ' ORDER BY updatetime desc, ma desc limit 10');
                }
                if (r) {
                    makh = r.ma;
                }
            }

            if (!makh) {
                let r = await Abstract.add(Customer, data);
                if (!r || r == null) {
                    return null;
                }
                makh = r.insertId;
            } else {
                await Abstract.update(Customer, data, { ma: makh });
            }
            return makh;
        } catch (ex) {

        }
        return null;
    }

    static async addOrUpdateBanLe(body) {
        try {
            var data = {};
            data.sodienthoai = utils.normalizeStr(body.sodienthoai);
            data.diachi = body.diachi;
            data.gioitinh = body.gioitinh;
            data.thanhpho = body.thanhpho;
            data.ten = body.tenkh;
            data.updatetime = new Date();

            var makh = body.makh;

            if (!data.sodienthoai)
                return makh;

            if (!makh) {
                let r = null;
                if (data.sodienthoai) {
                    r = await Abstract.getOneSearch(Customer, { sodienthoai: data.sodienthoai }, ' ORDER BY updatetime desc, ma desc limit 10');
                }
                if (r) {
                    makh = r.ma;
                }
            }

            if (!makh) {
                let r = await Abstract.add(Customer, data);
                if (!r || r == null) {
                    return null;
                }
                makh = r.insertId;
            } else {
                await Abstract.update(Customer, data, { ma: makh });
            }
            return makh;
        } catch (ex) {

        }
        return body ? body.makh : null;
    }

    static getParam(param) {
        let tmp = ['ten', 'sodienthoai', 'diachi', 'biensoxe', 'loaixe', 'sokhung', 'somay', 'gioitinh', 'thanhpho', 'updatetime', 'zaloid', 'tenzalo'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ma', 'ten', 'sodienthoai', 'diachi', 'biensoxe', 'loaixe', 'sokhung', 'somay', 'gioitinh', 'thanhpho', 'updatetime', 'zaloid', 'tenzalo'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
}

module.exports = Customer;