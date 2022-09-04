const logger = require("../lib/logger");

module.exports = {
    success: function (req, res, mes) {
        try {
            res.status(200).json({
                success: {
                    message: mes
                }
            })
        } catch (ex) {

        }
    },
    error: function (req, res, mes) {
        try {
            logger.error(req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl + " -  " + mes);
            res.status(400).json({
                error: {
                    message: mes
                }
            })
        } catch (ex) {

        }
    },
    send: function (req, res, data) {
        try {
            res.status(200).json(data);
        } catch (ex) {
            
        }
    },
} 