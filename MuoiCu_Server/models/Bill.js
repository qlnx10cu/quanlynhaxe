const query = require('../lib/db')

class Bill {
    static getNameTable() {
        return "hoadon";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['mahoadon', 'manv', 'tenkh', 'makh','manvsuachua', 'biensoxe', 'tongtien', 'ngayban', 'ngaythanhtoan', 'trangthai', 'loaihoadon','yeucaukhachhang','tuvansuachua','sokm'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`mahoadon`,`manv`,`tenkh`,`makh`,`biensoxe`,tongtien`,`ngayban`,`ngaythanhtoan`,`trangthai`,`loaihoadon`";
    }
    static getLike(k) {
        let tmp = ['tenkh'];
        return tmp.includes(k);
    }
    static getJoin() {
        return "tb1.mahoadon=tb2.mahoadon";
    }
    static getSelect(tb) {
        return `${tb}.mahoadon,${tb}.manv,${tb}.tenkh,${tb}.makh,${tb}.biensoxe,${tb}.tongtien,${tb}.ngayban,${tb}.ngaythanhtoan,${tb}.trangthai,${tb}.loaihoadon`;
    }
    static getParam(param) {
        let tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'biensoxe', 'tongtien', 'ngayban', 'ngaythanhtoan', 'trangthai', 'loaihoadon'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'biensoxe', 'tongtien', 'ngayban', 'ngaythanhtoan', 'trangthai', 'loaihoadon'];
        if(param){
            tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'biensoxe', 'tongtien', 'ngayban', 'ngaythanhtoan', 'trangthai', 'loaihoadon','yeucaukhachhang','tuvansuachua','sokm'];
        }
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }
    static getDuplicate() {
        return "";
    }
}

module.exports = Bill;