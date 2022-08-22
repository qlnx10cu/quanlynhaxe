class HistosipryCall {
    static getNameTable() {
        return "lichsucuocgoi";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['callid', 'manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`callid`,`manv`,`tennv`,`makh`,`tenkh`,`fromsip`,`tosip`,`starttime`,`endtime`,`status`,`durationms`,`direction`,`note`,`type`,`accountsip`";
    }

    static getLike(k) {
        let tmp = ['fromsip', 'tosip'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }

    static getParam(param) {
        let tmp = ['callid', 'manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['callid', 'manv', 'tennv', 'makh', 'tenkh', 'fromsip', 'tosip', 'starttime', 'endtime', 'status', 'durationms', 'direction', 'note', 'type', 'accountsip'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

}

module.exports = HistosipryCall;