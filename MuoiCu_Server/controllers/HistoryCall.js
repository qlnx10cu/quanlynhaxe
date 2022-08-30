const HistoryCall = require("../models/HistoryCall");
const Employee = require('../models/Employee');
const Customer = require('../models/Customer');
const Abstract = require('../models/Abstract');
const Option = require('../models/Option');

const librespone = require("../lib/respone");

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
    bydate: async function (req, res, next) {
        try {
            let resulft = await HistoryCall.bydate(req.query);
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
            if (!req.body || !req.body.callid || !req.body.fromsip || !req.body.tosip || !req.body.direction) {
                librespone.error(req, res, "Thiếu param callid ,fromsip ,tosip, direction");
                return;
            }

            var body = req.body;
            var params = { callid: body.callid };

            var nv = null;
            var kh = null;
            var breachsip = null;

            var breach = await Option.getValueJson('breachsip');

            switch (req.body.direction) {
                case 'user2pbx': {
                    kh = await Abstract.getOne(Customer, { zaloid: body.fromsip });
                    if (breach && breach[body.tosip]) {
                        breachsip = breach[body.tosip];
                    }
                    if (!body.accountsip && body.tosip && body.tosip.startsWith('28677359939585145679')) {
                        body.accountsip = body.tosip.replace('28677359939585145679', '1');
                    }

                    break;
                }
                case 'agent2user': {
                    var khs = await Abstract.search(Customer, { sodienthoai: body.tosip, zaloid: body.tosip });
                    if (khs) {
                        for (var k in khs) {
                            if (khs[k] && (khs[k].sodienthoai == body.tosip || khs[k].zaloid == body.tosip)) {
                                kh = khs[k];
                            }
                        }
                    }

                    if (breach && breach[body.fromsip]) {
                        breachsip = breach[body.fromsip];
                    }

                    if (!body.accountsip && body.fromsip && body.fromsip.startsWith('28677359939585145679')) {
                        body.accountsip = body.tosip.replace('28677359939585145679', '1');
                    }
                    break;
                }
            }

            if (body.accountsip) {
                nv = await Abstract.getOne(Employee, { accountsip: body.accountsip });
            }

            if (nv) {
                body.manv = nv.ma;
                body.tennv = nv.ten;
            }

            if (kh) {
                body.makh = kh.ma;
                body.tenkh = kh.ten;
            }

            if (breachsip) {
                body.breachsip = breachsip;
            }

            let historyCall = await Abstract.getOne(HistoryCall, params);
            if (!historyCall) {
                let resulft = await Abstract.add(HistoryCall, body);
                res.json(resulft);
            } else {
                let resulft = await Abstract.update(HistoryCall, body, params);
                res.json(resulft);
            }

        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    }
}