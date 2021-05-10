const Bill = require("../models/Bill");
const BillSuachua = require("../models/BillSuachua");
const AbstractTwo = require("../models/AbstractTwo");
const Abstract = require('../models/Abstract');
const Option = require("../models/Option")
const librespone = require("../lib/respone");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.getList(Bill, req.query);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getByMa: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.getOne(Bill, param);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    add: async function (req, res, next) {
        try {
            req.body.ngaythanhtoan = new Date();
            req.body.ngayban = new Date();
            let resulft = await Abstract.add(Bill, req.body);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    update: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            param['ngaysuachua'] = new Date();
            let resulft = await Abstract.update(Bill, req.body, req.params);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    delete: async function (req, res, next) {
        try {
            var data = {};
            data['ngaysuachua'] = new Date();
            data["trangthai"] = 2;
            let resulft = await Abstract.update(Bill, data, req.params);
            await BillSuachua.tangSoLuongPhuTung(req.params.mahoadon);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    thanhtoan: async function (req, res, next) {
        try {
            let check = await Abstract.getOne(Bill, req.params);
            if (check && check.trangthai == 0) {
                var param = [];
                param["ngaythanhtoan"] = new Date();
                param['ngaysuachua'] = param["ngaythanhtoan"];
                param["trangthai"] = 1;
                let resulft = await Abstract.update(Bill, param, req.params);
                await BillSuachua.giamSoLuongPhuTung(req.params.mahoadon);
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
            if (check && check.value && check.value == req.body.ma) {
                res.json({ error: 1 });
            }
            else
                res.json({ error: -1 });
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    }
}