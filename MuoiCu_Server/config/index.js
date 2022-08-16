module.exports = {
    database: {
        username: 'root',
        password: 'TrungTrang@Head123456!',
        database: process.env.DATABASE,
        host: process.env.HOST,
        limit: process.env.LIMIT
    },
    email: {
        enable: true,
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
    token_generator: {
        secret_key: process.env.secret_key,
        expires_in: process.env.expires_in
    },
    port: process.env.PORT,
    log: process.env.LOG,
}