const Bill = require("../models/Bill");
const BillSuachua = require("../models/BillSuachua");
const AbstractTwo = require("../models/AbstractTwo");
const Customer = require("../models/Customer");
const Abstract = require('../models/Abstract');
const XLSX = require('xlsx');
const librespone = require("../lib/respone");

module.exports = {

    getList: async function(req, res, next) {
        try {
            let resulft = await AbstractTwo.getList(Bill, BillSuachua, req.query);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getChitiet: async function(req, res, next) {
        try {
            let resulft = await BillSuachua.getChitiet(req.params.mahoadon);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getByMa: async function(req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await AbstractTwo.getList(Bill, BillSuachua, param);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    add: async function(req, res, next) {
        try {
            if (!req.body.biensoxe) {
                librespone.error(req, res, "Không có biển số xe");
                return;
            }

            var str = new Date().getTime().toString();
            var mahoadon = 'DV-' + str.substr(str.length - 8, str.length - 7);
            var data = {};
            data.sodienthoai = req.body.sodienthoai;
            data.diachi = req.body.diachi;
            data.loaixe = req.body.loaixe;
            data.sokhung = req.body.sokhung;
            data.somay = req.body.somay;
            data.biensoxe = req.body.biensoxe;
            data.ten = req.body.tenkh;
            var makh = req.body.makh;
            console.log("ma khd", makh);

            if (!makh) {
                let r = await Abstract.add(Customer, data);
                makh = r.insertId;
                console.log(r.insertId);
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
            for (var k in detailbill) {
                detailbill[k]['mahoadon'] = mahoadon;
            }
            let resulft = await Abstract.add(Bill, bodybill);
            if (detailbill.length != 0)
                resulft = await Abstract.addMutil(BillSuachua, detailbill);
            res.json({ "mahoadon": mahoadon });
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    update: async function(req, res, next) {
        try {
            if (!req.body.mahoadon) {
                librespone.error(req, res, "Không tồn tại mã hóa đơn");
                return;
            }
            if (!req.body.biensoxe || !req.body.makh) {
                librespone.error(req, res, "Không có biển số xe");
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
            data.sokhung = req.body.sokhung;
            data.somay = req.body.somay;
            data.biensoxe = req.body.biensoxe;
            data.ten = req.body.tenkh;
            var makh = req.body.makh;
            console.log("ma khd", makh);

            if (!makh) {
                let r = await Abstract.add(Customer, data);
                makh = r.insertId;
                console.log(r.insertId);
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


            let check = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (check && check.trangthai == 0) {
                var bodybill = conlai;
                bodybill['ngaysuachua'] = new Date();
                var detailbill = chitiet;
                for (var k in detailbill) {
                    detailbill[k]['mahoadon'] = mahoadon;
                }
                var paramHoaDon = { mahoadon: mahoadon };
                let resulft = await Abstract.update(Bill, bodybill, paramHoaDon);
                await BillSuachua.deleteMahoaDon(mahoadon);
                if (detailbill.length != 0)
                    resulft = await Abstract.addMutil(BillSuachua, detailbill);
                res.json({ "mahoadon": mahoadon });
            } else
                librespone.error(req, res, 'Không update được hóa đơn');

        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    delete: async function(req, res, next) {
        try {
            let resulft = await BillSuachua.delete(req.params.ma);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    export: async function(req, res, next) {
        try {
            var ws_data = await Abstract.getOne(Bill, req.params);
            console.log(ws_data);
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
                scale: 0.58

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
    exportBill: async function(req, res, next) {
        var ws_data = await BillSuachua.getChitiet(req.params.mahoadon);
        console.log(ws_data);
        ws_data['tongtienpt'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.soluongphutung * cur.dongia, 0);
        ws_data['tongtiencong'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tiencong, 0);
        ws_data['tongtientong'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tongtien, 0);
        ws_data['layout'] = false;
        if (!ws_data['tenkh'])
            ws_data['tenkh'] = ''
        res.render('exportsuachua', ws_data);
    },
    // exportBill: async function (req, res, next) {
    // try {
    //     var workbook = XLSX.readFile(__dirname + '/excel/mausuachua.xlsx', {
    //         type: 'binary',
    //         cellDates: true, cellStyles: true, rowStyles: true, rowDates: true,bookVBA:true,cellFormula:true,
    //         codepage:true,cellFormula:true,cellNF:true,cellHTML:true,cellText:true,dateNF:true,
    //     });
    //     var sheet_name_list = workbook.Sheets[workbook.SheetNames[0]];
    //     var ws_data = await BillSuachua.getChitiet(req.params.mahoadon);
    //     var wb = XLSX.utils.book_new();
    //     var ws = { ...sheet_name_list };
    //     ws["!ref"] = "A1:AK70";
    //     // for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    //     //     // Example: Get second cell in each row, i.e. Column "B"
    //     //     const secondCell = ws[XLSX.utils.encode_cell({ r: rowNum, c: 1 })];
    //     //     // NOTE: secondCell is undefined if it does not exist (i.e. if its empty)
    //     //     console.log(secondCell); // secondCell.v contains the value, i.e. string or number
    //     // }
    //     var vitri = 25;
    //     ws["A8"] = { v: ws_data.tenkh, w: ws_data.tenkh, t: 's' };
    //     ws["AI2"] = { v: req.params.mahoadon, w: req.params.mahoadon, t: 's' };
    //     for (var i in ws_data.chitiet) {
    //         var dt = ws_data.chitiet[i];
    //         ws["B" + vitri] = { v: dt.tenphutungvacongviec, w: dt.tenphutungvacongviec, t: 's' };
    //         ws["O" + vitri] = { v: dt.dongia, w: dt.dongia, t: 's' };
    //         ws["U" + vitri] = { v: dt.soluongphutung, w: dt.soluongphutung, t: 'n' };
    //         ws["AE" + vitri] = { v: dt.tiencong, w: dt.tiencong, t: 'n' };
    //         vitri++;
    //     }
    //     XLSX.utils.book_append_sheet(wb, ws, "phieusuachua");
    //     res.setHeader('Content-disposition', 'attachment; filename=phieusuachua.xlsx');
    //     res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    //     res.send(new Buffer(wbout));

    // } catch (error) {
    //     librespone.send(req, res, error.message);
    // }

    // res.render('exportsuachua', {
    //     layout: false,
    //     tenkh: 'Nguyen Thang',
    //     sdt: '0984020261',
    //     diachi: 'ababababab',
    //     loaixe: 'aaaaaaaa',
    //     sokhung: 'bbbbbbbbb',
    //     'somay': 'cccccccc',
    //     'bienso': '123123',
    //     rows: [{
    //         ten: 'aaaa',
    //         mapt: '123123',
    //         dongia: 123123,
    //         sl: 1,
    //         tienpt: 123123,
    //         tiencong: 11111,
    //         tong: 11111
    //     },
    //     {
    //         ten: 'aaaa',
    //         mapt: '123123',
    //         dongia: 123123,
    //         sl: 1,
    //         tienpt: 123123,
    //         tiencong: 11111,
    //         tong: 11111
    //     }, {
    //         ten: 'aaaa',
    //         mapt: '123123',
    //         dongia: 123123,
    //         sl: 1,
    //         tienpt: 123123,
    //         tiencong: 11111,
    //         tong: 11111
    //     }
    //     ],
    //     tongtienpt: 123123,
    //     tongtiencong: 123123,
    //     tongtientong: 123123213
    // })
    // },
}