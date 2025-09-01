var moment = require('moment');
require("moment/locale/vi");

module.exports = {

    normalizeStr: function (value) {
        if (value && value != '')
            return value;
        return null;
    },
    parseInteger: function (value) {
        try {
            if (!value)
                return 0;
            return parseInt(value);
        } catch (error) {

        }
        return 0;
    },
    ngayHen: function (thoigianhen) {
        try {
            if (thoigianhen != 0) {
                return moment().add(thoigianhen, 'days').format("YYYY-MM-DD");
            }
        } catch (error) {

        }
        return "";
    },
    formatSDT: function (sdt) {
        try {
            if (!sdt)
                return "";
            sdt = sdt + "";
            if (sdt.startsWith("+84")) {
                sdt = "0" + sdt.substring(3);
            }
            if (sdt.startsWith("84")) {
                sdt = "0" + sdt.substring(2);
            }
            if (sdt.length != 10 || !sdt.startsWith("0"))
                return "";
            return sdt;
        } catch (ex) {

        }

    },
    formatSDTNew: function (sdt) {
        try {
            if (!sdt)
                return "";
            sdt = sdt + "";
            if (sdt.startsWith("+84")) {
                sdt = "84" + sdt.substring(3);
            }
            if (sdt.startsWith("0")) {
                sdt = "84" + sdt.substring(1);
            }
            if (sdt.length != 11 || !sdt.startsWith("84"))
                return "";
            return sdt;
        } catch (ex) {

        }

    },
    compareSDT: function (sdt1, sdt2) {
        try {
            if (!sdt1 || !sdt2)
                return false;
            sdt1 = this.formatSDT(sdt1);
            sdt2 = this.formatSDT(sdt2);
            if (!sdt1 || !sdt2 || sdt1 != sdt2)
                return false;
            return true;
        } catch (error) {

        }
    },
    parseInt: function (val, def, max) {
        try {
            def = def || 0;
            const res = parseInt(val) || def;
            if (max !== undefined && max != null && res > max) return max;
            if (res < 0) return def || 0;
            if (!String(val).includes(".") && String(res).trim() != String(val).trim()) return def;
            return res;
        } catch (ex) {}

        return def;
    },
    formatVND: function (tien) {
        return this.parseInt(tien).toLocaleString("vi-VI", {
            style: "currency",
            currency: "VND",
        });
    },
    formatDate: function (date) {
        if (!date)
            return "";

        const formatDate = moment(date);
        return formatDate.format("DD/MM/YYYY h:mm:ss A");
    }
}