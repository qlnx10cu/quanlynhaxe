class Item {
    static getNameTable() {
        return "phutung";
    }
    static getColmun(param) {
        if (param) {
            let tmp = ['maphutung', 'tentienganh', 'tentiengviet', 'loaiphutung', 'giaban_head', 'giaban_le', 'soluongtonkho', 'ghichu', 'vitri', 'ngaycapnhat', 'loaixe', 'mau', 'model'];
            return tmp.filter(e => Object.keys(param).includes(e));
        }
        return "`maphutung`,`tentienganh`,`tentiengviet`,`loaiphutung`,`giaban_head`, `giaban_le`, `soluongtonkho`,`ghichu`,`vitri`,`ngaycapnhat`,`vat_head`,`vat_le`,`giaban_head_chuavat`,`giaban_le_chuavat`";
    }

    static getDuplicate() {
        return "ON DUPLICATE KEY UPDATE soluongtonkho = soluongtonkho + VALUES(soluongtonkho) ";
    }

    static getLike(k) {
        let tmp = ['maphutung', 'tentienganh', 'tentiengviet'];
        return tmp.includes(k);
    }
    static getParam(param) {
        let tmp = ['maphutung', 'tentienganh', 'tentiengviet', 'loaiphutung', 'giaban_head', 'giaban_le', 'soluongtonkho', 'ghichu', 'vitri', 'ngaycapnhat', 'loaixe', 'mau', 'model'];
        let arr = Object.keys(param).filter(e => tmp.includes(e)).map(e => param[e])
        return arr;
    }

    static getArrayParam(param) {
        let tmp = ['maphutung', 'tentienganh', 'tentiengviet', 'loaiphutung', 'giaban_head', 'giaban_le', 'soluongtonkho', 'ghichu', 'vitri', 'ngaycapnhat', 'loaixe', 'mau', 'model'];
        let obj = {};
        let arr = Object.keys(param).filter(e => tmp.includes(e));
        arr.forEach(e => {
            obj[e] = param[e];
        });
        return obj;
    }

}

module.exports = Item;