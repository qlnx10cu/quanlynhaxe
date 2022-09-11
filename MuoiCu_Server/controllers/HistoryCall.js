const HistoryCall = require("../models/HistoryCall");
const Employee = require('../models/Employee');
const Customer = require('../models/Customer');
const ChamSoc = require('../models/ChamSoc');
const ChiTietChamSoc = require('../models/ChiTietChamSoc');
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

            if (body.status != 0 && req.body.direction == 'agent2user' && kh) {
                try {
                    var chamsocs = await ChamSoc.bydate({ start: moment().subtract(5, 'days').format("YYYY/MM/DD"), end: moment().add(5, 'days').format("YYYY/MM/DD") })
                    var chamsoc = {};
                    if (chamsocs && chamsocs.length > 0) {
                        for (var k in chamsocs) {
                            if (chamsocs[k].sodienthoai == kh.sodienthoai || (kh.zaloid && chamsocs[k].zaloid == kh.zaloid)) {
                                chamsoc = chamsocs[k];
                            }
                        }
                    }
                    if (chamsoc && chamsoc.ma && chamsoc.trangthai < 2) {
                        if (body.status == 1) {
                            await Abstract.update(ChamSoc, { trangthai: 2, solangoi: chamsoc.solangoi + 1 }, { ma: chamsoc.ma });
                        } else {
                            await Abstract.update(ChamSoc, { trangthai: chamsoc.solangoi == 2 ? 3 : 1, solangoi: chamsoc.solangoi + 1 }, { ma: chamsoc.ma });
                        }
                        await Abstract.add(ChiTietChamSoc, { machamsoc: chamsoc.ma, callid: body.callid });
                    }
                } catch (ex) {
                }

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