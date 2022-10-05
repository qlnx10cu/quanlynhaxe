var moment = require('moment');
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
}