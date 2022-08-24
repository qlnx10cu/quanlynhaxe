const query = require('../lib/db')

class Webhook {
    static getNameTable() {
        return "webhook";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['id', 'msg', 'time', 'eventname', 'timestamp', 'useridbyapp', 'oaid', 'userid', 'phone', 'appid'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`id`,`msg`,`time`,`eventname`,`timestamp`,`useridbyapp`,`oaid`,`userid`,`phone`,`appid`";
    }

    static getLike(k) {
        let tmp = ['msg'];
        return tmp.includes(k);
    }
    static getDuplicate(param) {
        return "";
    }

    static getParam(param) {
        let tmp = ['id', 'msg', 'time', 'eventname', 'timestamp', 'useridbyapp', 'oaid', 'userid', 'phone', 'appid'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['id', 'msg', 'time', 'eventname', 'timestamp', 'useridbyapp', 'oaid', 'userid', 'phone', 'appid'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

}

module.exports = Webhook;