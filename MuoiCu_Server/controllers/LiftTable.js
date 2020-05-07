var liftTable = [];
for (var i = 0; i < 12; i++)
    liftTable[i] = { "trangthai": 0, "mahoadon": "", "biensoxe": "" };
liftTable[7]={"trangthai": 2, "mahoadon": "DV-883902", "biensoxe": "67B1-74455"}
module.exports = function (io) {
    io.on('connection', function (socket) {

        socket.on('connected', (data) => {
            socket.emit('connected', liftTable);
        });
        socket.on('maban', (data) => {
            socket.emit('mahoadon', liftTable[data]);
        });
        socket.on('select', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                liftTable[index].mahoadon = data.mahoadon;
                liftTable[index].biensoxe = data.biensoxe;
                liftTable[index].trangthai = 1;
                socket.emit('lifttable', liftTable);
                socket.broadcast.emit('lifttableFull', liftTable);
            } catch (e) {
            }
        })
        socket.on('bill', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                liftTable[index].mahoadon = data.mahoadon;
                liftTable[index].biensoxe = data.biensoxe;
                liftTable[index].trangthai = 2;
                socket.emit('lifttable', liftTable);
                socket.broadcast.emit('lifttableFull', liftTable);
            } catch (e) {
            }
        })
        socket.on('release', (data) => {
            try {
                let index = Number.parseInt(data.maban);
                liftTable[index].trangthai = 0;
                liftTable[index].mahoadon = "";
                liftTable[index].biensoxe = "";
                socket.emit('lifttableFull', liftTable);
                socket.broadcast.emit('lifttableFull', liftTable);
                socket.broadcast.emit('lifttableBill', liftTable);
            } catch (e) {

            }
        })
    })
}
