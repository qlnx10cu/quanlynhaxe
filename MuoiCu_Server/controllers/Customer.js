const Customer = require("../models/Customer");
const Abstract = require("../models/Abstract");
const Employee = require("../models/Employee");

module.exports = {
    getList: async function (req, res, next) {
        try {
            let resulft = await Abstract.getList(Customer, req.query);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getByMa: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.getOne(Customer, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    add: async function (req, res, next) {
        try {
            let resulft = await Abstract.add(Customer, req.body);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    update: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query);
            let resulft = await Abstract.update(Customer, req.body, req.params);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    delete: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.delete(Customer, param);
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    chitiet: async function (req, res, next) {
        try {
            var param = Object.assign(req.params, req.query)
            let resulft = await Abstract.getOne(Customer, param);
            resulft["chitiet"] =await Customer.getChitiet(param.ma);
            for(var i=0; i<resulft["chitiet"].length;i++){
                var item=resulft["chitiet"][i];
                if(item.manvsuachua){
                    var param={ma:item.manvsuachua};
                    var nhanvien  = await Abstract.getOne(Employee, param);
                    item.tennvsuachua=nhanvien.ten;
                }
                console.log(item);
            }
            res.json(resulft);
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },

};