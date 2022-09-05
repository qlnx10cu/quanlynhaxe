const logger = require("../lib/logger");
const config = require('../config');
const moment = require('moment');
const Option = require("../models/Option")
var request = require('request');
const utils = require("./utils");

var access_token = '';

module.exports = {

    init: async function () {


        this.updateAccessToken();


    },
    updateAccessToken: async function () {

        if (!config.zalo.zns && !config.zalo.zcc) {
            return;
        }

        access_token = '';

        let access_date = await Option.getValue("access_date");
        let refresh_token = await Option.getValue("refresh_token");
        let access_token_now = await Option.getValue("access_token");


        var dateCurrent = moment().format('YYYY-MM-DD');

        if (!access_token_now || !access_date || dateCurrent != access_date) {
            logger.info("Start Get Access Token: " + access_date);

            request.post({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'secret_key': config.zalo.secret_key
                },
                url: config.zalo.oaDomain,
                body: `grant_type=refresh_token&app_id=${config.zalo.appId}&refresh_token=${refresh_token}`
            }, function (error, response, body) {
                logger.info("Body Get Access Token: " + error + " body: " + body);
                try {
                    body = JSON.parse(body);
                } catch (ex) {
                    body = {};
                }
                if (body && body.access_token && body.refresh_token) {
                    logger.info("Update Access Token: " + dateCurrent);
                    Option.setValue('access_date', dateCurrent);
                    Option.setValue('access_token', body.access_token);
                    Option.setValue('refresh_token', body.refresh_token);

                    access_token = body.access_token;
                }
            });
        } else {
            access_token = access_token_now;
        }


        var cur = new Date();
        var dateNext = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
        dateNext.setHours(0);
        dateNext.setMinutes(10);

        setTimeout(function () {
            this.updateAccessToken();
        }.bind(this), dateNext - cur);


    },

    sendZNS_suachua: function (body) {
        if (!body || !config.zalo.zns)
            return false;
        var phone = utils.formatSDT(body.sodienthoai);
        if (!phone)
            return false;

        var template_id = 231675;
        var template_data = {
            phone: phone,
            biensoxe: body.biensoxe,
            loaixe: body.loaixe,
            name: body.tenkh,
            tonghoadon: body.tongtien
        };

        if (body.thoigianhen && body.thoigianhen > 0) {
            template_id = 232656;
            template_data['kiemtralantoi'] = body.kiemtralantoi;
            switch (body.thoigianhen) {
                case 5:
                    template_data['ngayhen'] = '5 ngày';
                    break;
                case 7:
                    template_data['ngayhen'] = '7 ngày';
                    break;
                case 10:
                    template_data['ngayhen'] = '10 ngày';
                    break;
                case 14:
                    template_data['ngayhen'] = '2 tuàn';
                    break;
                case 21:
                    template_data['ngayhen'] = '3 tuàn';
                    break;
                case 28:
                    template_data['ngayhen'] = '1 tháng';
                    break;
                case 91:
                    template_data['ngayhen'] = '3 tháng';
                    break;
                case 182:
                    template_data['ngayhen'] = '6 tháng';
                    break;
                case 364:
                    template_data['ngayhen'] = '1 năm';
                    break;
                default:
                    template_data['ngayhen'] = body.thoigianhen + ' ngày';
                    break;
            }
        }

        var body = JSON.stringify({ phone: phone, template_id: template_id, template_data: template_data, tracking_id: body.mahoadon });

        request.post({
            headers: {
                'Content-Type': 'application/json',
                'access_token': access_token
            },
            url: config.zalo.busDomain,
            body: body
        }, function (error, response, body) {
            logger.info("sendZNS_suachua: " + error + " body: " + body);
            try {
                body = JSON.parse(body);
            } catch (ex) {
                body = {};
            }

        });

    }
}


