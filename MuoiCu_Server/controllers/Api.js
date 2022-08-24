const logger = require("../lib/logger");
const config = require('../config');
const Option = require("../models/Option")
const utils = require("../lib/utils");
const Abstract = require('../models/Abstract');
const Webhook = require('../models/Webhook');


module.exports = {
	webhook: async function (req, res, next) {
		try {
			try {
				setTimeout(async function () {
					if (!req.body || !req.body.event_name) {
						return;
					}
					var body = req.body;
					var data = {
						msg: JSON.stringify(body),
						time: new Date(),
						appid: body.app_id,
						oaid: body.oa_id,
						userid: body.user_id,
						useridbyapp: body.user_id_by_app,
						phone: body.phone,
						timestamp: body.timestamp,
						eventname: body.event_name
					}
					await Abstract.add(Webhook, data);
				});
			} catch (ex) {

			}
			res.json({});
		} catch (error) {
			librespone.error(req, res, error.message);
		}
	}

};