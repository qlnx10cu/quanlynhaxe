const pool = require('./mysql');
const logger = require("../lib/logger");

function query(query, param) {
    logger.warn({ query: query, param: param });
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            connection.on('error', (error) => {
                try {
                    connection.release();
                } catch (ex) {

                }
                console.log(error);
                logger.error({ error: error, query: query, param: param });
                return reject(error);
            })

            if (param) {
                connection.on('query', function (query) {
                    console.log(query.sql);
                });
                connection.query(query, param, (error, rows) => {
                    try {
                        connection.release();
                    } catch (ex) {

                    }
                    if (error) return reject(error);
                    return resolve(rows);
                })
            } else {
                connection.query(query, (error, rows) => {
                    try {
                        connection.release();
                    } catch (ex) {

                    }
                    console.log(error);
                    if (error) return reject(error);
                    return resolve(rows);
                })
            }

        })
    })
}

module.exports = query;