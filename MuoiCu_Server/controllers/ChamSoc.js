const ChamSoc = require("../models/ChamSoc");
const Account = require("../models/Account");
const AbstractTwo = require("../models/AbstractTwo");
const Abstract = require('../models/Abstract');
module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.getList(ChamSoc, req.query);
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
            let resulft = await Abstract.getOne(ChamSoc, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    bydate: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await ChamSoc.bydate(param);
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
            var body = req.body;
            let resulft = await Abstract.add(ChamSoc, req.body);
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
            let resulft = await Abstract.update(ChamSoc, req.body, req.params);
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
            let resulft = await Abstract.delete(ChamSoc, req.params);
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