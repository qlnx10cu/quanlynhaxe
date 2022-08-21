module.exports = {
    database: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.HOST,
        limit: process.env.LIMIT
    },
    email: {
        enable: process.env.ENABLE_EMAIL == 'true' ? true : false,
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