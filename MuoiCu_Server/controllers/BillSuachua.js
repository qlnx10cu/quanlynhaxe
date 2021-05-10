const Bill = require("../models/Bill");
const BillSuachua = require("../models/BillSuachua");
const AbstractTwo = require("../models/AbstractTwo");
const Customer = require("../models/Customer");
const Abstract = require('../models/Abstract');
const XLSX = require('xlsx');
const librespone = require("../lib/respone");
const email = require("../lib/email");
var exec = require('child_process').exec;

module.exports = {

    getList: async function (req, res, next) {
        try {
            let resulft = await AbstractTwo.getList(Bill, BillSuachua, req.query);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getChitiet: async function (req, res, next) {
        try {
            let resulft = await BillSuachua.getChitiet(req.params.mahoadon);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    getByMa: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await AbstractTwo.getList(Bill, BillSuachua, param);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    add: async function (req, res, next) {
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
            await BillSuachua.giamSoLuongPhuTung(mahoadon);
            res.json({ "mahoadon": mahoadon });
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    update: async function (req, res, next) {
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
            data.manvsuachua = req.body.manvsuachua;
            var makh = req.body.makh;

            let hoaDon = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (hoaDon) {
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
                    email.sendMail(req, res, "phanmem.ctytrungtrang@gmail.com", "taonuaa004@gmail.com", "Update hóa đơn sữa chữa", "Hệ thống vừa update hoá đơn với mã " + mahoadon + "\nLý do:\n" + conlai.lydo);
                }
                var bodybill = conlai;
                bodybill['ngaysuachua'] = new Date();
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
                res.json({ "mahoadon": mahoadon });
            } else
                librespone.error(req, res, 'Không update được hóa đơn');

        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    delete: async function (req, res, next) {
        try {
            let resulft = await BillSuachua.delete(req.params.ma);
            res.json(resulft);
        } catch (error) {
            librespone.error(req, res, error.message);
        }
    },
    export: async function (req, res, next) {
        try {
            // var ws_data={"mahoadon":"DV-260071","manv":1,"manvsuachua":55,"manvtiepnhan":null,"tenkh":"adas","makh":20,"biensoxe":"67p1-6","tongtien":6592340,"ngayban":"2019-12-15 23:06:47","ngaythanhtoan":"2019-12-15 23:06:54","trangthai":1,"loaihoadon":0,"ngaysuachua":"2019-12-15 23:06:47","isdelete":0,"yeucaukhachhang":"321312asdadsadadafsfdskfskdf;l  fk;dsfk ;ldskf;lds kfk ;kf;ls f","tuvansuachua":"safafdsaf [of[pdsof  [pof[psa ofdsof[p sof[ps","sokm":0,"ma":20,"ten":"adas","sodienthoai":"asdsa","diachi":"sadsa","loaixe":"adsa79798","sokhung":"asdasd","somay":"sadas","chitiet":[{"ma":159,"mahoadon":"DV-260071","tenphutungvacongviec":"ÉP MÂM","nhacungcap":null,"maphutung":"","soluongphutung":2,"dongia":170000,"tiencong":0,"tongtien":340000,"manvsuachua":55},{"ma":160,"mahoadon":"DV-260071","tenphutungvacongviec":"Cao su giảm chấn bánh xe","nhacungcap":null,"maphutung":"06410KWB600","soluongphutung":1,"dongia":33000,"tiencong":2100000,"tongtien":2133000,"manvsuachua":55},{"ma":161,"mahoadon":"DV-260071","tenphutungvacongviec":"Cao su giảm chấn bánh xe","nhacungcap":null,"maphutung":"06410KVV900","soluongphutung":1,"dongia":41800,"tiencong":0,"tongtien":41800,"manvsuachua":55},{"ma":162,"mahoadon":"DV-260071","tenphutungvacongviec":"Cao su giảm chấn bánh xe","nhacungcap":null,"maphutung":"06410KFL850","soluongphutung":4,"dongia":27500,"tiencong":0,"tongtien":110000,"manvsuachua":55},{"ma":163,"mahoadon":"DV-260071","tenphutungvacongviec":"Bộ má phanh sau","nhacungcap":null,"maphutung":"06430KVB950","soluongphutung":4,"dongia":154880,"tiencong":0,"tongtien":619520,"manvsuachua":55},{"ma":164,"mahoadon":"DV-260071","tenphutungvacongviec":"Bộ má phanh","nhacungcap":null,"maphutung":"06430GCE305","soluongphutung":3,"dongia":65230,"tiencong":0,"tongtien":195690,"manvsuachua":55},{"ma":165,"mahoadon":"DV-260071","tenphutungvacongviec":"Bộ má phanh dầu sau","nhacungcap":null,"maphutung":"06435K01902","soluongphutung":1,"dongia":413600,"tiencong":2100000,"tongtien":2513600,"manvsuachua":55},{"ma":166,"mahoadon":"DV-260071","tenphutungvacongviec":"Bộ má phanh","nhacungcap":null,"maphutung":"06430GCE305","soluongphutung":1,"dongia":65230,"tiencong":24000,"tongtien":89230,"manvsuachua":55},{"ma":167,"mahoadon":"DV-260071","tenphutungvacongviec":"BỘ GIOĂNG PÍT TÔNG NGÀM PHANH","nhacungcap":null,"maphutung":"06451443405","soluongphutung":1,"dongia":34100,"tiencong":0,"tongtien":34100,"manvsuachua":55},{"ma":168,"mahoadon":"DV-260071","tenphutungvacongviec":"BỘ GIOĂNG PISTON NGÀM PHANH","nhacungcap":null,"maphutung":"06451961405","soluongphutung":1,"dongia":19800,"tiencong":0,"tongtien":19800,"manvsuachua":55},{"ma":169,"mahoadon":"DV-260071","tenphutungvacongviec":"BỘ GIOĂNG PÍT TÔNG NGÀM PHANH","nhacungcap":null,"maphutung":"06451443405","soluongphutung":1,"dongia":34100,"tiencong":0,"tongtien":34100,"manvsuachua":55},{"ma":170,"mahoadon":"DV-260071","tenphutungvacongviec":"test 23","nhacungcap":null,"maphutung":"","soluongphutung":1,"dongia":20000,"tiencong":0,"tongtien":20000,"manvsuachua":55},{"ma":171,"mahoadon":"DV-260071","tenphutungvacongviec":"VỆ SINH BUỒNG ĐỐT","nhacungcap":null,"maphutung":"","soluongphutung":1,"dongia":100000,"tiencong":0,"tongtien":100000,"manvsuachua":55},{"ma":172,"mahoadon":"DV-260071","tenphutungvacongviec":"test 23","nhacungcap":null,"maphutung":"","soluongphutung":1,"dongia":20000,"tiencong":0,"tongtien":20000,"manvsuachua":55},{"ma":173,"mahoadon":"DV-260071","tenphutungvacongviec":"test 23","nhacungcap":null,"maphutung":"","soluongphutung":1,"dongia":20000,"tiencong":0,"tongtien":20000,"manvsuachua":55},{"ma":174,"mahoadon":"DV-260071","tenphutungvacongviec":"Nan hoa sau,trong 10x156","nhacungcap":null,"maphutung":"06420KFL890","soluongphutung":1,"dongia":3300,"tiencong":0,"tongtien":3300,"manvsuachua":55},{"ma":175,"mahoadon":"DV-260071","tenphutungvacongviec":"ÉP MÂM","nhacungcap":null,"maphutung":"","soluongphutung":1,"dongia":170000,"tiencong":0,"tongtien":170000,"manvsuachua":55},{"ma":176,"mahoadon":"DV-260071","tenphutungvacongviec":"test 23","nhacungcap":null,"maphutung":"","soluongphutung":3,"dongia":20000,"tiencong":0,"tongtien":60000,"manvsuachua":55},{"ma":177,"mahoadon":"DV-260071","tenphutungvacongviec":"BỘ GIOĂNG PÍT TÔNG NGÀM PHANH","nhacungcap":null,"maphutung":"06451443405","soluongphutung":1,"dongia":34100,"tiencong":0,"tongtien":34100,"manvsuachua":55},{"ma":178,"mahoadon":"DV-260071","tenphutungvacongviec":"BỘ GIOĂNG PÍT TÔNG NGÀM PHANH","nhacungcap":null,"maphutung":"06451443405","soluongphutung":1,"dongia":34100,"tiencong":0,"tongtien":34100,"manvsuachua":55}]}
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
    exportBill: async function (req, res, next) {
        var ws_data = await BillSuachua.getChitiet(req.params.mahoadon);
        // var ws_data = {
        //     "mahoadon": "DV-260071", "manv": 1, "manvsuachua": 55, "manvtiepnhan": null, "tennvsuachua": "Nguyễn Đức Cường"
        //     "tenkh": "adas", "makh": 20, "biensoxe": "67p1-6", "tongtien": 6592340,
        //     "ngayban": "2019-12-15 23:06:47", "ngaythanhtoan": "2019-12-15 23:06:54", "trangthai": 1,
        //     "loaihoadon": 0, "ngaysuachua": "2019-12-15 23:06:47", "isdelete": 0,
        //     "yeucaukhachhang": "321312asdadsakdf;l  fk;dsfk ;ldskf;lds kfk ;kf;ls f1312asdadsadadafsfdskfskdf;l  fk;dsfk ;ldskf;lds kfk ;1312asdadsadadafsfdskfskdf;l  fk;dsfk ;12asdadsadadafsfdskfskdf;l  fk;dsfk ;ldskf;lds kfk ;1312asdadsadadafsfdskfskdf;l  fk;dsfk ldskf;lds kfk ;",
        //     "tuvansuachua": "safafdsaf [of[pdsof  [pof[ps321312asdadsakdf;l  fk;dsfk ;ldskf;lds kfk ;kf;ls f1312asdadsadadafsfdskfskdf;l  fk;dsfk ;ldskf;lds321312asdadsakdf;l  fk;dsfk ;ldskf;lds kfk ;kf;ls f1312asdadsadadafsfdskfskdf;l  fk;dsfk ;ldskf;ldsa ofdsof[p sof[ps",
        //     "sokm": 0, "ma": 20, "ten": "adas", "sodienthoai": "asdsa", "diachi": "sadsa sajdkl sajdklsa jda sldjsakl djsakldj ladsajsakld jskladjsakld jsakl adjskla jdsla",
        //     "loaixe": "adsa79798", "sokhung": "asdasd", "somay": "sadas", "chitiet": [
        //         { "ma": 159, "mahoadon": "DV-260071", "tenphutungvacongviec": "ÉP MÂM", "chietkhau": 0, "nhacungcap": null, "maphutung": "", "soluongphutung": 2, "dongia": 170000, "tiencong": 0, "tongtien": 340000, "manvsuachua": 55 }, { "ma": 160, "mahoadon": "DV-260071", "tenphutungvacongviec": "Cao su giảm chấn bánh xe", "nhacungcap": null, "maphutung": "06410KWB600", "soluongphutung": 1, "dongia": 33000, "chietkhau": 100, "tiencong": 2100000, "tongtien": 2133000, "manvsuachua": 55 }, { "ma": 161, "mahoadon": "DV-260071", "tenphutungvacongviec": "Cao su giảm chấn bánh xe", "nhacungcap": null, "chietkhau": 10, "maphutung": "06410KVV900", "soluongphutung": 1, "dongia": 41800, "tiencong": 0, "tongtien": 41800, "manvsuachua": 55 }, { "ma": 162, "mahoadon": "DV-260071", "tenphutungvacongviec": "Cao su giảm chấn bánh xe", "nhacungcap": null, "maphutung": "06410KFL850", "soluongphutung": 4, "dongia": 27500, "tiencong": 0, "tongtien": 110000, "manvsuachua": 55 }, { "ma": 163, "mahoadon": "DV-260071", "tenphutungvacongviec": "Bộ má phanh sau", "nhacungcap": null, "maphutung": "06430KVB950", "soluongphutung": 4, "dongia": 154880, "tiencong": 0, "tongtien": 619520, "manvsuachua": 55 }, { "ma": 164, "mahoadon": "DV-260071", "tenphutungvacongviec": "Bộ má phanh", "nhacungcap": null, "maphutung": "06430GCE305", "soluongphutung": 3, "dongia": 65230, "tiencong": 0, "tongtien": 195690, "manvsuachua": 55 }, { "ma": 165, "mahoadon": "DV-260071", "tenphutungvacongviec": "Bộ má phanh dầu sau", "nhacungcap": null, "maphutung": "06435K01902", "soluongphutung": 1, "dongia": 413600, "tiencong": 2100000, "tongtien": 2513600, "manvsuachua": 55 }, { "ma": 166, "mahoadon": "DV-260071", "tenphutungvacongviec": "Bộ má phanh", "nhacungcap": null, "maphutung": "06430GCE305", "soluongphutung": 1, "dongia": 65230, "tiencong": 24000, "tongtien": 89230, "manvsuachua": 55 }, { "ma": 167, "mahoadon": "DV-260071", "tenphutungvacongviec": "BỘ GIOĂNG PÍT TÔNG NGÀM PHANH", "nhacungcap": null, "maphutung": "06451443405", "soluongphutung": 1, "dongia": 34100, "tiencong": 0, "tongtien": 34100, "manvsuachua": 55 }, { "ma": 168, "mahoadon": "DV-260071", "tenphutungvacongviec": "BỘ GIOĂNG PISTON NGÀM PHANH", "nhacungcap": null, "maphutung": "06451961405", "soluongphutung": 1, "dongia": 19800, "tiencong": 0, "tongtien": 19800, "manvsuachua": 55 }, { "ma": 169, "mahoadon": "DV-260071", "tenphutungvacongviec": "BỘ GIOĂNG PÍT TÔNG NGÀM PHANH", "nhacungcap": null, "maphutung": "06451443405", "soluongphutung": 1, "dongia": 34100, "tiencong": 0, "tongtien": 34100, "manvsuachua": 55 }, { "ma": 170, "mahoadon": "DV-260071", "tenphutungvacongviec": "test 23", "nhacungcap": null, "maphutung": "", "soluongphutung": 1, "dongia": 20000, "tiencong": 0, "tongtien": 20000, "manvsuachua": 55 }, { "ma": 171, "mahoadon": "DV-260071", "tenphutungvacongviec": "VỆ SINH BUỒNG ĐỐT", "nhacungcap": null, "maphutung": "", "soluongphutung": 1, "dongia": 100000, "tiencong": 0, "tongtien": 100000, "manvsuachua": 55 }, { "ma": 172, "mahoadon": "DV-260071", "tenphutungvacongviec": "test 23", "nhacungcap": null, "maphutung": "", "soluongphutung": 1, "dongia": 20000, "tiencong": 0, "tongtien": 20000, "manvsuachua": 55 }, { "ma": 173, "mahoadon": "DV-260071", "tenphutungvacongviec": "test 23", "nhacungcap": null, "maphutung": "", "soluongphutung": 1, "dongia": 20000, "tiencong": 0, "tongtien": 20000, "manvsuachua": 55 }, { "ma": 174, "mahoadon": "DV-260071", "tenphutungvacongviec": "Nan hoa sau,trong 10x156", "nhacungcap": null, "maphutung": "06420KFL890", "soluongphutung": 1, "dongia": 3300, "tiencong": 0, "tongtien": 3300, "manvsuachua": 55 }, { "ma": 175, "mahoadon": "DV-260071", "tenphutungvacongviec": "ÉP MÂM", "nhacungcap": null, "maphutung": "", "soluongphutung": 1, "dongia": 170000, "tiencong": 0, "tongtien": 170000, "manvsuachua": 55 }, { "ma": 176, "mahoadon": "DV-260071", "tenphutungvacongviec": "test 23", "nhacungcap": null, "maphutung": "", "soluongphutung": 3, "dongia": 20000, "tiencong": 0, "tongtien": 60000, "manvsuachua": 55 }, { "ma": 177, "mahoadon": "DV-260071", "tenphutungvacongviec": "BỘ GIOĂNG PÍT TÔNG NGÀM PHANH", "nhacungcap": null, "maphutung": "06451443405", "soluongphutung": 1, "dongia": 34100, "tiencong": 0, "tongtien": 34100, "manvsuachua": 55 }, { "ma": 178, "mahoadon": "DV-260071", "tenphutungvacongviec": "BỘ GIOĂNG PÍT TÔNG NGÀM PHANH", "nhacungcap": null, "maphutung": "06451443405", "soluongphutung": 1, "dongia": 34100, "tiencong": 0, "tongtien": 34100, "manvsuachua": 55 }]
        // }

        var chitiet = ws_data.chitiet;
        for (var i = 0; i < chitiet.length; i++) {
            var chietkhau = chitiet[i].chietkhau ? parseInt(chitiet[i].chietkhau) : 0;
            chietkhau = 100 - chietkhau;
            chitiet[i].tinhtien = Math.round(chietkhau * parseInt(chitiet[i].dongia) * parseInt(chitiet[i].soluongphutung)) / 100;
        }
        ws_data['tongtienpt'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tinhtien, 0);
        ws_data['tongtiencong'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tiencong, 0);
        ws_data['tongtongtien'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tongtien, 0);
        ws_data['layout'] = false;
        if (!ws_data['tenkh'])
            ws_data['tenkh'] = ''


        res.render('exportsuachua', ws_data);
    },
    exportBillNew: async function (req, res, next) {
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