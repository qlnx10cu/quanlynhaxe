const Bill = require("../models/Bill");
const BillLe = require("../models/BillLe");
const AbstractTwo = require("../models/AbstractTwo");
const Abstract = require('../models/Abstract');
const librespone = require("../lib/respone");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await AbstractTwo.getList(Bill, BillLe, req.query);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getByMa: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await AbstractTwo.getList(Bill, BillLe, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    add: async function (req, res, next) {
        try {
            var str = new Date().getTime().toString();
            var mahoadon = 'PT-' + str.substr(str.length - 8, str.length - 7);
            let {
                chitiet,
                ...conlai
            } = req.body;
            var bodybill = conlai;
            var detailbill = chitiet;
            bodybill['trangthai'] = 1;
            bodybill['loaihoadon'] = 1;
            bodybill['mahoadon'] = mahoadon;
            bodybill['ngaythanhtoan'] = new Date();
            bodybill['ngayban'] = new Date();
            for (var k in detailbill) {
                detailbill[k]['mahoadon'] = mahoadon;
            }
            let resulft = await Abstract.add(Bill, bodybill);
            resulft = await Abstract.addMutil(BillLe, detailbill);
            await BillLe.giamSoLuongPhuTung(detailbill);
            res.json({ "mahoadon": mahoadon });
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getChitiet: async function (req, res, next) {
        try {
            let resulft = await BillLe.getChitiet(req.params.mahoadon);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    update: async function (req, res, next) {
        try {
            if (!req.body.mahoadon) {
                librespone.error(req, res, "Không tồn tại mã hóa đơn");
                return;
            }
            let {
                mahoadon,
                chitiet,
                ...conlai
            } = req.body;

            let check = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (check && check.trangthai == 1) {
                var bodybill = conlai;
                bodybill['ngaysuachua'] = new Date();
                var detailbill = chitiet;
                for (var k in detailbill) {
                    detailbill[k]['mahoadon'] = mahoadon;
                }
                var paramHoaDon = { mahoadon: mahoadon };
                let resulft = await Abstract.update(Bill, bodybill, paramHoaDon);
                await BillLe.deleteMahoaDon(mahoadon);
                if (detailbill.length != 0)
                    resulft = await Abstract.addMutil(BillLe, detailbill);
                res.json({ "mahoadon": mahoadon });
            } else
                librespone.error(req, res, 'Không update được hóa đơn');

        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    delete: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.delete(Bill, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },

}