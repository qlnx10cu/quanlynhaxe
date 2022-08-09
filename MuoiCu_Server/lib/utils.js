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
                return moment().add('days', thoigianhen).format("YYYY-MM-DD");
            }
        } catch (error) {

        }
        return "";
    }
}