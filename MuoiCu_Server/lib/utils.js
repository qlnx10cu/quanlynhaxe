var moment = require('moment');
module.exports = {

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
            if (sdt.startsWith("0")) {
                sdt = "84" + sdt.substring(1);
            }
            if (sdt.length != 11)
                return "";
            return sdt;
        } catch (ex) {

        }

    }
}