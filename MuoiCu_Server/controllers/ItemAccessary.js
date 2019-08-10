const _ = require("lodash");
const Item = require("../models/Item");
const ItemAccessary = require("../models/ItemAccessary");
const Abstract = require("../models/Abstract");
const AbstractTwo = require("../models/AbstractTwo");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await AbstractTwo.getList(Item, ItemAccessary, req.query);
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
            let resulft = await AbstractTwo.getOne(Item, ItemAccessary, req.query, req.params);
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
            let resulft = await AbstractTwo.addAuto(Item, ItemAccessary, req.body);
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
            let resulft = await AbstractTwo.update(Item, ItemAccessary, req.body, req.params);
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
            let resulft = await AbstractTwo.delete(ItemAccessary, Item, req.params);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    addMutil: async function (req, res, next) {
        try {
            let body = {
                ...req.body
            }
            let tmp = _.chunk(body.chitiet, 3000);
            for (var i in tmp) {
                await AbstractTwo.addMutil(Item, ItemAccessary, tmp[i]);
            }
            res.json({ message: "Thành công", type: "success" });
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
};