module.exports = {
    database: {
        username: 'root',
        password: '',
        database: process.env.DATABASE,
        host: process.env.HOST,
        limit: process.env.LIMIT
    },
    token_generator: {
        secret_key: process.env.secret_key,
        expires_in: process.env.expires_in
    },
    port: process.env.PORT,
    log:process.env.LOG,
}