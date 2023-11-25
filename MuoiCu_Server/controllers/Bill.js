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
const logger = require("../lib/logger");

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

            logger.info("Id: "+req.start+" Bill.delete Bill.getOne ");

            let hoadon = await Abstract.getOne(Bill, req.params);
            if (hoadon && hoadon.trangthai != 2) {
                data['ngaysuachua'] = new Date();
                data["trangthai"] = 2;
                logger.info("Id: "+req.start+" Bill.delete Bill.update ");
                let resulft = await Abstract.update(Bill, data, req.params);
                logger.info("Id: "+req.start+" Bill.delete BillSuachua.tangSoLuongPhuTung ");
                await BillSuachua.tangSoLuongPhuTung(req.params.mahoadon);
                logger.info("Id: "+req.start+" Bill.delete ChamSoc.delete ");
                await Abstract.delete(ChamSoc, { mahoadon: req.params.mahoadon });
                logger.info("Id: "+req.start+" Bill.delete done ");
                res.json(resulft);
            } else {
                logger.info("Id: "+req.start+" Bill.delete error ");
                librespone.error(req, res, 'Không thể xóa hóa đơn');
            }



        } catch (error) {
            logger.info("Id: "+req.start+" Bill.delete error first ");
            librespone.error(req, res, error.message);
        }
    },
    thanhtoan: async function (req, res, next) {
        try {
            logger.info("Id: "+req.start+" Bill.thanhtoan Abstract.getOne ");
            let hoadon = await Abstract.getOne(Bill, req.params);
            if (hoadon && hoadon.trangthai == 0) {
                var param = [];
                param["ngaythanhtoan"] = new Date();
                param['ngaysuachua'] = param["ngaythanhtoan"];
                param["trangthai"] = 1;
                logger.info("Id: "+req.start+" Bill.thanhtoan Abstract.update ");

                let resulft = await Abstract.update(Bill, param, req.params);
                logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout ");

                setTimeout(async function () {
                    try {
                        logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.getOne ");
                        var kh = await Abstract.getOne(Customer, { ma: hoadon.makh });
                        logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.return ");
                        if (kh == null) return;
                        hoadon.sodienthoai = kh.sodienthoai;
                        hoadon.zaloid = kh.zaloid;
                        hoadon.loaixe = kh.loaixe;
                        try {
                            if (hoadon.thoigianhen > 0) {
                                var chamsoc = { ...hoadon };
                                chamsoc.trangthai = 0;
                                logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.ChamSoc ");
                                await Abstract.add(ChamSoc, chamsoc);
                                logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.ChamSoc.done ");
                            }
                        } catch (ex) { 
                            logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.ChamSoc.error ");
                        }

                        try {
                            logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.sendZNS_suachua ");
                            zalo.sendZNS_suachua(hoadon);
                            logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.sendZNS_suachua.done ");
                        } catch (ex) { 
                            logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.sendZNS_suachua.error ");
                        }
                    } catch (ex) {
                        logger.info("Id: "+req.start+" Bill.thanhtoan setTimeout.error ");
                     }
                });
                logger.info("Id: "+req.start+" Bill.thanhtoan done ");
                res.json(resulft);
            }
            else {
                logger.info("Id: "+req.start+" Bill.thanhtoan no.error ");
                librespone.error(req, res, 'Không thanh toán hóa đơn');
            }
        } catch (error) {
            logger.info("Id: "+req.start+" Bill.thanhtoan errorno.error ");
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