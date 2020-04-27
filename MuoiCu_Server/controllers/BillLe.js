const Bill = require("../models/Bill");
const BillLe = require("../models/BillLe");
const AbstractTwo = require("../models/AbstractTwo");
const Abstract = require('../models/Abstract');
const librespone = require("../lib/respone");
const Employee = require("../models/Employee");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await AbstractTwo.getList(Bill, BillLe, req.query);
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
            let resulft = await AbstractTwo.getList(Bill, BillLe, param);
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
            var str = new Date().getTime().toString();
            var mahoadon = 'PT-' + str.substr(str.length - 8, str.length - 7);
            let {
                chitiet,
                ...conlai
            } = req.body;
            var bodybill = conlai;
            var detailbill = chitiet;
            bodybill['trangthai'] = 1;
            bodybill['loaihoadon'] = 1;
            bodybill['mahoadon'] = mahoadon;
            bodybill['ngaythanhtoan'] = new Date();
            bodybill['ngayban'] = new Date();
            for (var k in detailbill) {
                detailbill[k]['mahoadon'] = mahoadon;
            }
            let resulft = await Abstract.add(Bill, bodybill);
            resulft = await Abstract.addMutil(BillLe, detailbill);
            await BillLe.giamSoLuongPhuTung(detailbill);
            res.json({ "mahoadon": mahoadon });
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getChitiet: async function (req, res, next) {
        try {
            let resulft = await BillLe.getChitiet(req.params.mahoadon);
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
            let check = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (resulft && check) {
                var bodybill = conlai;
                bodybill['ngaysuachua'] = new Date();
                var detailbill = chitiet;
                for (var k in detailbill) {
                    detailbill[k]['mahoadon'] = mahoadon;
                }
                var paramHoaDon = { mahoadon: mahoadon };

                let resulft = await Abstract.update(Bill, bodybill, paramHoaDon);
                await BillLe.deleteMahoaDon(mahoadon);
                if (detailbill.length != 0) {
                    await BillLe.tangSoLuongPhuTung(resulft);
                    resulft = await Abstract.addMutil(BillLe, detailbill);
                    await BillLe.giamSoLuongPhuTung(detailbill);
                }
                res.json({ "mahoadon": mahoadon });
            } else
                librespone.error(req, res, 'Không update được hóa đơn');

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
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.delete(Bill, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    export: async function (req, res, next) {
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
            await page.goto(`http://localhost:8080/billle/mahoadon/${req.params.mahoadon}/exportbill`, {
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
        var ws_data = await BillLe.getChitiet(req.params.mahoadon);
        // var ws_data=getDataTmp();
        if (ws_data["manv"]) {
            try {
                var datanv = { ma: ws_data["manv"] };
                var nhanvien = await Abstract.getOne(Employee, datanv);
                ws_data["tennv"] = nhanvien.ten;
            } catch (ex) {

            }
        }
        if(!ws_data["tennv"]){
            ws_data["tennv"]=ws_data["manv"];
        }
        var chitiet = ws_data.chitiet;
        for (var i = 0; i < chitiet.length; i++) {
            chitiet[i].tongtien = parseInt(chitiet[i].dongia) * parseInt(chitiet[i].soluong)
        }
        ws_data['tongtien'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tongtien, 0);
        ws_data['layout'] = false;
        if (!ws_data['tenkh'])
            ws_data['tenkh'] = ''


        // console.log(ws_data)
        res.render('exportle', ws_data);
    },

    getDataTmp: function () {
        var ws_data = {
            "mahoadon": "PT-249923", "manv": "root", "manvsuachua": null, "diachi": "adjsklajdklas  adkj aljl ada da", "sodienthoai": "0123456789",
            "manvtiepnhan": null, "tenkh": "Anh Nguyên ", "makh": null, "biensoxe": null,
            "tongtien": 642000, "ngayban": "2020-04-23 13:56:32", "ngaythanhtoan": "2020-04-23 13:56:32",
            "trangthai": 1, "loaihoadon": 1, "ngaysuachua": "2020-04-22 23:56:32", "isdelete": 0, "yeucaukhachhang": null,
            "tuvansuachua": null, "sokm": 0, "chitiet": [
                {
                    "ma": 1, "mahoadon": "PT-249923", "maphutung": "06381KFM900",
                    "tenphutung": "Bộ thanh truyền", "dongia": 12637000, "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                },
                {
                    "ma": 2, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 3, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 4, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }, {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
                , {
                    "ma": 5, "mahoadon": "PT-249923", "maphutung": "06420KFL890", "tenphutung": "Nan hoa sau,trong 10x156", "dongia": 5000,
                    "soluong": 1, "ghichu": null, "chietkhau": 0, "nhacungcap": "Trung Trang"
                }
            ]
        };
        return ws_data;
    }

}