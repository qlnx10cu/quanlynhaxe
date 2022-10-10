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
};
