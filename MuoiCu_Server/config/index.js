function parseBool(name) {
    return name == 'true' ? true : false;
}

module.exports = {
    database: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.HOST,
        limit: process.env.LIMIT
    },
    email: {
        enable: parseBool(process.env.ENABLE_EMAIL),
        auth: {
            user: 'phanmem.ctytrungtrang@gmail.com',
            pass: 'Trungtrang123@'
        },
        option: {
            from: "phanmem.ctytrungtrang@gmail.com",
            to: "ctytrungtrang@gmail.com",
            cc: "dichvu.ctytrungtrang@gmail.com",
        }


    },
    zalo: {
        zns: parseBool(process.env.ENABLE_ZNS),
        zcc: parseBool(process.env.ENABLE_ZCC),
        oaDomain: process.env.ZALO_OA_DOMAIN,
        busDomain: process.env.ZALO_BUS_DOMAIN,
        appId: process.env.ZALO_APPID,

        secret_key: 'F2OX72FsA5QO8LE3w75D'
    },
    token_generator: {
        secret_key: process.env.secret_key,
        expires_in: process.env.expires_in
    },
    port: process.env.PORT,
    portApp: process.env.PORT_APP,
    log: process.env.LOG,
}