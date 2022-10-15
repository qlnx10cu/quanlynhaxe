module.exports = {
    parseInt: function (val, def, max) {
        try {
            val = parseInt(val) || def || 0;
            if (max !== undefined && max != null && val > max) return max;
            if (val < 0) return 0;
            return val;
        } catch (ex) {}

        return def || 0;
    },
    formatVND: function (tien) {
        return this.parseInt(tien).toLocaleString("vi-VI", {
            style: "currency",
            currency: "VND",
        });
    },
    tinhTongTien: function (dongia, soluong, chietkhau) {
        dongia = this.parseInt(dongia);
        soluong = this.parseInt(soluong);
        chietkhau = this.parseInt(chietkhau);

        return this.parseInt(Math.round((100 - chietkhau) * dongia * soluong) / 100);
    },
    viToEn: function (str) {
        if (!str) {
            return "";
        }
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
    copyText: function (text) {
        try {
            navigator.clipboard.writeText(text);
        } catch (ex) {}
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
};
