const logger = require("../lib/logger");
const config = require('../config');
const Option = require("../models/Option")
const utils = require("../lib/utils");
const Bill = require("../models/Bill");
const Customer = require("../models/Customer");
const Abstract = require('../models/Abstract');
const Webhook = require('../models/Webhook');

function parseBodyWebhook(body) {
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
	try {
		switch (body.event_name) {
			case 'user_click_chatnow':
			case 'oa_send_consent':
			case 'user_reply_consent':
				break;
			case 'follow':
			case 'unfollow':
				{
					data.userid = body.follower ? body.follower.id : '';
					break;
				}
			case 'user_received_message':
			case 'user_seen_message':
			case 'oa_send_text':
			case 'oa_send_image':
			case 'oa_send_list':
			case 'oa_send_gif':
				{
					data.oaid = body.sender ? body.sender.id : '';
					data.userid = body.recipient ? body.recipient.id : '';
					break;
				}
			case 'user_send_location':
			case 'user_send_image':
			case 'user_send_link':
			case 'user_send_text':
			case 'user_send_sticker':
			case 'user_send_gif':
			case 'user_send_audio':
			case 'user_submit_info':
			case 'user_send_video':
				{
					data.userid = body.sender ? body.sender.id : '';
					data.oaid = body.recipient ? body.recipient.id : '';
					break;
				}
		}
	} catch (ex) {

	}
	return data;
}
module.exports = {
	webhook: async function (req, res, next) {
		try {
			try {
				setTimeout(async function () {
					if (!req.body || !req.body.event_name) {
						return;
					}
					var body = req.body;
					var data = parseBodyWebhook(body);
					await Abstract.add(Webhook, data);

					switch (body.event_name) {
						case 'user_received_message': {
							if (body.recipient && body.message && body.message.tracking_id) {
								var hoadon = await Abstract.getOne(Bill, { mahoadon: body.message.tracking_id });
								if (hoadon && hoadon.makh) {
									await Abstract.update(Customer, { zaloid: body.recipient.id }, { ma: hoadon.makh });
								}
							}
							break;
						}
					}
				});
			} catch (ex) {

			}
			res.json({});
		} catch (error) {
			librespone.error(req, res, error.message);
		}
	}

};