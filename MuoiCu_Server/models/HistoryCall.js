const query = require('../lib/db');
const Customer = require('./Customer');

class HistosipryCall {
    static getNameTable() {
        return "quanlytrungtrang.lichsucuocgoi";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['callid', 'breachsip', 'manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`callid`,`breachsip`,`manv`,`tennv`,`makh`,`tenkh`,`fromsip`,`tosip`,`starttime`,`endtime`,`status`,`durationms`,`direction`,`note`,`type`,`accountsip`";
    }

    static getLike(k) {
        let tmp = ['fromsip', 'tosip'];
        return tmp.includes(k);
    }
    static getDuplicate(param) {
        return "";
        // let tmp = ['manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
        // var sql = "ON DUPLICATE KEY UPDATE";
        // let arr = Object.keys(param).filter(e => tmp.includes(e));
        // var start = false;
        // arr.forEach(e => {
        //     if (start) {
        //         sql = sql + ",";
        //     }
        //     start = true;
        //     sql = sql + " " + e + " = VALUES(" + e + ")";
        // });
        // return sql;
    }

    static getParam(param) {
        let tmp = ['callid', 'breachsip', 'manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['callid', 'breachsip', 'manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static async bydate(praram) {
        var param = [];
        var sql = "select A.*,B.sodienthoai, B.zaloid, B.biensoxe from (";

        sql = sql + `select * from ${HistosipryCall.getNameTable()} where 1=1 `;

        if (praram.start) {
            param.push(praram.start);
            sql = sql + "AND DATEDIFF(starttime,?) >= 0 ";
        }
        if (praram.end) {
            param.push(praram.end);
            sql = sql + "AND DATEDIFF(?,starttime) >= 0 ";
        }
        sql = sql + " and direction != 'pbx2agent') A";
        sql = sql + ` left join ${Customer.getNameTable()} B on B.ma = A.makh`;
        sql = sql + " ORDER BY A.starttime desc";

        let res = await query(sql, param);
        return res;
    }
}

module.exports = HistosipryCall;