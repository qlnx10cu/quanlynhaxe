const passport = require("passport");
const ChamCong = require("../models/ChamCong");
const Statistic = require("../models/Statistic");
const Abstract = require("../models/Abstract");
const librespone = require("../lib/respone");



module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.getList(ChamCong, req.query);
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
            let resulft = await Abstract.getOne(ChamCong, param);
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
            var body = req.body.chitiet;
            var ngay = new Date();
            body = body.map(e => ({ ...e, "ngay": ngay }));
            let resulft = await Abstract.addMutil(ChamCong, body);
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
            let resulft = await Abstract.add(ChamCong, req.body, req.params);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    delete: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.delete(ChamCong, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getByNgay: async function (req, res, next) {
        try {
            var ngay = new Date();
            if (req.params.ngay)
                ngay = new Date(req.params.ngay);
            // var mdy = praram.split('-');
            // praram = new Date(mdy[2], mdy[1], mdy[0]);
            let resulft = await Statistic.getBangCong(ngay);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    addChamCong: async function (req, res, next) {
        try {
            if (!req.params.ngay || new Date(req.params.ngay) > new Date())
                librespone.error(req, res, "Không thể chấm công hơn ngày");
            var ngay = new Date(req.params.ngay)

            let resulft = await Statistic.addBangCong(ngay, req.body.chitiet);
            if (resulft == null)
                res.status(400).json({
                    error: {
                        message: "Không thể insert database"
                    }
                })
            else
                res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getExeclBangCongEmployee: async function (req, res, next) {
        try {
            var param = {};
            if (req.query.start) {
                param.start = req.query.start;
            }
            else
                param.start = new Date();
            if (req.query.end)
                param.end = req.query.end;
            else
                param.end = new Date();
            let resulft = await Statistic.getBangCongEmployee(param);


            var currDate = moment(param.start).startOf('day');
            var lastDate = moment(param.end).startOf('day');

            while (currDate.add(1, 'days').diff(lastDate) < 0) {
                console.log(currDate.toDate());
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
    test: async function (req, res, next) {
        try {
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle0' });
            var buffer = await page.pdf({
                format: 'A4'
            });
            let fileName = 'heelo.pdf';
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.type('application/pdf');
            res.send(buffer);
            await browser.close();
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    }

}; 
