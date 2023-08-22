const query = require('../lib/db')

class Bill {
    static getNameTable() {
        return "hoadon";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'manvsuachua', 'biensoxe', 'tongtien', 'tienpt', 'tiencong', 'ngayban', 'ngaythanhtoan', 'ngaydukien', 'ngaysuachua', 'trangthai', 'loaihoadon', 'yeucaukhachhang', 'tuvansuachua', 'sokm', 'lydo', 'kiemtradinhky', 'kiemtralantoi', 'thoigianhen', 'ngayhen', 'sokmhen'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`mahoadon`,`manv`,`tenkh`,`makh`,`biensoxe`,tongtien`,`tienpt`, `tiencong`,`ngayban`,`ngaythanhtoan`,`ngaydukien`,`ngaysuachua`,`trangthai`,`loaihoadon`,`lydo`,`kiemtradinhky`, `kiemtralantoi`, `thoigianhen`, `ngayhen`, `sokmhen`";
    }
    static getLike(k) {
        let tmp = ['tenkh'];
        return tmp.includes(k);
    }
    static getJoin() {
        return "tb1.mahoadon=tb2.mahoadon";
    }
    static getSelect(tb) {
        return `${tb}.mahoadon,${tb}.manv,${tb}.tenkh,${tb}.makh,${tb}.biensoxe,${tb}.tongtien, ${tb}.tienpt, ${tb}.tiencong, ${tb}.ngayban,${tb}.ngaythanhtoan,${tb}.ngaydukien,${tb}.ngaysuachua,${tb}.trangthai,${tb}.loaihoadon,${tb}.lydo, ${tb}.kiemtradinhky, ${tb}.kiemtralantoi, ${tb}.thoigianhen, ${tb}.ngayhen, ${tb}.sokmhen`;
    }
    static getParam(param) {
        let tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'biensoxe', 'tongtien', 'tienpt', 'tiencong', 'ngayban', 'ngaythanhtoan', 'ngaydukien', 'ngaysuachua', 'trangthai', 'loaihoadon', 'lydo', 'kiemtradinhky', 'kiemtralantoi', 'thoigianhen', 'ngayhen', 'sokmhen'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }
    static getArrayParam(param) {
        let tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'biensoxe', 'tongtien', 'tienpt', 'tiencong', 'ngayban', 'ngaythanhtoan', 'ngaydukien', 'ngaysuachua', 'trangthai', 'loaihoadon', 'lydo', 'kiemtradinhky', 'kiemtralantoi', 'thoigianhen', 'ngayhen','sokmhen'];
        if (param) {
            tmp = ['mahoadon', 'manv', 'tenkh', 'makh', 'biensoxe', 'tongtien', 'tienpt', 'tiencong', 'ngayban', 'ngaythanhtoan', 'ngaydukien', 'ngaysuachua', 'trangthai', 'loaihoadon', 'yeucaukhachhang', 'tuvansuachua', 'sokm', 'manvsuachua', 'lydo', 'kiemtradinhky', 'kiemtralantoi', 'thoigianhen', 'ngayhen','sokmhen'];
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