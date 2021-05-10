const winston = require('winston');
const path = require('path');
const moment = require('moment');
const config = require('../config');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const myFormat = printf(({ level, message, label, timestamp }) => {
    if (level == 'warn') {
        var str = `${moment(timestamp).format('HH:mm:ss DD-MM-YYYY')} : ${level} :${message.query} `
        if (message.param) {
            var param = JSON.stringify(message.param);
            if (param.length > 1000)
                param = param.substring(0, 1000);
            str = str + " - Data: " + param;
        }
        return str;
    }
    return `${moment(timestamp).format('HH:mm:ss DD-MM-YYYY')} : ${level} : ${message} `;
});
const log = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [

        new (winston.transports.Console)({
            level: 'error',
            colorize: true,
            timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
            formatter: options => `[${options.timestamp()}]: ${options.message || ''} `
        }),
        new (winston.transports.Console)({
            level: 'info',
            colorize: true,
            timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
            formatter: options => `[${options.timestamp()}]: ${options.message || ''} `
        }),
        new (winston.transports.DailyRotateFile)({
            filename: config.log+ '/log/info/quanlynhaxe-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '1GB',
            maxFiles: '1d',
            level: 'info',
        }),
        new (winston.transports.DailyRotateFile)({
            filename: config.log + '/log/error/quanlynhaxe-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '1GB',
            maxFiles: '1d',
            level: 'error',
        }),
        new (winston.transports.DailyRotateFile)({
            level: 'warn',
            filename: config.log + '/log/sql/sql-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '1GB',
            maxFiles: '1d'
        }),
    ]
});

module.exports = log;