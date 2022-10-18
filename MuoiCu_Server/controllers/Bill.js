const Bill = require("../models/Bill");
const BillSuachua = require("../models/BillSuachua");
const ChamSoc = require("../models/ChamSoc");
const AbstractTwo = require("../models/AbstractTwo");
const Abstract = require('../models/Abstract');
const Option = require("../models/Option")
const librespone = require("../lib/respone");
const Customer = require("../models/Customer");
const zalo = require("../lib/zalo");
const utils = require("../lib/utils");

module.exports = {
    getList: function (req, res) {
        return Abstract.getList(Bill, req.query);
    },
    getByMa: function (req, res) {
        return Abstract.getOne(Bill, Object.assign(req.params, req.query, ' ORDER BY ngaythanhtoan desc, ma desc limit 2000'));
    },
    add: function (req, res) {
        req.body.ngaythanhtoan = new Date();
        req.body.ngayban = new Date();
        return Abstract.add(Bill, req.body);
    },
    update: function (req, res) {
        var param = Object.assign(req.params, req.query);
        param['ngaysuachua'] = new Date();
        return Abstract.update(Bill, req.body, req.params);
    },
    delete: async function (req, res, next) {
        try {
            var data = {};

            let hoadon = await Abstract.getOne(Bill, req.params);
            if (hoadon && hoadon.trangthai != 2) {
                data['ngaysuachua'] = new Date();
                data["trangthai"] = 2;
                let resulft = await Abstract.update(Bill, data, req.params);
                await BillSuachua.tangSoLuongPhuTung(req.params.mahoadon);
                await Abstract.delete(ChamSoc, { mahoadon: req.params.mahoadon });
                res.json(resulft);
            } else {
                librespone.error(req, res, 'Không thể xóa hóa đơn');
            }



        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    thanhtoan: async function (req, res, next) {
        try {
            let hoadon = await Abstract.getOne(Bill, req.params);
            if (hoadon && hoadon.trangthai == 0) {
                var param = [];
                param["ngaythanhtoan"] = new Date();
                param['ngaysuachua'] = param["ngaythanhtoan"];
                param["trangthai"] = 1;
                let resulft = await Abstract.update(Bill, param, req.params);

                setTimeout(async function () {
                    try {
                        var kh = await Abstract.getOne(Customer, { ma: hoadon.makh });
                        if (kh == null) return;
                        hoadon.sodienthoai = kh.sodienthoai;
                        hoadon.zaloid = kh.zaloid;
                        hoadon.loaixe = kh.loaixe;
                        try {
                            if (hoadon.thoigianhen > 0) {
                                var chamsoc = { ...hoadon };
                                chamsoc.trangthai = 0;
                                await Abstract.add(ChamSoc, chamsoc);
                            }
                        } catch (ex) { }

                        try {
                            zalo.sendZNS_suachua(hoadon);
                        } catch (ex) { }
                    } catch (ex) { }
                });
                res.json(resulft);
            }
            else
                librespone.error(req, res, 'Không thanh toán hóa đơn');
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    checkupdate: async function (req, res, next) {
        try {
            let check = await Option.getValue("barcode");
            if (check && check == req.body.ma) {
                res.json({ error: 1 });
            }
            else
                res.json({ error: -1 });
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    }
}