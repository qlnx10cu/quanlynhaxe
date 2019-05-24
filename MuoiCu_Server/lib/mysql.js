const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool({
    connectionLimit: config.database.limit,
    host: config.database.host,
    user: config.database.username,
    // user: 'wxce9ubz69vjtzw8',
    password: config.database.password,
    database: config.database.database,
    port: 3306,
    dateStrings: true
})

// const pool = mysql.createPool({
//     connectionLimit:100,
//     host: 'localhost',
//     user: 'root',
//     password: 'admin',
//     database: 'quanlynhaxe',
//     port: 3306,
//     dateStrings: true
// })
// PORT=8080
// USERNAME=wxce9ubz69vjtzw8
// PASSWORD=w5ta4u93pno9lfsm
// DATABASE=fkw98e39nd868e3f
// HOST=edo4plet5mhv93s3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com
// LIMIT=10
// secret_key=secret_key
// expires_in=2h
// LOG=/data/

module.exports = pool;