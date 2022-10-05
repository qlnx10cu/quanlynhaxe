const Customer = require("../models/Customer");
const Abstract = require("../models/Abstract");
const Employee = require("../models/Employee");
const utils = require("../lib/utils");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.search(Customer, req.query, ' ORDER BY updatetime desc, ma desc limit 2000');
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
            let resulft = await Abstract.getOne(Customer, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getByZaloId: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.getOne(Customer, param);
            if (resulft && resulft.zaloid && resulft.zaloid == param.zaloid) {
                res.json(resulft);
            } else {
                res.json({});
            }
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getBySoDienThoai: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.getOne(Customer, param);
            if (resulft && resulft.sodienthoai && utils.compareSDT(resulft.sodienthoai, param.sodienthoai)) {
                res.json(resulft);
            } else {
                res.json({});
            }
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
            req.body['updatetime'] = new Date();
            req.body['biensoxe'] = utils.normalizeStr(req.body.biensoxe);
            req.body['sokhung'] = utils.normalizeStr(req.body.sokhung);
            req.body['somay'] = utils.normalizeStr(req.body.somay);
            let resulft = await Abstract.add(Customer, req.body);
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
            req.body['updatetime'] = new Date();
            req.body['biensoxe'] = utils.normalizeStr(req.body.biensoxe);
            req.body['sokhung'] = utils.normalizeStr(req.body.sokhung);
            req.body['somay'] = utils.normalizeStr(req.body.somay);
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.update(Customer, req.body, { ma: param.ma });
            res.json(resulft);
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
            let resulft = await Abstract.delete(Customer, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    chitiet: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.getOne(Customer, param);
            resulft["chitiet"] = await Customer.getChitiet(param.ma);
            for (var i = 0; i < resulft["chitiet"].length; i++) {
                var item = resulft["chitiet"][i];
                if (item.manvsuachua) {
                    var paramNV = { ma: item.manvsuachua };
                    var nhanvien = await Abstract.getOne(Employee, paramNV);
                    if (nhanvien) {
                        item.tennvsuachua = nhanvien.ten;
                    }
                    else {
                        item.tennvsuachua = '';
                    }

                }
            }
            resulft["historycall"] = await Customer.getHistoryCall(param.ma);
            resulft["historycskh"] = await Customer.getHistoryCSKH(param.ma);

            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },

};