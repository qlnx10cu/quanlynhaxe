const logger = require("../lib/logger");

module.exports = {
    json: function (req, res, json) {
        try {
            var endTime = Date.now() - req.start;
            logger.info("RESPONSE:" + req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl + " with:" + req.start + " time:" + endTime);
        } catch {

        }
        try {
            res.status(200).json(json)
        } catch (ex) {

        }
    },
    success: function (req, res, mes) {
        try {
            var endTime = Date.now() - req.start;
            logger.info("SUCCESS:" + req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl + " with:" + req.start + " time:" + endTime);
        } catch (error) {

        }
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
            if (typeof (mes) == 'object') {
                mes = String(mes.message);
            } else {
                mes = String(mes);
            }
            var endTime = 0;
            try {
                endTime = Date.now() - req.start;
            } catch (error) {

            }

            logger.error("ERRROR:" + req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl + " with:" + req.start + " time:" + endTime + " -  " + mes);

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
            var endTime = Date.now() - req.start;
            logger.info("SEND:" + req.method + " " + req.protocol + '://' + req.get('host') + req.originalUrl + " with:" + req.start + " time:" + endTime);
        } catch {

        }
        try {
            res.status(200).json(data);
        } catch (ex) {

        }
    },
} 