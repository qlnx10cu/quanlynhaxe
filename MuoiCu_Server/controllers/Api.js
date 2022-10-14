const logger = require("../lib/logger");
const config = require('../config');
const Option = require("../models/Option")
const utils = require("../lib/utils");
const librespone = require("../lib/respone");
const Bill = require("../models/Bill");
const Account = require("../models/Account");
const Customer = require("../models/Customer");
const Abstract = require('../models/Abstract');
const Webhook = require('../models/Webhook');
const ChamSoc = require("../models/ChamSoc");
const zalo = require("../lib/zalo");

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
					if (body.recipient) {
						if (String(body.recipient.id).length < 12) {
							data.phone = body.recipient.id;
						}
						else {
							data.userid = body.recipient.id;
						}
					}
					if (body.message) {
						data.msg_id = body.message.msg_id;
					}
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
							if (!body.recipient || body.message)
								break;
							if (body.message.tracking_id) {
								var hoadon = await Abstract.getOne(Bill, { mahoadon: body.message.tracking_id });
								if (hoadon && hoadon.makh && data.zaloid) {
									await Abstract.update(Customer, { zaloid: data.zaloid }, { ma: hoadon.makh });
									await Abstract.update(ChamSoc, { zaloid: data.zaloid }, { mahoadon: hoadon.mahoadon });
								}
							} else if (data.msg_id) {
								const zaloid = body.recipient.id;
								var kh = await Abstract.getOne(Customer, { zaloid });
								if (kh && kh.zaloid == zaloid) {
									break;
								}

								var resMsg = await zalo.getMessageConversation(zaloid);
								if (resMsg && resMsg.data && Array.isArray(resMsg.data)) {
									var dataMsg = resMsg.data;
									for (var i in dataMsg) {
										const msg = dataMsg[i];
										if (msg.message_id) continue;

										var wh = await Abstract.getOne(Webhook, { msg_id: msg.message_id });
										if (!wh) continue

										var mahoadon = JSON.parse(wh.msg).message.tracking_id;
										var hoadon = await Abstract.getOne(Bill, { mahoadon: mahoadon });
										if (hoadon) {
											if (hoadon.makh) {
												await Abstract.update(Customer, { zaloid: body.recipient.id }, { ma: hoadon.makh });
											}
											await Abstract.update(ChamSoc, { zaloid: body.recipient.id }, { mahoadon: hoadon.mahoadon });
										}
									}
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
	},
	accountsip: async function (req, res, next) {
		try{
			const params = Object.assign(req.params, req.query);
			const acc = await Abstract.getOne(Account,params);
			if (!acc  || !acc.username || acc.username != params.username) {
				librespone.error(req, res, "Not found account");
				return;
			}
			if (!acc.accountsip) {
				librespone.error(req, res, "Bạn không có quyền gọi điện");
				return;
			}
			const config = {
				id: acc.username,
				label : acc.ten,
				server: 'callcenter.trungtrang.com',
				proxy: '',
				domain: 'callcenter.trungtrang.com',
				authID: acc.accountsip,
				username: acc.accountsip,
				password: "TrungTrang@",
			};

			res.json(config);
		}catch(ex){
			console.log('err: ', ex);
			librespone.error(req, res, ex);
		}
	}

};