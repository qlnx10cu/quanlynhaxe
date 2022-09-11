const BanNang = require("../models/BanNang");
const Abstract = require("../models/Abstract");

async function getTable() {

    var liftTableBTC = [];
    for (var i = 0; i < 50; i++)
        liftTableBTC[i] = { "trangthai": 0, "mahoadon": "", "biensoxe": "" };
    let resulft = await Abstract.getList(BanNang);
    if (!resulft)
        return liftTableBTC;
    if (resulft.length > 50) {
        var size = resulft.length - 50;
        for (var i = 0; i < size; i++)
            liftTableBTC[i + 50] = { "trangthai": 0, "mahoadon": "", "biensoxe": "" };
    }
    for (var i = 0; i < resulft.length; i++) {
        if (resulft[i].ma > resulft.length - 1)
            continue;
        var index = resulft[i].ma;
        liftTableBTC[index].mahoadon = resulft[i].mahoadon ? resulft[i].mahoadon : "";
        liftTableBTC[index].trangthai = resulft[i].trangthai ? resulft[i].trangthai : 0;
        liftTableBTC[index].biensoxe = resulft[i].biensoxe ? resulft[i].biensoxe : "";
    }
    return liftTableBTC;
}
var liftTable = [];
getTable().then(value => {
    liftTable = value;
});

module.exports = function (io) {

    io.on('connection', function (socket) {

        socket.emit('connected', liftTable);

        socket.on('maban', (data) => {
            if (data >= liftTable.length)
                return;
            socket.emit('mahoadon', liftTable[data]);
        });
        socket.on('select', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                if (index < 0 || index >= liftTable.length)
                    return;
                if (liftTable[index].trangthai == 1 && !data.mahoadon) {
                    socket.emit('enter_lifttable_error', { message: `Bàn ${index + 1} đã có ai đó nhập`, liftTable: liftTable, maban: index });
                    return;
                }
                if (liftTable[index].trangthai == 0 && data.mahoadon) {
                    socket.emit('seen_lifttable_error', { message: `Bàn ${index + 1} đã hoàn thành`, liftTable: liftTable, maban: index });
                    return;
                }
                Abstract.update(BanNang, { mahoadon: data.mahoadon, biensoxe: data.biensoxe, trangthai: 1 }, { ma: index }).then(
                    () => {
                        liftTable[index].mahoadon = data.mahoadon;
                        liftTable[index].biensoxe = data.biensoxe;
                        liftTable[index].trangthai = 1;
                        socket.emit('lifttable', { liftTable: liftTable, maban: index });
                        socket.broadcast.emit('lifttableFull', liftTable);
                    }
                )
            } catch (e) { }
        })
        socket.on('bill', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                if (index < 0 || index >= liftTable.length)
                    return;
                Abstract.update(BanNang, { mahoadon: data.mahoadon, biensoxe: data.biensoxe, trangthai: 2 }, { ma: index }).then(
                    () => {
                        liftTable[index].mahoadon = data.mahoadon;
                        liftTable[index].biensoxe = data.biensoxe;
                        liftTable[index].trangthai = 2;
                        socket.emit('lifttableFull', liftTable);
                        socket.broadcast.emit('lifttableFull', liftTable);
                    });
            } catch (e) { }
        })
        socket.on('release', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                if (index < 0 || index >= liftTable.length)
                    return;
                Abstract.update(BanNang, { mahoadon: "", biensoxe: "", trangthai: 0 }, { ma: index }).then(
                    () => {
                        liftTable[index].trangthai = 0;
                        liftTable[index].mahoadon = "";
                        liftTable[index].biensoxe = "";
                        socket.emit('lifttableFull', liftTable);
                        socket.broadcast.emit('lifttableBill', { liftTable: liftTable, maban: index });
                    });
            } catch (e) {

            }
        })
        socket.on('update', () => {
            try {
                getTable().then(value => {
                    liftTable = value;
                });
            } catch (e) {

            }
        })
    })
}