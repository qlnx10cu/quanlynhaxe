import moment from "moment";

module.exports = {
    parseInt: function (val, def, max) {
        try {
            def = def || 0;
            const res = parseInt(val) || def;
            if (max !== undefined && max != null && res > max) return max;
            if (res < 0) return def || 0;
            if (!String(val).includes(".") && String(res).trim() != String(val).trim()) return def;
            return res;
        } catch (ex) {}

        return def;
    },
    parseFloat: function (val, def, max) {
        try {
            def = def || 0;
            const res = parseInt(val) || def;
            if (max !== undefined && max != null && res > max) return max;
            if (res < 0) return def;
            return res;
        } catch (ex) {}

        return def;
    },
    parseChietKhau: function (val, def) {
        try {
            def = def || 0;
            let res = parseFloat(val) || def;
            if (res < 0) return def;
            res = (Number(Math.round(res * 1000)) * 1.0) / 1000;
            if (res > 100) return 100;
            return res;
        } catch (ex) {}

        return def;
    },
    formatVND: function (tien) {
        return this.parseInt(tien).toLocaleString("vi-VI", {
            style: "currency",
            currency: "VND",
        });
    },
    formatNgayGio: function (ngay) {
        return moment(ngay).format("HH:mm DD/MM/YYYY");
    },
    tinhTongTien: function (dongia, soluong, chietkhau) {
        dongia = this.parseInt(dongia);
        soluong = this.parseInt(soluong);
        chietkhau = this.parseChietKhau(chietkhau);

        const tienchietkhau = this.tinhTienChietKhau(dongia, chietkhau);
        const thanhtien = this.parseInt(dongia - tienchietkhau);

        return this.parseInt(thanhtien * soluong);
    },
    tinhChietKhau: function (dongia, tienchietkhau) {
        dongia = this.parseInt(dongia);
        tienchietkhau = this.parseInt(tienchietkhau);

        let chietkhau = this.parseChietKhau((tienchietkhau * 100.0) / dongia);
        if (tienchietkhau == this.tinhTienChietKhau(dongia, chietkhau)) {
            return chietkhau;
        }
        chietkhau = Number(chietkhau) * 1.0;
        for (let l = -1.0; l <= 1.0; l = l + 0.001) {
            let chietkhauNew = this.parseChietKhau(chietkhau + l);
            if (tienchietkhau == this.tinhTienChietKhau(dongia, chietkhauNew)) {
                return chietkhauNew;
            }
        }
        return 0;
    },
    tinhTienChietKhau: function (dongia, chietkhau) {
        dongia = this.parseInt(dongia);
        chietkhau = this.parseChietKhau(chietkhau);

        const value = (1.0 * Number(chietkhau) * dongia) / 100;

        return this.parseInt(Math.round((Number(value) * 1.0) / 10) * 10);
    },
    formatTongTien: function (dongia, soluong, chietkhau) {
        return this.formatVND(this.tinhTongTien(dongia, soluong, chietkhau));
    },
    viToEn: function (str) {
        if (!str) {
            return "";
        }
        str = String(str);
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
        str = str.replace(/\u02C6|\u0306|\u031B/g, "");
        return str;
    },
    searchName: function (ten, search) {
        if (!search || search == "") return true;
        return this.viToEn(ten).includes(this.viToEn(search));
    },
    comrapeName: function (ten, search) {
        return this.viToEn(ten) == this.viToEn(search);
    },
    copyText: function (text) {
        try {
            navigator.clipboard.writeText(text);
        } catch (ex) {}
    },
    getState: function (name) {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name]) return null;
        return window.history.state.state[name];
    },
    clearState: function (name) {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name]) return;
        window.history.pushState(window.history.state.state, "", window.href);
    },
    getGioiTinh: function (gt) {
        gt = this.parseInt(gt);
        switch (gt) {
            case 1:
                return "Nữ";
            case 0:
                return "Nam";
        }
        return "";
    },
    getTrangThaiChamSoc: function (e) {
        switch (e) {
            case -1:
                return "Tất cả";
            case 0:
                return "Chưa chăm sóc";
            case 1:
                return "Đang chăm sóc";
            case 2:
                return "Thành công";
            case 3:
                return "Thất bại";
            default:
                return "Không biết";
        }
    },
    getQuerys: function () {
        const queryParams = {};
        const url = window.location.href;
        const tmp = url.substring(url.lastIndexOf("?") + 1, url.length);
        if (tmp == "") return queryParams;
        const params = tmp.split("&");
        for (let i = 0; i < params.length; i++) {
            const pair = params[i].split("=");
            const value = pair.length == 0 ? "" : pair[1];
            queryParams[pair[0]] = decodeURIComponent(value);
        }
        return queryParams;
    },
    getQueryParams: function (name) {
        const queryParams = this.getQuerys();
        return queryParams[name];
    },
};
