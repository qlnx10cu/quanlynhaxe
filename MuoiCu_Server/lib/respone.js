const logger = require("../lib/logger");

module.exports = {
    success: function (req, res, mes) {
        res.status(200).json({
            success: {
                message: mes
            }
        })
    },
    error: function (req, res, mes) {
        logger.error(req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl + " -  " + mes);
        res.status(400).json({
            error: {
                message: mes
            }
        })
    },
    send: function (req, res, data) {
        res.status(200).json(data);
    },
} 