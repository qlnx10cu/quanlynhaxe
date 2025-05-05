const pool = require('./mysql');
const logger = require("../lib/logger");

function query(sql, params) {
    logger.warn({ query: sql, param: params });

    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) {
                logger.error({ error, query: sql, param: params });
                return reject(error);
            }
            resolve(results);
        });
    });
}

module.exports = query;