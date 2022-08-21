class Employee {
    static getNameTable() {
        return "nhanvien";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ma', 'ten', 'cmnd', 'sdt', 'gmail', 'username', 'password', 'chucvu', 'accountsip'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ma`,`ten`,`cmnd`,`sdt`,`gmail`,`username`,`password`,`chucvu`,`accountsip`";
    }

    static getLike(k) {
        let tmp = ['ten', 'cmnd', 'sdt', 'gmail'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }

    static getParam(param) {
        let tmp = ['ma', 'ten', 'cmnd', 'sdt', 'gmail', 'username', 'password', 'chucvu', 'accountsip'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ma', 'ten', 'cmnd', 'sdt', 'gmail', 'username', 'password', 'chucvu', 'accountsip'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

}

module.exports = Employee;