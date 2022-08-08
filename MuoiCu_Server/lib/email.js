var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const logger = require("../lib/logger");
const config = require('../config');

var transporter = nodemailer.createTransport(smtpTransport({
    pool: true,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: config.email.auth
}));

module.exports = {

    sendMail: function (req, res, subject, text) {
        if (!config.email.enable)
            return;

        var mailOptions = {
            from: config.email.option.from,
            to: config.email.option.to,
            cc: config.email.option.cc,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error("Send mail error:" + subject + " \nText: " + text + " by:" + error);
            } else {
                logger.info("Send mail success:" + subject + " \nText: " + text);
            }
        });
    }
}


