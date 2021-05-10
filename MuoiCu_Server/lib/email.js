var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const logger = require("../lib/logger");

var transporter = nodemailer.createTransport(smtpTransport({
    pool: true,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'phanmem.ctytrungtrang@gmail.com',
        pass: 'Trungtrang123@'
    }
}));

module.exports = {
    
    sendMail: function (req, res, from, to, subject, text) {

        var mailOptions = {
            from: from,
            to: to,
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


