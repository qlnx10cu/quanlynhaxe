module.exports = function (server) {
    const io = require('socket.io')(server, {
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    })
    return io;
}