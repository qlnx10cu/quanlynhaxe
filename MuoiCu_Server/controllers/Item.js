const Item = require("../models/Item");
const Abstract = require("../models/Abstract");
const librespone = require("../lib/respone");
const logger = require("../lib/logger");
const ItemHistory = require("../models/ItemHistory");

module.exports = {
    getList: function (req, res) {
        return Abstract.getList(Item, req.query);
    },
    getByMa: function (req, res) {
        return Item.getChiTiet(Object.assign(req.params, req.query));
    },
    add: function (req, res) {
        return Abstract.add(Item, { ...req.body });
    },
    update: function (req, res) {
        return Abstract.update(Item, req.body, req.params);
    },
    delete: function (req, res) {
        return Abstract.delete(Item, Object.assign(req.params, req.query));
    },
    deleteAll: function (req, res) {
        return Abstract.delete(Item, { loaiphutung: "phụ tùng" });
    },
    addMutil: function (req, res) {

        let body = {
            ...req.body
        }
        let timeindex = new Date().getTime();
        body.chitiet.map(e => {
            e.timeindex = timeindex;
            e.loai = 0;
            e.ngaycapnhap = new Date();
            return e;
        })

        return Abstract.addMutil(ItemHistory, body.chitiet)
            .then(() => ItemHistory.addLichSuPhuTung(timeindex))
            .then(() => Abstract.addMutil(Item, body.chitiet))
    },
};