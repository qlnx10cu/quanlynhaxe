class Employee {
    static getNameTable() {
        return "nhanvien";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['ten', 'cmnd', 'sdt', 'gmail', 'username','password','chucvu'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`ten`,`cmnd`,`sdt`,`gmail`,`username`,`password`,`chucvu`";
    }
   
    static getLike(k) {
        let tmp = ['ten', 'cmnd', 'sdt', 'gmail'];
        return tmp.includes(k);
    }
    static getDuplicate() {
        return "";
    }
    
    static getParam(param) {
        let tmp = ['ten', 'cmnd', 'sdt', 'gmail', 'username','password','chucvu'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['ten', 'cmnd', 'sdt', 'gmail', 'username','password','chucvu'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

}

module.exports = Employee;