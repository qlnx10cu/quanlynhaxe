const Bill = require("../models/Bill");
const BillSuachua = require("../models/BillSuachua");
const AbstractTwo = require("../models/AbstractTwo");
const Customer = require("../models/Customer");
const Option = require("../models/Option");
const Abstract = require('../models/Abstract');
const XLSX = require('xlsx');
const moment = require("moment");
const librespone = require("../lib/respone");
const email = require("../lib/email");
var exec = require('child_process').exec;
const utils = require("../lib/utils");
const { UV_FS_O_FILEMAP } = require("constants");
const ChamSoc = require("../models/ChamSoc");

module.exports = {

    getList: function (req, res) {
        return AbstractTwo.getList(Bill, BillSuachua, req.query, '', '', ' ORDER BY ngaythanhtoan desc, ma desc limit 2000');
    },
    getChitiet: function (req, res) {
        return BillSuachua.getChitiet(req.params.mahoadon);
    },
    getByMa: function (req, res) {
        return AbstractTwo.getOne(Bill, BillSuachua, Object.assign(req.params, req.query));
    },
    add: async function (req, res) {
        try {

            if (!req.body || !req.body.biensoxe && !req.body.sokhung && !req.body.somay) {
                librespone.error(req, res, "Phải có ít nhất biển số xe, hoặc số khung, hoặc số máy");
                return;
            }

            var makh = await Customer.addOrUpdateSuaChua(req.body);

            if (!makh) {
                librespone.error(req, res, "Không thể tạo khách hàng");
                return;
            }

            var mhd = await Option.incrementAndGet("masuachua") + '';
            var mahoadon = 'DV-' + mhd.padStart(8, '0');;
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
            bodybill['makh'] = makh
            bodybill['trangthai'] = 0;
            bodybill['loaihoadon'] = 0;
            bodybill['mahoadon'] = mahoadon;
            bodybill['ngayban'] = new Date();
            bodybill['ngaysuachua'] = new Date();
            bodybill['thoigianhen'] = utils.parseInteger(bodybill.thoigianhen);
            bodybill['ngayhen'] = utils.ngayHen(bodybill.thoigianhen);
            for (var k in detailbill) {
                detailbill[k]['mahoadon'] = mahoadon;
            }

            let resulft = await Abstract.add(Bill, bodybill);
            if (detailbill.length != 0)
                resulft = await Abstract.addMutil(BillSuachua, detailbill);
            await BillSuachua.giamSoLuongPhuTung(mahoadon);

            res.json({ "mahoadon": mahoadon });
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    update: async function (req, res) {
        try {
            if (!req.body || !req.body.biensoxe && !req.body.sokhung && !req.body.somay) {
                librespone.error(req, res, "Phải có ít nhất biển số xe, hoặc số khung, hoặc số máy");
                return;
            }

            if (!req.body.mahoadon) {
                librespone.error(req, res, "Không tồn tại mã hóa đơn");
                return;
            }

            var makh = await Customer.addOrUpdateSuaChua(req.body);

            if (!makh) {
                librespone.error(req, res, "Không thể tạo khách hàng");
                return;
            }

            let {
                mahoadon,
                chitiet,
                ...conlai
            } = req.body;

            var data = {};
            data.sodienthoai = req.body.sodienthoai;
            data.diachi = req.body.diachi;
            data.loaixe = req.body.loaixe;
            data.gioitinh = req.body.gioitinh;
            data.thanhpho = req.body.thanhpho;
            data.sokhung = req.body.sokhung;
            data.somay = req.body.somay;
            data.biensoxe = req.body.biensoxe;
            data.ten = req.body.tenkh;
            data.manvsuachua = req.body.manvsuachua;
            data.updatetime = new Date();
            var makh = req.body.makh;

            let hoaDon = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (hoaDon) {
                if (hoaDon.trangthai == 1 && !conlai.lydo) {
                    librespone.error(req, res, "Vui lòng nhập lý do hay đổi hóa đơn.");
                    return;
                }
                if (!makh && data.biensoxe) {
                    let r = await Abstract.getOne(Customer, { biensoxe: data.biensoxe });
                    if (r && r.biensoxe == data.biensoxe) {
                        makh = r.ma;
                        conlai['zaloid'] = r.zaloid;
                        conlai['loaixe'] = r.loaixe;
                    }
                }

                if (!makh) {
                    let r = await Abstract.add(Customer, data);
                    makh = r.insertId;
                    if (!r || r == null) {
                        librespone.error(req, res, "Kiểm tra lại thông tin khách hàng");
                        return;
                    }
                } else {
                    let r = await Abstract.update(Customer, data, { ma: makh, biensoxe: data.biensoxe });
                    if (!r || r == null) {
                        librespone.error(req, res, "Kiểm tra lại thông tin khách hàng");
                        return;
                    }
                }

                if (hoaDon.trangthai == 1) {
                    email.sendMail(req, res, "Update hóa đơn sữa chữa", "Hệ thống vừa update hoá đơn với mã " + mahoadon + "\nLý do:\n" + conlai.lydo);
                }
                var bodybill = conlai;
                bodybill['ngaysuachua'] = new Date();
                bodybill['thoigianhen'] = utils.parseInteger(bodybill.thoigianhen);
                bodybill['ngayhen'] = utils.ngayHen(bodybill.thoigianhen);
                var detailbill = chitiet;
                for (var k in detailbill) {
                    detailbill[k]['mahoadon'] = mahoadon;
                }
                var paramHoaDon = { mahoadon: mahoadon };
                await BillSuachua.tangSoLuongPhuTung(mahoadon);
                let resulft = await Abstract.update(Bill, bodybill, paramHoaDon);
                await BillSuachua.deleteMahoaDon(mahoadon);
                if (detailbill.length != 0)
                    resulft = await Abstract.addMutil(BillSuachua, detailbill);
                await BillSuachua.giamSoLuongPhuTung(mahoadon);

                if (hoaDon.trangthai == 1) {
                    var chamsoc = { ...bodybill };
                    delete chamsoc['trangthai'];
                    delete chamsoc['ma'];
                    await Abstract.update(ChamSoc, bodybill, { mahoadon: mahoadon });
                }

                res.json({ "mahoadon": mahoadon });
            } else {
                librespone.error(req, res, 'Không update được hóa đơn');
            }

        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    delete: function (req, res) {
        if (req.params.ma) {
            return "Không tồn tại mã hóa đơn";
        }
        return BillSuachua.delete(req.params.ma);
    },
    export: async function (req, res) {
        try {
            var ws_data = await Abstract.getOne(Bill, req.params);
            if (ws_data == null) {
                librespone.send(req, res, 'Khong tim thay mã hóa đơn ' + req.params.mahoadon);
                return;
            }


            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            });
            const page = await browser.newPage();
            await page.goto(`http://localhost:8080/billsuachua/mahoadon/${req.params.mahoadon}/exportbill`, {
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
        var ws_data = await BillSuachua.getChitiet(req.params.mahoadon);
     
        ws_data['tongtienpt'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.thanhtienpt, 0);
        ws_data['tongtiencong'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.thanhtiencong, 0);
        ws_data['tongtongtien'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tongtien, 0);
        ws_data['layout'] = false;
        if (!ws_data['tenkh'])
            ws_data['tenkh'] = ''


        res.render('exportsuachua', ws_data);
    },
    exportBillNew: async function (req, res) {
        var ws_data = await BillSuachua.getChitiet(req.params.mahoadon);
        if (ws_data == null) {
            librespone.send(req, res, 'Khong tim thay mã hóa đơn ' + req.params.mahoadon);
            return;
        }
        var cmd = 'D:\\hoctap\\ReadAndWriteFileExcel\\ReadAndWriteFileExcel\\bin\\Release\\ReadAndWriteFileExcel.exe suachua DV-000782 D:\\hoctap\\ReadAndWriteFileExcel\\ReadAndWriteFileExcel\\bin\\Release';

        await exec(cmd, function (error, stdout, stderr) {
            // command output is in stdout
            console.log(error)
            console.log(stdout)
            console.log(stderr)
        });

        res.json({ "mahoadon": req.params.mahoadon });

    },
}