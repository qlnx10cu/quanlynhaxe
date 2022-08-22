const HistoryCall = require("../models/HistoryCall");
const Abstract = require('../models/Abstract');
module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.getList(HistoryCall, req.query);
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
            let resulft = await Abstract.getOne(HistoryCall, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getByAccountSip: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.getOne(HistoryCall, param);
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
            let resulft = await Abstract.add(HistoryCall, req.body);
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
            let resulft = await Abstract.update(HistoryCall, req.body, req.params);
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
            let resulft = await Abstract.delete(HistoryCall, req.params);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    uploadlog: async function (req, res, next) {
        try {
            var body = req.body;
            let bill = await Abstract.getOne(HistoryCall, { callid: body.callid });
            if (!bill) {
                let resulft = await Abstract.add(HistoryCall, req.body);
                res.json(resulft);
            } else {
                let resulft = await Abstract.update(HistoryCall, req.body, req.params);
                res.json(resulft);
            }

        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
}