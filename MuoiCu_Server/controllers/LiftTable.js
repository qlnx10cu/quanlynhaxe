const BanNang = require("../models/BanNang");
const Abstract = require("../models/Abstract");

async function getTable() {

    var liftTableBTC = [];
    for (var i = 0; i < 12; i++)
        liftTableBTC[i] = { "trangthai": 0, "mahoadon": "", "biensoxe": "" };
    let resulft = await Abstract.getList(BanNang);
    if (!resulft)
        return liftTableBTC;
    if (resulft.length > 12) {
        var size = resulft.length - 12;
        for (var i = 0; i < size; i++)
            liftTableBTC[i + 12] = { "trangthai": 0, "mahoadon": "", "biensoxe": "" };
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

module.exports = function(io) {

    io.on('connection', function(socket) {

        socket.on('connected', (data) => {
            socket.emit('connected', liftTable);
        });
        socket.on('maban', (data) => {
            socket.emit('mahoadon', liftTable[data]);
        });
        socket.on('select', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                Abstract.update(BanNang, { mahoadon: data.mahoadon, biensoxe: data.biensoxe, trangthai: 1 }, { ma: index }).then(
                    () => {
                        liftTable[index].mahoadon = data.mahoadon;
                        liftTable[index].biensoxe = data.biensoxe;
                        liftTable[index].trangthai = 1;
                        socket.emit('lifttable', liftTable);
                        socket.broadcast.emit('lifttableFull', liftTable);
                    }
                )
            } catch (e) {}
        })
        socket.on('bill', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                Abstract.update(BanNang, { mahoadon: data.mahoadon, biensoxe: data.biensoxe, trangthai: 2 }, { ma: index }).then(
                    () => {
                        liftTable[index].mahoadon = data.mahoadon;
                        liftTable[index].biensoxe = data.biensoxe;
                        liftTable[index].trangthai = 2;
                        socket.emit('lifttable', liftTable);
                        socket.broadcast.emit('lifttableFull', liftTable);
                    });
            } catch (e) {}
        })
        socket.on('release', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                Abstract.update(BanNang, { mahoadon: "", biensoxe: "", trangthai: 0 }, { ma: index }).then(
                    () => {
                        liftTable[index].trangthai = 0;
                        liftTable[index].mahoadon = "";
                        liftTable[index].biensoxe = "";
                        socket.emit('lifttableFull', liftTable);
                        socket.broadcast.emit('lifttableFull', liftTable);
                        socket.broadcast.emit('lifttableBill', liftTable);
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