const Bill = require("../models/Bill");
const BillLe = require("../models/BillLe");
const AbstractTwo = require("../models/AbstractTwo");
const Abstract = require('../models/Abstract');
const librespone = require("../lib/respone");
const Option = require("../models/Option");
const Employee = require("../models/Employee");
const Customer = require("../models/Customer");
const email = require("../lib/email");
const config = require("../config");

module.exports = {
    getList: function (req, res) {
        return AbstractTwo.getList(Bill, BillLe, req.query, '', '', ' ORDER BY ngaythanhtoan desc, ma desc limit 2000');
    },
    getByMa: function (req, res) {
        return AbstractTwo.getOne(Bill, BillLe, Object.assign(req.params, req.query));
    },
    add: async function (req, res) {
        try {

            var prefix = config.typeserver === 0 ? 'PT' : 'BL';
            var makh = await Customer.addOrUpdateBanLe(req.body);
            var mhd = await Option.incrementAndGet(prefix + "-" + "mabanle") + '';
            var mahoadon = prefix + "-" + mhd.padStart(8, '0');
            let hoaDon = await Abstract.getOne(Bill, { mahoadon: mahoadon });

            if (hoaDon) {
                librespone.error(req, res, "Hóa đơn đã tồn tại vui lòng thủ lại.");
                return;
            }

            let {
                chitiet,
                ...conlai
            } = req.body;
            var bodybill = conlai;
            var detailbill = chitiet;
            bodybill['makh'] = makh;
            bodybill['trangthai'] = 1;
            bodybill['loaihoadon'] = 1;
            bodybill['mahoadon'] = mahoadon;
            bodybill['ngaythanhtoan'] = new Date();
            bodybill['ngaysuachua'] = bodybill['ngaythanhtoan'];
            bodybill['ngayban'] = bodybill['ngaythanhtoan'];
            for (var k in detailbill) {
                detailbill[k]['mahoadon'] = mahoadon;
            }
            let resulft = await Abstract.add(Bill, bodybill);
            resulft = await Abstract.addMutil(BillLe, detailbill);
            await BillLe.giamSoLuongPhuTung(detailbill);
            res.json({ "mahoadon": mahoadon });
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getChitiet: function (req, res) {
        if (!req.params.mahoadon) {
            return "Không tồn tại mã hóa đơn";
        }
        return BillLe.getChitiet(req.params.mahoadon);
    },
    update: async function (req, res) {
        try {
            if (!req.body.mahoadon) {
                librespone.error(req, res, "Không tồn tại mã hóa đơn");
                return;
            }
            let {
                mahoadon,
                chitiet,
                ...conlai
            } = req.body;
            let resulft = await AbstractTwo.getList(Bill, BillLe, { mahoadon: req.body.mahoadon });
            let hoaDon = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (resulft && hoaDon) {
                if (hoaDon.trangthai == 1 && !conlai.lydo) {
                    librespone.error(req, res, "Vui lòng nhập lý do hay đổi hóa đơn.");
                }
                var bodybill = conlai;
                bodybill['ngaysuachua'] = new Date();
                var detailbill = chitiet;
                for (var k in detailbill) {
                    detailbill[k]['mahoadon'] = mahoadon;
                }
                var paramHoaDon = { mahoadon: mahoadon };
                if (hoaDon.trangthai == 1) {
                    email.sendMail(req, res, "Update hóa đơn bán lẻ", "Hệ thống vừa update hoá đơn với mã " + mahoadon + "\nLý do:\n" + conlai.lydo);
                }
                let resulft1 = await Abstract.update(Bill, bodybill, paramHoaDon);
                await BillLe.deleteMahoaDon(mahoadon);
                await BillLe.tangSoLuongPhuTung(resulft);
                if (detailbill.length != 0) {
                    resulft1 = await Abstract.addMutil(BillLe, detailbill);
                    await BillLe.giamSoLuongPhuTung(detailbill);
                }
                res.json({ "mahoadon": mahoadon });
            } else {
                librespone.error(req, res, 'Không update được hóa đơn');
            }

        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    delete: function (req, res) {
        var param = Object.assign(req.params, req.query)
        var data = {};
        data['ngaysuachua'] = new Date();
        data["trangthai"] = 2;
        return BillLe.tangSoLuongPhuTungByMaHD(param.mahoadon)
            .then(() => Abstract.update(Bill, data, param));
    },
    export: async function (req, res) {
        try {
            // var ws_data = await Abstract.getOne(Bill, req.params);
            // if (ws_data == null) {
            //     librespone.send(req, res, 'Khong tim thay mã hóa đơn ' + req.params.mahoadon);
            //     return;
            // }


            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            });
            const page = await browser.newPage();
            await page.goto(`http://localhost:${config.port}/billle/mahoadon/${req.params.mahoadon}/exportbill`, {
                waitUntil: 'networkidle0'
            });
            var buffer = await page.pdf({
                format: 'A4',
                pageRanges: "1-1"
            });
            let fileName = 'hoadon' + req.params.mahoadon + '.pdf';
            res.setHeader('Content-disposition', 'inline; filename=' + fileName);
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
    },
    exportBill: async function (req, res) {
        var ws_data = await BillLe.getChitiet(req.params.mahoadon);
        // var ws_data=getDataTmp();
        if (!ws_data) {
            res.render('exportle', ws_data);
            return;
        }
        if (ws_data["manv"]) {
            try {
                var datanv = { ma: ws_data["manv"] };
                var nhanvien = await Abstract.getOne(Employee, datanv);
                if (nhanvien)
                    ws_data["tennv"] = nhanvien.ten;
            } catch (ex) {
                console.log("exportBill:" + ex.message)
            }
        }
        if (!ws_data["tennv"]) {
            ws_data["tennv"] = ws_data["manv"];
        }
        var chitiet = ws_data.chitiet;
        for (var i = 0; i < chitiet.length; i++) {
            chitiet[i].tongtien =
                parseInt(parseInt(chitiet[i].dongia) * parseInt(chitiet[i].soluong) * (1.0 - chitiet[i].chietkhau / 100) / 100) * 100
        }
        ws_data['tongtien'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tongtien, 0);
        ws_data['layout'] = false;
        if (!ws_data['tenkh'])
            ws_data['tenkh'] = ''


        // console.log(ws_data)
        res.render('exportle', ws_data);
    },

}