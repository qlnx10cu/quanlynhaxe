const Bill = require("../models/Bill");
const BillSuachua = require("../models/BillSuachua");
const AbstractTwo = require("../models/AbstractTwo");
const Customer = require("../models/Customer");
const Option = require("../models/Option");
const Abstract = require('../models/Abstract');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const moment = require("moment");
const librespone = require("../lib/respone");
const email = require("../lib/email");
var exec = require('child_process').exec;
const utils = require("../lib/utils");
const { UV_FS_O_FILEMAP } = require("constants");
const ChamSoc = require("../models/ChamSoc");
const config = require('../config');
const logger = require("../lib/logger");

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

            logger.info("Id: "+req.start+" BillSuaChua.add addOrUpdateSuaChua: ");

            var makh = await Customer.addOrUpdateSuaChua(req.body);

            if (!makh) {
                librespone.error(req, res, "Không thể tạo khách hàng");
                return;
            }

            logger.info("Id: "+req.start+" BillSuaChua.add incrementAndGet ");

            var prefix = config.typeserver == 0 ? 'DV' : 'MX';
            var mhd = await Option.incrementAndGet(prefix + "-" + "masuachua") + '';
            var mahoadon = prefix + '-' + mhd.padStart(8, '0');
            let hoaDon = await Abstract.getOne(Bill, { mahoadon: mahoadon });

            logger.info("Id: "+req.start+" BillSuaChua.add Bill.getOne ");

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

            logger.info("Id: "+req.start+" BillSuaChua.add Bill.bodybill ");
            let resulft = await Abstract.add(Bill, bodybill);
            if (detailbill.length != 0)
                resulft = await Abstract.addMutil(BillSuachua, detailbill);

            logger.info("Id: "+req.start+" BillSuaChua.add Bill.giamSoLuongPhuTung ");
            await BillSuachua.giamSoLuongPhuTung(mahoadon);
            logger.info("Id: "+req.start+" BillSuaChua.add done ");

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

            logger.info("Id: "+req.start+" BillSuaChua.update Customer.addOrUpdateSuaChua ");

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
            data.id_pin = req.body.id_pin;
            data.pin_health = req.body.pin_health;
            data.vehicle_type = req.body.vehicle_type;
            var makh = req.body.makh;

            logger.info("Id: "+req.start+" BillSuaChua.update Bill.getOne ");

            let hoaDon = await Abstract.getOne(Bill, { mahoadon: mahoadon });
            if (hoaDon) {
                if (hoaDon.trangthai == 1 && !conlai.lydo) {
                    librespone.error(req, res, "Vui lòng nhập lý do hay đổi hóa đơn.");
                    return;
                }
                logger.info("Id: "+req.start+" BillSuaChua.update Customer.getOne ");
                if (!makh && data.biensoxe) {
                    let r = await Abstract.getOne(Customer, { biensoxe: data.biensoxe });
                    if (r && r.biensoxe == data.biensoxe) {
                        makh = r.ma;
                        conlai['zaloid'] = r.zaloid;
                        conlai['loaixe'] = r.loaixe;
                    }
                }

                logger.info("Id: "+req.start+" BillSuaChua.update Customer.add ");
                if (!makh) {
                    let r = await Abstract.add(Customer, data);
                    makh = r.insertId;
                    if (!r || r == null) {
                        librespone.error(req, res, "Kiểm tra lại thông tin khách hàng");
                        return;
                    }
                } else {
                    logger.info("Id: "+req.start+" BillSuaChua.update Customer.update ");

                    let r = await Abstract.update(Customer, data, { ma: makh, biensoxe: data.biensoxe });
                    if (!r || r == null) {
                        librespone.error(req, res, "Kiểm tra lại thông tin khách hàng");
                        return;
                    }
                }

                logger.info("Id: "+req.start+" BillSuaChua.update sendMail");
                if (hoaDon.trangthai == 1) {
                    email.sendMail(req, res, "Update hóa đơn sửa chữa", "Hệ thống vừa update hoá đơn với mã " + mahoadon + "\nLý do:\n" + conlai.lydo);
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
                logger.info("Id: "+req.start+" BillSuaChua.update tangSoLuongPhuTung");

                await BillSuachua.tangSoLuongPhuTung(mahoadon);
                logger.info("Id: "+req.start+" BillSuaChua.update Bill.Abstract.update");
                
                let resulft = await Abstract.update(Bill, bodybill, paramHoaDon);

                logger.info("Id: "+req.start+" BillSuaChua.update BillSuachua.deleteMahoaDon");

                await BillSuachua.deleteMahoaDon(mahoadon);
                if (detailbill.length != 0)
                    resulft = await Abstract.addMutil(BillSuachua, detailbill);
                logger.info("Id: "+req.start+" BillSuaChua.update BillSuachua.giamSoLuongPhuTung");
                await BillSuachua.giamSoLuongPhuTung(mahoadon);

                if (hoaDon.trangthai == 1) {
                    var chamsoc = { ...bodybill };
                    delete chamsoc['trangthai'];
                    delete chamsoc['ma'];
                    logger.info("Id: "+req.start+" BillSuaChua.update ChamSoc.update");
                    await Abstract.update(ChamSoc, bodybill, { mahoadon: mahoadon });
                }
                logger.info("Id: "+req.start+" BillSuaChua.update done");
                res.json({ "mahoadon": mahoadon });
            } else {
                logger.info("Id: "+req.start+" BillSuaChua.update Không update được hóa đơn ");

                librespone.error(req, res, 'Không update được hóa đơn');
            }

        } catch (error) {
            logger.info("Id: "+req.start+" BillSuaChua.update error ");
            librespone.error(req, res, error.message);
        }
    },
    delete: function (req, res) {
        if (req.params.ma) {
            return "Không tồn tại mã hóa đơn";
        }
        logger.info("Id: "+req.start+" BillSuaChua.delete first");
        var res = BillSuachua.delete(req.params.ma);
        logger.info("Id: "+req.start+" BillSuaChua.delete done");
        return res;
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
            await page.goto(`http://localhost:${config.port}/billsuachua/mahoadon/${req.params.mahoadon}/exportbill`, {
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
    exportExcelNew: async function (req, res) {
        try {
            // Get bill details
            var ws_data = await BillSuachua.getChitiet(req.params.mahoadon);
            if (ws_data == null) {
                librespone.send(req, res, 'Khong tim thay mã hóa đơn ' + req.params.mahoadon);
                return;
            }

            // Calculate totals
            ws_data['tongtienpt'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.thanhtienpt, 0);
            ws_data['tongtiencong'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.thanhtiencong, 0);
            ws_data['tongtongtien'] = ws_data.chitiet.reduce((prev, cur) => prev += cur.tongtien, 0);

            // Load the template
            const workbook = new ExcelJS.Workbook();
            const templatePath = __dirname + '/../templates/Phieu_Sua_Chua.xlsx';
            await workbook.xlsx.readFile(templatePath);
            
            // Get worksheet by name or index
            let worksheet = null;
            if (workbook.worksheets && workbook.worksheets.length > 0) {
                worksheet = workbook.worksheets[0];
            }

            if (worksheet) {
                worksheet.getCell('AE5').value = ` STT: ${(ws_data.mahoadon || '')}`;
                worksheet.getCell('A7').value = `Tên khách hàng: ${(ws_data.tenkh || '').toUpperCase()}`;
                worksheet.getCell('A9').value = ws_data.vehicle_type ? `Loại xe: ${(ws_data.vehicle_type)}` : 'Loại xe:   Ga  /    Số   /   Côn tay   /  Xe Điện  /  Phân khối lớn';
                worksheet.getCell('AC6').value = ` ${ws_data.fuel_level || ''}`;
                worksheet.getCell('X10').value = `ID Pin ( Xe điện ): ${ws_data.id_pin || ''}`;
                worksheet.getCell('X11').value = `Sức khỏe PIN (SOH): ${ws_data.pin_health || ''}%`;
                worksheet.getCell('J7').value = `Địa chỉ hiện tại: ${([ws_data.diachi || '', ws_data.thanhpho || ''].filter(Boolean)).join(', ').toUpperCase()}`;
                worksheet.getCell('J9').value = `Số điện thoại: ${ws_data.sodienthoai || ''}`;
                worksheet.getCell('J10').value = `Số khung: ${ws_data.sokhung || ''}`;
                worksheet.getCell('J11').value = `Số Máy: ${ws_data.somay || ''}`;
                worksheet.getCell('A10').value = `Tên xe: ${ws_data.loaixe || ''}`;
                worksheet.getCell('A11').value = `Biển số: ${ws_data.biensoxe || ''}`;
                worksheet.getCell('I11').value = `${ws_data.sokm || ''}`;
                worksheet.getCell('X7').value = `Thời gian nhận xe: ${ws_data.ngayban ? utils.formatDate(ws_data.ngayban) : ''}`;
                worksheet.getCell('X8').value = `Thời gian trả xe dự kiến: ${ws_data.ngaydukien ? utils.formatDate(ws_data.ngaydukien) : ''}`;
                worksheet.getCell('X9').value = `Thời gian trả xe thực tế: ${ws_data.ngaythanhtoan ? utils.formatDate(ws_data.ngaythanhtoan) : ''}`;
                worksheet.getCell('A13').value = ws_data.yeucaukhachhang || '';
                worksheet.getCell('J13').value = ws_data.tuvansuachua || '';
                worksheet.getCell('N44').value = ws_data.kiemtralantoi || '';
                worksheet.getCell('AB44').value = ws_data.ngayhen ? moment(ws_data.ngayhen).format('DD/MM/YYYY') : '';
                worksheet.getCell('AE44').value = ws_data.sokmhen || '';
                worksheet.getCell('G43').value = `${ws_data.decline_reason || ''}`;
                worksheet.getCell('I46').value = `${ws_data.phone_accept || ''}`;
                // worksheet.getCell('AA57').value = ws_data.tennvsuachua || '';

                if(ws_data.old_parts_return_confirmed){
                    worksheet.getCell('J41').value = "";
                }else {
                    worksheet.getCell('H41').value = "";
                }

                switch (ws_data.motorbike_wash){
                    case 'Trước sửa chữa':
                        worksheet.getCell('AD13').value = 'V';
                        break;
                    case 'Sau sửa chữa':
                        worksheet.getCell('AD14').value = 'V';
                        break;
                    default:
                        worksheet.getCell('AD15').value = 'V';
                        break;
                }

                let startRow = 19;
                ws_data.chitiet.forEach((item, index) => {
                    const cellIndex = startRow + index;
                    const discount = parseInt(item.chietkhau || 0);
                    worksheet.getCell(`A${cellIndex}`).value = index + 1;
                    worksheet.getCell(`B${cellIndex}`).value = item.tenphutungvacongviec || '';
                    worksheet.getCell(`H${cellIndex}`).value = item.maphutung || '';
                    worksheet.getCell(`L${cellIndex}`).value = item.dongia || '';
                    worksheet.getCell(`O${cellIndex}`).value = item.soluongphutung || '';
                    worksheet.getCell(`Q${cellIndex}`).value = item.thanhtienpt || '';
                    worksheet.getCell(`Y${cellIndex}`).value = item.thanhtiencong || '';
                    worksheet.getCell(`AB${cellIndex}`).value = discount ? `${discount}%`:'';
                    worksheet.getCell(`AD${cellIndex}`).value = item.tongtien || '';
                    if(item.loaiphutung !== 'tiencong'){
                        worksheet.getCell(`J${cellIndex}`).value = 'V';
                        worksheet.getCell(`M${cellIndex}`).value = 'V';
                    }
                });

                // Fill in totals
                worksheet.getCell('Q38').value = ws_data.tongtienpt || 0; // Tổng tiền PT
                worksheet.getCell('Y38').value = ws_data.tongtiencong || 0; // Tổng tiền công
                worksheet.getCell('AD38').value = ws_data.tongtongtien || 0; // Tổng cộng
            }

            // Check if print parameter is true to return PDF, otherwise return Excel
            const isPrint = req.query.print === 'true';
            
            if (isPrint) {
                // Use LibreOffice to convert Excel to PDF
                const fs = require('fs');
                const path = require('path');
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                
                // Save the workbook temporarily
                const tempPath = path.join(__dirname, '/../temp/');
                if (!fs.existsSync(tempPath)) {
                    fs.mkdirSync(tempPath, { recursive: true });
                }
                const tempExcelFile = path.join(tempPath, `temp_${req.params.mahoadon}.xlsx`);
                const tempPdfFile = path.join(tempPath, `temp_${req.params.mahoadon}.pdf`);
                
                // Write the Excel file
                await workbook.xlsx.writeFile(tempExcelFile);
                
                // Convert to PDF using LibreOffice
                // Note: LibreOffice must be installed on the system
                // On macOS: /Applications/LibreOffice.app/Contents/MacOS/soffice
                // On Linux: libreoffice or soffice
                // On Windows: "C:\Program Files\LibreOffice\program\soffice.exe"
                
                let libreOfficeCmd;
                const platform = process.platform;
                
                if (platform === 'darwin') {
                    // macOS
                    libreOfficeCmd = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
                } else if (platform === 'linux') {
                    // Linux
                    libreOfficeCmd = 'libreoffice';
                } else if (platform === 'win32') {
                    // Windows
                    libreOfficeCmd = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
                } else {
                    throw new Error('Unsupported platform for LibreOffice conversion');
                }
                
                // Build the conversion command
                const convertCmd = `${libreOfficeCmd} --headless --convert-to pdf --outdir "${tempPath}" "${tempExcelFile}"`;
                
                try {
                    // Execute the conversion
                    await execPromise(convertCmd);
                    
                    // Read the generated PDF
                    const pdfBuffer = fs.readFileSync(tempPdfFile);
                    
                    // Clean up temp files
                    if (fs.existsSync(tempExcelFile)) {
                        fs.unlinkSync(tempExcelFile);
                    }
                    if (fs.existsSync(tempPdfFile)) {
                        fs.unlinkSync(tempPdfFile);
                    }
                    
                    // Set response headers for PDF viewing in browser
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `inline; filename=PhieuSuaChua_${req.params.mahoadon}.pdf`);
                    res.send(pdfBuffer);
                    
                } catch (conversionError) {
                    // Clean up temp files on error
                    if (fs.existsSync(tempExcelFile)) {
                        fs.unlinkSync(tempExcelFile);
                    }
                    if (fs.existsSync(tempPdfFile)) {
                        fs.unlinkSync(tempPdfFile);
                    }
                    
                    // If LibreOffice fails, provide helpful error message
                    throw new Error(`LibreOffice conversion failed: ${conversionError.message}. Please ensure LibreOffice is installed on the system.`);
                }
            } else {
                // Return Excel file
                const buffer = await workbook.xlsx.writeBuffer();
                
                // Set response headers for Excel download
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=PhieuSuaChua_${req.params.mahoadon}.xlsx`);
                res.send(buffer);
            }
            
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            });
        }
    },
}