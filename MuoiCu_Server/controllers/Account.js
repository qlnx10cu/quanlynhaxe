const passport = require("passport");
const Account = require("../models/Account");
const checkValidDataForLogin = function (Username, Password) {
	let success = true;
	let error = {};
	if (!Username || Username.trim().length === 0) {
		success = false;
		error["Username"] = "Tài khoản không được để trống.";
	}
	if (!Password || Password.trim().length === 0) {
		success = false;
		error["Password"] = "Mật khẩu không được để trống.";
	}
	return {
		success,
		error
	};
};

module.exports = {
	login: async function (req, res, next) {
		const {
			Username,
			Password
		} = req.body;
		let valid = checkValidDataForLogin(Username, Password);
		if (!valid.success) {
			return res.status(400).json({
				error: valid.error
			});
		}
		passport.authenticate("local", async (err, data) => {
			if (err) {
				return res.status(401).json({
					error: {
						name: err.name,
						message: err.message
					}
				});
			}
			return res.json({
				token: data.token,
				role: data.role
			});
		})(req, res, next);
	},
	signup: async function (req, res, next) {
		const {
			Username,
			Password,
			Role,
			Name
		} = req.body;
		try {
			let account = new Account(Username, Password, Role, Name);

			console.log(account);
			let result = await account.save();
			return res.json({
				message: "success"
			});
		} catch (error) {
			if (error.name === 'MISSINGDATA') {
				res.status(400).json({
					error: {
						message: error.message
					}
				})
			}
			return res.status(500).json({
				error: {
					message: error.message
				}
			})
		}
	}
};