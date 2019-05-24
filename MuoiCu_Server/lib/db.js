const pool = require('./mysql');
const logger = require("../lib/logger");

function query(query, param) {
    logger.warn({ query: query, param: param });
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            if (param) {
                connection.on('query', function (query) {
                    console.log(query.sql);
                });
                connection.query(query, param, (error, rows) => {
                    connection.release();
                    if (error) return reject(error);
                    return resolve(rows);
                })
            } else {
                connection.query(query, (error, rows) => {
                    connection.release();
                    if (error) return reject(error);
                    return resolve(rows);
                })
            }
            connection.on('error', (error) => {
                connection.release();
                console.log(error);
                return reject(error);
            })

        })
    })
}

module.exports = query;