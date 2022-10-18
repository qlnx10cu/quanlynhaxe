const utils = require("./utils");

module.exports = {
    parseFileRetail: function (workbook) {
        let data = [];
        for (let k in workbook.SheetNames) {
            if (k != "0") continue;
            const wsname = workbook.SheetNames[k];
            const ws = workbook.Sheets[wsname];
            const K = ws["!ref"].split(":")[1];
            const vitriK = utils.parseInt(K.substring(1, K.length));
            for (let i = 13; i <= vitriK; i++) {
                if (
                    (ws["B" + i] == null && ws["C" + i] == null) ||
                    ws["D" + i] == null ||
                    ws["D" + i].v == null ||
                    ws["E" + i] == null ||
                    ws["E" + i].v == null ||
                    ws["E" + i].v == 0
                )
                    continue;
                const dongia = utils.parseInt(ws["D" + i].v);
                const soluong = utils.parseInt(ws["E" + i].v);
                const chieukhau = ws["G" + i] ? parseFloat(ws["G" + i].v) : 0;

                const newData = {
                    tenphutung: ws["C" + i] ? ws["C" + i].v : "",
                    maphutung: ws["B" + i] ? ws["B" + i].v : "",
                    dongia: dongia,
                    soluong: soluong,
                    chietkhau: chieukhau * 100,
                    tongtien: (dongia - dongia * chieukhau) * soluong,
                    nhacungcap: "Trung Trang",
                };
                data.push(newData);
            }
        }
        return data;
    },
};
