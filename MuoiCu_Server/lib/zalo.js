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
                url: 'https://oauth.zaloapp.com/v4/oa/access_token',
                body: "grant_type=refresh_token&app_id=619166244360530229&refresh_token=" + refresh_token
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

        var template_data = {
            phone: phone,
            biensoxe: body.biensoxe,
            loaixe: body.loaixe,
            name: body.tenkh,
            tonghoadon: body.tongtien
        };

        var body =JSON.stringify({  phone: "84375310697", template_id: 231675, template_data: template_data, tracking_id: body.mahoadon });

        request.post({
            headers: {
                'Content-Type': 'application/json',
                'access_token': access_token
            },
            url: 'https://business.openapi.zalo.me/message/template',
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


