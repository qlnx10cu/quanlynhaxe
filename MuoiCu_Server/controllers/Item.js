const Item = require("../models/Item");
const Abstract = require("../models/Abstract");
const librespone = require("../lib/respone");
const logger = require("../lib/logger");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.getList(Item, req.query);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getByMa: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.getOne(Item, param);
            if (resulft == null) {
                librespone.error(req, res, "Không tìm thấy mã: ");
            }
            else
                res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    add: async function (req, res, next) {
        try {
            let body = {
                ...req.body
            }
            let resulft = await Abstract.add(Item, body);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    update: async function (req, res, next) {
        try {
            // var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.update(Item, req.body, req.params);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    delete: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.delete(Item, param);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    addMutil: async function (req, res, next) {
        try {
            let body = {
                ...req.body
            }
            let resulft = await Abstract.addMutil(Item, body.chitiet);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
};