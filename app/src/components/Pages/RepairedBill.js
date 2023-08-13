import React, { useState, useEffect } from "react";
import { DivFlexRow, DivFlexColumn, Button, Input, DelButton, Textarea, Select, CancleButton } from "../../styles";
import * as actions from "../../actions";
import lib from "../../lib";
import { HOST } from "../../Config";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import utils from "../../lib/utils";
import { InputCity, InputGioiTinh, InputLoaiXe, DivFragment, CellText, CellMoney, CellDelete, InputNumber } from "../Styles";
import { POPUP_NAME } from "../../actions/Modal";
import BillSuaChuaAPI from "../../API/BillSuaChuaAPI";
import CustomerApi from "../../API/CustomerApi";
import DataTable from "../Warrper/DataTable";

const oneDay = 1000 * 3600 * 24;

const RepairedBill = (props) => {
    const useIsMounted = lib.useIsMounted();
    const [hoadon, setHoadon] = useState({});
    const [listBienSo, setListBienSo] = useState([]);
    const [listBienSoCurrent, setListBienSoCurrent] = useState([]);
    const [listNhanVienSuaChua, setListNhanVienSuaChua] = useState([]);
    const [isDisableEditInfo, setDisableEditInfo] = useState(false);
    const [showInfoBill, setShowInfoBill] = useState(false);

    const mCustomerName = lib.handleInput("");
    const mPhone = lib.handleInput("");
    const mAddress = lib.handleInput("");
    const mThanhPho = lib.handleInput("An Giang");
    const mGioiTinh = lib.handleInput("0");
    const mMaKH = lib.handleInput("");
    const mMaNVSuaChua = lib.handleInput("");
    const mBienSoXe = lib.handleInput("");

    const mTenNhanVien = lib.handleInput("");
    const mLoaiXe = lib.handleInput("");
    const mSoKhung = lib.handleInput("");
    const mSoMay = lib.handleInput("");
    const mSoKm = lib.handleInput(0);
    const mNgayThanhToan = lib.handleInput("");
    const mNgayDuKien = lib.handleInputDate("YYYY-MM-DD HH:mm:ss", moment().add(15, "minutes"));

    const [yeucau, setYeuCau] = useState("");
    const [tuvan, setTuvan] = useState("");
    const [lydo, setLydo] = useState("");
    const [trangthai, setTrangThai] = useState("0");
    const [kiemtradinhky, setKiemTraDinhKy] = useState("0");
    const [kiemtralantoi, setKiemTraLanToi] = useState("");
    const [thoigianhen, setThoiGianHen] = useState("");

    const maban = utils.getQueryParams("maban");
    const mahoadon = utils.getQueryParams("mahoadon");
    let isUpdateBill = 0;
    let pathname = window.location.href;

    if (pathname.indexOf("showrepaired") !== -1) {
        isUpdateBill = 4;
    } else if (pathname.indexOf("updaterepaired") !== -1) {
        isUpdateBill = 3;
    } else if (mahoadon) {
        isUpdateBill = 2;
    }

    useEffect(() => {
        const list = props.staffs.filter((e) => utils.searchName(e.chucvu, "Sửa Chữa"));
        if (list && list.length != 0) {
            const nv = list.find((i) => i.ma.toString() === mMaNVSuaChua.value.toString());

            mTenNhanVien.setValue(nv ? nv.ten : "");
        }
        setListNhanVienSuaChua(list);
    }, [props.staffs, mMaNVSuaChua.value]);

    useEffect(() => {
        CustomerApi.getList()
            .then((response) => {
                if (!useIsMounted()) return;
                setListBienSo(response);
            })
            .catch((err) => {
                props.errorHttp(err, "Không thể lấy danh sách khách hàng\nLỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
            });
    }, []);

    useEffect(() => {
        let connectSocket = true;

        if (isUpdateBill == 4 || isUpdateBill === 3) {
            if (!mahoadon) {
                props.alert("Đường dẫn không đúng");
                return;
            }
        } else if (maban <= 0) {
            props.alert("Đường dẫn không đúng");
            return;
        }

        resetCustomer();
        props.loadRepairedItemProduct();

        if (isUpdateBill == 4) {
            setShowInfoBill(true);
            showHoaDon();
        } else if (isUpdateBill == 2 || isUpdateBill == 3) {
            showHoaDon();
        } else if (isUpdateBill <= 1) {
            if (!connectSocket || !props.socket) return;
            props.socket.on("mahoadon", (data) => {
                if (!connectSocket || !data) return;
                if (data.trangthai != 1 || mahoadon) {
                    props.alert("Bạn đã bị ai đó hủy bàn này");
                    props.history.push("/suachua");
                    return;
                }
            });

            if (pathname.indexOf("repairedbill") !== -1) {
                props.socket.emit("maban", maban - 1);
            }
        }
        return () => {
            connectSocket = false;
            if (props.socket) props.socket.off("mahoadon");
        };
    }, []);

    const exportBill = () => {
        window.open(
            `${HOST}/billsuachua/mahoadon/${mahoadon}/export`,
            "_blank" // <- This is what makes it open in a new window.
        );
    };

    const showHoaDon = () => {
        props.setLoading(true);

        BillSuaChuaAPI.getChitiet(mahoadon)
            .then((res) => {
                if (!useIsMounted()) return;
                setHoadon(res);
                mMaNVSuaChua.setValue(res.manvsuachua);
                props.addRepairedListItemProduct(res.chitiet);
                mLoaiXe.setValue(res.loaixe);
                mMaKH.setValue(res.ma);
                mNgayThanhToan.setValue(res.ngaythanhtoan);
                mNgayDuKien.setValue(res.ngaydukien);
                setTrangThai(res.trangthai);
                setTuvan(res.tuvansuachua);
                setYeuCau(res.yeucaukhachhang);
                setKiemTraDinhKy(res.kiemtradinhky);
                setKiemTraLanToi(res.kiemtralantoi);
                setThoiGianHen(res.thoigianhen);
                mSoKm.setValue(res.sokm);
                setLydo(res.lydo);

                mBienSoXe.setValue(res.biensoxe);
                mCustomerName.setValue(res.tenkh);
                mPhone.setValue(res.sodienthoai);
                mAddress.setValue(res.diachi);
                mThanhPho.setValue(res.thanhpho || "An Giang");
                mGioiTinh.setValue(res.gioitinh || "0");
                mMaKH.setValue(res.makh);
                mSoKhung.setValue(res.sokhung);
                mSoMay.setValue(res.somay);
                mLoaiXe.setValue(res.loaixe);

                props.setLoading(false);

                const message = utils.getState("message");
                if (message) {
                    utils.clearState("message");
                    props.success(message);
                }
            })
            .catch((err) => {
                console.log("err:", err);
                props.alert("Không lấy được hóa đơn\nVui lòng kiểm tra đường mạng");
            });
    };

    const setCustomer = (lbs, values, enter) => {
        let customer = lbs.find(function (item) {
            return item.biensoxe === values;
        });
        if (customer !== undefined) {
            updateCustomer(customer);
        } else if (values && (enter || values.length == 10)) {
            CustomerApi.getByBienSoXe(values)
                .then((response) => {
                    if (!useIsMounted()) return;
                    if (mBienSoXe.value != values) return;
                    if (response && response[0] && response[0].biensoxe == values) {
                        updateCustomer(response[0]);
                    } else {
                        resetCustomer(lbs, values);
                    }
                })
                .catch((err) => {
                    if (!useIsMounted()) return;
                    if (mBienSoXe.value != values) return;
                    resetCustomer(lbs, values);
                });
        } else {
            resetCustomer(lbs, values);
        }
    };

    const updateCustomer = (customer) => {
        mCustomerName.setValue(customer.ten);
        mPhone.setValue(customer.sodienthoai);
        mAddress.setValue(customer.diachi);
        mThanhPho.setValue(customer.thanhpho || "An Giang");
        mGioiTinh.setValue(customer.gioitinh || "0");
        mMaKH.setValue(customer.ma);
        mSoKhung.setValue(customer.sokhung);
        mSoMay.setValue(customer.somay);
        mLoaiXe.setValue(customer.loaixe);
        setDisableEditInfo(false);
    };

    const resetCustomer = (lbs, values) => {
        if (values) {
            let customers = lbs.filter(function (item) {
                return item.biensoxe && item.biensoxe.toLowerCase().includes(values.toLowerCase());
            });
            setListBienSoCurrent(customers.slice(0, 20));
        }
        mCustomerName.setValue("");
        mPhone.setValue("");
        mAddress.setValue("");
        mThanhPho.setValue("An Giang");
        mGioiTinh.setValue("0");
        mMaKH.setValue("");
        mSoKhung.setValue("");
        mSoMay.setValue("");
        mLoaiXe.setValue("");
        setDisableEditInfo(false);
    };

    const _handleKeyPressBSX = (e) => {
        if (e.key === "Enter") {
            searchBienSoXe(e.target.value, true);
        }
    };

    const searchBienSoXe = (values, enter) => {
        mBienSoXe.setValue(values);
        setCustomer(listBienSo || [], values, enter);
    };

    const getData = () => {
        if (
            (!mBienSoXe.value || mBienSoXe.value == "" || mBienSoXe.value == undefined) &&
            (!mSoKhung.value || mSoKhung.value == "" || mSoKhung.value == undefined) &&
            (!mSoMay.value || mSoMay.value == "" || mSoMay.value == undefined)
        ) {
            props.alert("Phải có ít nhất biển số xe hoặc số khung hoặc số máy");
            return null;
        }
        if (!mMaNVSuaChua.value || mMaNVSuaChua.value == "") {
            props.alert("Vui lòng điền nhân viên sữa chữa");
            return null;
        }
        if (!listNhanVienSuaChua.find((e) => e.ma == mMaNVSuaChua.value)) {
            props.alert("Nhân viên sữa chữa không tồn tại");
            return null;
        }
        if (isUpdateBill == 3) {
            if (!hoadon || !hoadon.mahoadon) {
                props.alert("Hóa đơn không hợp lệ");
                return null;
            }
            if (!lydo || lydo.trim() == "") {
                props.alert("Vui lòng nhập lý do");
                return null;
            }
            if (utils.comrapeName(hoadon.lydo, lydo)) {
                props.alert("Vui lòng nhập lý do khác hiện tại");
                return null;
            }
        }

        let tong = 0;
        let tienpt = 0;
        let tiencong = 0;
        let listProduct = [];

        for (let i = 0; i < props.Repaired.products.length; i++) {
            tong = tong + props.Repaired.products[i].tongtien;
            tiencong = tiencong + props.Repaired.products[i].thanhtiencong;
            tienpt = tienpt + props.Repaired.products[i].thanhtienpt;

            let temp = {
                loaiphutung: props.Repaired.products[i].loaiphutung,
                tenphutungvacongviec: props.Repaired.products[i].tenphutung,
                maphutung: props.Repaired.products[i].maphutung,
                nhacungcap: props.Repaired.products[i].nhacungcap,
                soluongphutung: props.Repaired.products[i].soluong,
                tiencong: props.Repaired.products[i].tiencong,
                tienpt: props.Repaired.products[i].tienpt,
                thanhtiencong: props.Repaired.products[i].thanhtiencong,
                thanhtienpt: props.Repaired.products[i].thanhtienpt,
                dongia: props.Repaired.products[i].dongia,
                chietkhau: props.Repaired.products[i].chietkhau,
                tienchietkhau: props.Repaired.products[i].tienchietkhau,
                tiencongchietkhau: props.Repaired.products[i].tiencongchietkhau,
                tongtien: props.Repaired.products[i].tongtien,
                manvsuachua: mMaNVSuaChua.value,
            };
            listProduct.push(temp);
        }

        for (let i = 0; i < listProduct.length; i++) {
            const item = listProduct[i];

            if (item.soluong <= 0) {
                props.alert("Phụ tùng :" + item.tenphutung + " có số lượng <= 0");
                return null;
            }
            if (item.dongia < 0) {
                props.alert("Phụ tùng :" + item.tenphutung + " có đơn giá < 0");
                return null;
            }
            if (item.chietkhau < 0 || item.chietkhau > 100) {
                props.alert("Phụ tùng :" + item.tenphutung + " có chiết kháu không hợp lệ");
                return null;
            }
            if (item.tienchietkhau < 0) {
                props.alert("Phụ tùng :" + item.tenphutung + " có tiền chiết kháu không hợp lệ");
                return null;
            }
            if (item.tiencongchietkhau < 0) {
                props.alert("Phụ tùng :" + item.tenphutung + " có tiền công chiết kháu không hợp lệ");
                return null;
            }
            if (item.tiencong < 0) {
                props.alert("Phụ tùng :" + item.tenphutung + " có tiền công < 0");
                return null;
            }
        }

        if (tienpt + tiencong != tong) {
            props.alert("Hóa đơn đang có lỗi, vui lòng tạo lại");
            return;
        }

        const data = {
            manvsuachua: mMaNVSuaChua.value,
            tenkh: mCustomerName.value,
            sodienthoai: mPhone.value,
            diachi: mAddress.value,
            thanhpho: mThanhPho.value,
            gioitinh: mGioiTinh.value,
            loaixe: mLoaiXe.value,
            somay: mSoMay.value,
            sokhung: mSoKhung.value,
            biensoxe: mBienSoXe.value,
            ngaydukien: mNgayDuKien.value,
            makh: mMaKH.value && mMaKH.value != "" ? mMaKH.value : null,
            tongtien: tong,
            tienpt: tienpt,
            tiencong: tiencong,
            chitiet: listProduct,
            manv: props.info.ma,
            yeucaukhachhang: yeucau,
            tuvansuachua: tuvan,
            lydo: lydo,
            kiemtradinhky: kiemtradinhky ? kiemtradinhky : "0",
            kiemtralantoi: kiemtralantoi,
            thoigianhen: thoigianhen,
            sokm: mSoKm.value || 0,
        };

        return data;
    };

    const handleSaveBill = () => {
        const data = getData();

        if (data == null) {
            return;
        }

        const length = data.chitiet.length;
        const bsx = data.biensoxe;
        let mess =
            "Bạn muốn lưu hóa đơn này với: " +
            length +
            " phụ tùng và tổng tiền:" +
            data.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" }) +
            " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi lưu\n Vì hóa đơn này có " + length + " phụ tùng";
        }
        props.confirmError(mess, length == 0 ? 1 : 0, () => {
            BillSuaChuaAPI.add(data)
                .then((Response) => {
                    if (props.socket) props.socket.emit("bill", { maban: maban - 1, mahoadon: Response.mahoadon, biensoxe: bsx });
                    props.loadRepairedItemProduct();
                    props.alert("Tạo Phiếu Sửa Chữa Thành Công - Mã Hóa Đơn:" + Response.mahoadon);
                    props.history.push("/suachua");
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể lưu phiếu sữa chưa: ");
                });
        });
    };

    const handleDeleteBill = () => {
        props.confirmError("Bạn chắc muốn hủy hóa đơn " + mahoadon, 2, () => {
            BillSuaChuaAPI.delete(mahoadon)
                .then((res) => {
                    if (props.socket) props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                    props.alert("Hủy hóa đơn " + mahoadon + " thành công");
                    props.history.push("/suachua");
                })
                .catch((err) => {
                    props.errorHttp(err, "Hủy hóa đơn " + mahoadon + " thất bại");
                });
        });
    };

    const handlePayBill = () => {
        const data = getData();
        if (data == null) return;
        data.mahoadon = mahoadon;

        const length = data.chitiet.length;
        let mess =
            "Bạn muốn thanh toán hóa đơn " +
            mahoadon +
            " với tổng tiền: " +
            data.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" }) +
            " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi thanh toán hóa đơn " + mahoadon + "\n Vì hóa đơn này có " + length + " phụ tùng";
        }
        if (!data.tenkh) {
            mess = "Hóa đơn này không có tên khách hàng\n Lưu ý trước khi thanh toán hóa đơn " + mahoadon;
        }

        props.confirmError(mess, !data.tenkh || length == 0 ? 1 : 0, () => {
            BillSuaChuaAPI.update(mahoadon, data)
                .then(() => {
                    BillSuaChuaAPI.thanhToan(mahoadon)
                        .then(() => {
                            if (props.socket) props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                            exportBill();
                            props.alert("Thanh toán hóa đơn " + mahoadon + " thành công");
                            props.history.push("/suachua");
                        })
                        .catch((err) => {
                            props.errorHttp(err, "Không thể  thanh toán hóa đơn " + mahoadon + "\nVui lòng kiểm lại đường mạng");
                        });
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể  update hóa đơn " + mahoadon + "\nVui lòng kiểm lại đường mạng");
                });
        });
    };

    const handleUpdateBill = () => {
        const data = getData();
        if (data == null) return;

        const length = data.chitiet.length;
        let mess =
            "Bạn muốn update hóa đơn " +
            mahoadon +
            " với tổng tiền:" +
            data.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" }) +
            " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi thanh toán hóa đơn " + mahoadon + "\n Vì hóa đơn này có " + length + " phụ tùng";
        }
        if (!data.tenkh) {
            mess = "Hóa đơn này không có tên khách hàng\n Lưu ý trước khi thanh toán hóa đơn " + mahoadon;
        }
        props.confirmError(mess, !data.tenkh || length == 0 ? 1 : 0, () => {
            data.mahoadon = mahoadon;
            BillSuaChuaAPI.update(data.mahoadon, data)
                .then((res) => {
                    if (isUpdateBill == 4 || isUpdateBill == 3) {
                        props.history.push("/showrepaired?mahoadon=" + mahoadon, { message: "Update hóa đơn " + mahoadon + " thành công" });
                    } else {
                        props.success("Update hóa đơn " + mahoadon + " thành công");
                    }
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể  update hóa đơn " + mahoadon + "\nVui lòng kiểm lại đường mạng");
                });
        });
    };

    const handleHuyBan = () => {
        props.confirmError("Bạn chắc muốn hủy bàn này", 2, () => {
            if (props.socket) props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
            props.history.push("/suachua");
        });
    };

    const handleRedirectUpdate = () => {
        props.openModal(POPUP_NAME.POPUP_COMFIRM_BILL, { mahoadon: mahoadon, loaihoadon: 0 });
    };

    const handleChangeSL = (e, index) => {
        const item = props.Repaired.products[index];

        item.soluong = utils.parseInt(e.target.value);
        props.updateRepairedItemProduct(item, index);
    };

    const handleChangeChieuKhau = (e, index) => {
        const item = props.Repaired.products[index];

        item.chietkhau = utils.parseChietKhau(e.target.value);
        if (item.loaiphutung != "tiencong") {
            item.tienchietkhau = utils.tinhTienChietKhau(item.dongia, item.chietkhau);
        }
        item.tiencongchietkhau = utils.tinhTienChietKhau(item.tiencong, item.chietkhau);

        props.updateRepairedItemProduct(item, index);
    };

    const handleChangeTienChietKhau = (e, index) => {
        const item = props.Repaired.products[index];
        if (item.loaiphutung == "tiencong") {
            return;
        }

        item.tienchietkhau = utils.parseInt(e.target.value);
        item.chietkhau = utils.tinhChietKhau(item.dongia, item.tienchietkhau);
        item.tiencongchietkhau = utils.tinhTienChietKhau(item.tiencong, item.chietkhau);
        props.updateRepairedItemProduct(item, index);
    };

    const handleChangeTienCong = (e, index) => {
        const item = props.Repaired.products[index];
        if (item.loaiphutung == "tiencong") {
            return;
        }

        item.tiencong = utils.parseInt(e.target.value);
        item.tiencongchietkhau = utils.tinhTienChietKhau(item.tiencong, item.chietkhau);
        props.updateRepairedItemProduct(item, index);
    };

    const handleSearchItem = (search, setSearch) => {
        if (!search) return;
        const item = props.Product.data.find(function (pro) {
            return pro && pro.maphutung != "" && pro.maphutung.toLowerCase() == search.toLowerCase();
        });

        if (!item) return;

        if (!item.maphutung || item.maphutung === "") {
            props.alert("mã phụ tùng không đúng: " + item.maphutung);
            return;
        }

        const giaban = utils.parseInt(item.giaban_le);

        if (!giaban || giaban <= 0) {
            props.alert("phụ tùng không hợp lệ");
            return;
        }

        const newData = {
            loaiphutung: "phutung",
            tenphutung: item.tentiengviet,
            maphutung: item.maphutung,
            nhacungcap: "Trung Trang",
            dongia: giaban,
            soluong: 1,
            chietkhau: 0,
            tienchietkhau: 0,
            tiencongchietkhau: 0,
            tiencong: 0,
            thanhtiencong: 0,
            tienpt: giaban,
            thanhtienpt: giaban,
            tongtien: giaban,
        };

        props.addRepairedItemProduct(newData);
        setSearch("");
    };

    const handleOpenSalary = () => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_ADD_SALARIES, {}, (data) => {
            props.addRepairedItemProduct(data);
        });
    };

    const handleOpenStoreOutside = () => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_ADD_STORE_OUTSIDES, {}, (data) => {
            props.addRepairedItemProduct(data);
        });
    };

    const handleOpenPopupProduct = () => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_ADD_PRODUCT, {}, (data) => {
            props.addRepairedItemProduct(data);
        });
    };

    return (
        <DivFragment>
            <div>
                <h1 style={{ textAlign: "center" }}>
                    Phiếu sửa chữa
                    <If condition={mahoadon}> (Mã Hóa Đơn: {mahoadon}) </If>
                    <If condition={maban > 0}> (Bàn số: {maban}) </If>
                </h1>

                <DivFlexRow style={{ alignItems: "center" }}>
                    <DivFlexColumn>
                        <label>Nhân viên sửa chữa: </label>
                        <Input
                            readOnly={showInfoBill}
                            autocomplete="off"
                            list="nv_suachua"
                            name="nv_suachua"
                            value={mMaNVSuaChua.value}
                            onChange={(e) => mMaNVSuaChua.setValue(e.target.value)}
                        />
                        <datalist id="nv_suachua">
                            {listNhanVienSuaChua.map((item, index) => (
                                <option key={index} value={item.ma}>
                                    {item.ten}
                                </option>
                            ))}
                        </datalist>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Tên nhân viên sửa chữa: </label>
                        <Input readOnly autocomplete="off" {...mTenNhanVien} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Thời gian dự kiến: </label>
                        <Input type="datetime-local" readOnly={showInfoBill} {...mNgayDuKien} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <DivFlexColumn>
                        <label>Biển số xe: </label>
                        <Input
                            readOnly={showInfoBill}
                            autocomplete="off"
                            list="bien_so"
                            name="bien_so"
                            onKeyPress={_handleKeyPressBSX}
                            value={mBienSoXe.value || ""}
                            onChange={(e) => {
                                searchBienSoXe(e.target.value, false);
                            }}
                        />
                        <datalist id="bien_so">
                            {listBienSoCurrent.map((item, index) => (
                                <option key={index} value={item.biensoxe}>
                                    {item.ten}
                                </option>
                            ))}
                        </datalist>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Tên khách hàng: </label>
                        <Input readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mCustomerName} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Số điện thoại: </label>
                        <Input readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mPhone} pattern="[0-9]{10}" />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Địa chỉ: </label>
                        <Input readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mAddress} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Giới Tính: </label>
                        <InputGioiTinh style={{ width: 100 }} {...mGioiTinh} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Thành Phố: </label>
                        <InputCity readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mThanhPho} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <DivFlexColumn>
                        <label>Loại xe: </label>
                        <InputLoaiXe readOnly={showInfoBill} autocomplete="off" {...mLoaiXe} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Số khung: </label>
                        <Input readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mSoKhung} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Số máy: </label>
                        <Input readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mSoMay} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Số km: </label>
                        <InputNumber readOnly={showInfoBill} disabled={isDisableEditInfo} max={999999} min={0} {...mSoKm} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Kiểm tra định kỳ: </label>
                        <Select
                            readOnly={showInfoBill}
                            disabled={isDisableEditInfo || showInfoBill}
                            autocomplete="off"
                            value={kiemtradinhky}
                            onChange={(e) => {
                                setKiemTraDinhKy(e.target.value);
                            }}
                        >
                            <option value="0">Không có</option>
                            <option value="1">Lần 1</option>
                            <option value="2">Lần 2</option>
                            <option value="3">Lần 3</option>
                            <option value="4">Lần 4</option>
                            <option value="5">Lần 5</option>
                            <option value="6">Lần 6</option>
                        </Select>
                    </DivFlexColumn>
                    <Button
                        disabled={!mBienSoXe.value}
                        onClick={() => {
                            props.openModal(POPUP_NAME.POPUP_CUSTOMER_HISTORY, { ma: mMaKH.value });
                        }}
                        style={{ marginLeft: 20, marginTop: 10 }}
                    >
                        Chi tiết
                    </Button>
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <DivFlexColumn>
                        <label>Yêu cầu khách hàng: </label>
                        <Textarea
                            readOnly={showInfoBill}
                            autocomplete="off"
                            value={yeucau}
                            onChange={(e) => {
                                setYeuCau(e.target.value);
                            }}
                        />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Tư vấn Sữa chữa: </label>
                        <Textarea
                            readOnly={showInfoBill}
                            autocomplete="off"
                            value={tuvan}
                            onChange={(e) => {
                                setTuvan(e.target.value);
                            }}
                        />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Kiểm Tra Lần Tới: </label>
                        <Textarea
                            readOnly={showInfoBill}
                            autocomplete="off"
                            value={kiemtralantoi}
                            onChange={(e) => {
                                setKiemTraLanToi(e.target.value);
                            }}
                        />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Thời Gian Hẹn: </label>
                        <Select
                            readOnly={showInfoBill}
                            disabled={showInfoBill}
                            autocomplete="off"
                            value={thoigianhen}
                            onChange={(e) => {
                                setThoiGianHen(e.target.value);
                            }}
                        >
                            <option value="0">Không hẹn</option>
                            <option value="5">5 Ngày Sau</option>
                            <option value="7">7 Ngày Sau</option>
                            <option value="10">10 Ngày Sau</option>
                            <option value="14">2 Tuần Sau</option>
                            <option value="21">3 Tuần Sau</option>
                            <option value="28">1 Tháng Sau</option>
                            <option value="91">3 Tháng Sau</option>
                            <option value="182">6 Tháng Sau</option>
                            <option value="364">1 Năm Sau</option>
                        </Select>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Ngày Hẹn: </label>
                        <If condition={!thoigianhen || thoigianhen == "0"}>
                            <Input readOnly autocomplete="off" value="" />
                        </If>
                        <If condition={thoigianhen && thoigianhen != "0"}>
                            <Input
                                readOnly
                                autocomplete="off"
                                value={moment(trangthai == 1 && mNgayThanhToan.value ? mNgayThanhToan.value : new Date())
                                    .add(thoigianhen, "days")
                                    .format("DD/MM/YYYY")}
                            />
                        </If>
                    </DivFlexColumn>
                </DivFlexRow>
                <If condition={isUpdateBill == 3 || lydo}>
                    <DivFlexRow style={{ alignItems: "center" }}>
                        <DivFlexColumn>
                            <label>Lý do thay đổi: </label>
                            <Textarea
                                readOnly={showInfoBill}
                                autocomplete="off"
                                value={lydo}
                                onChange={(e) => {
                                    setLydo(e.target.value);
                                }}
                            />
                        </DivFlexColumn>
                    </DivFlexRow>
                </If>

                <If condition={isUpdateBill < 4}>
                    <DivFlexRow style={{ marginTop: 5, marginBottom: 5, alignItems: "center", justifyContent: "flex-end" }}>
                        <DivFlexRow style={{ width: 480, alignItems: "center", justifyContent: "space-between" }}>
                            <Button onClick={handleOpenSalary}>Thêm Tiền Công</Button>
                            <Button onClick={handleOpenStoreOutside}>Thêm của hàng ngoài</Button>
                            <Button onClick={handleOpenPopupProduct}>Thêm mới</Button>
                        </DivFlexRow>
                    </DivFlexRow>
                </If>

                <DataTable
                    noPage
                    isLoading={props.isLoading}
                    data={props.Repaired.products}
                    onSearch={handleSearchItem}
                    limitList={20}
                    dataSearch={props.Product.data}
                    searchData={(search, item) => utils.searchName(item.maphutung, search) || utils.searchName(item.tentiengviet, search)}
                    renderSearch={(item, index) => {
                        return (
                            <option key={index} value={item.maphutung}>
                                {item.tentiengviet} ({item.soluongtonkho})
                            </option>
                        );
                    }}
                >
                    <DataTable.Header>
                        <th style={{ width: 50 }}>STT</th>
                        <th>
                            Tên phụ tùng <br /> và công việc
                        </th>
                        <th>Mã phụ tùng</th>
                        <th>Đơn giá</th>
                        <th style={{ width: 100 }}>SL</th>
                        <th style={{ width: 100 }}>Chiết khấu (%)</th>
                        <th style={{ width: 100 }}>Số tiền chiết khấu</th>
                        <th>Tiền phụ tùng</th>
                        <th>Tiền công</th>
                        <th>
                            Tổng tiền công <br />+ phụ tùng
                        </th>
                        <If condition={!showInfoBill}>
                            <th style={{ width: 100 }}>
                                <i className="far fa-trash-alt"></i>
                            </th>
                        </If>
                    </DataTable.Header>
                    <DataTable.Body
                        render={(item, index) => {
                            return (
                                <tr key={index}>
                                    <CellText>{index + 1}</CellText>
                                    <CellText>{item.tenphutung}</CellText>
                                    <CellText>{item.maphutung}</CellText>
                                    <CellMoney>{item.dongia}</CellMoney>
                                    <CellText>
                                        <input
                                            style={{ maxWidth: 100, textAlign: "right" }}
                                            readOnly={showInfoBill || item.loaiphutung == "tiencong"}
                                            type="number"
                                            max={1000}
                                            onChange={(e) => handleChangeSL(e, index)}
                                            value={item.soluong}
                                            min="1"
                                        />
                                    </CellText>
                                    <CellText>
                                        <input
                                            style={{ maxWidth: 100, textAlign: "right" }}
                                            readOnly={showInfoBill}
                                            type="number"
                                            max={100}
                                            onChange={(e) => handleChangeChieuKhau(e, index)}
                                            value={item.chietkhau}
                                            min="0"
                                        />
                                    </CellText>
                                    <CellText>
                                        <input
                                            style={{ width: 150, textAlign: "right" }}
                                            readOnly={showInfoBill || item.loaiphutung == "tiencong"}
                                            type="number"
                                            onChange={(e) => handleChangeTienChietKhau(e, index)}
                                            value={item.tienchietkhau || 0}
                                            min={0}
                                        />
                                    </CellText>
                                    <CellMoney>{item.tienpt}</CellMoney>
                                    <CellText>
                                        <input
                                            style={{ width: 150, textAlign: "right" }}
                                            readOnly={showInfoBill || item.loaiphutung == "tiencong"}
                                            type="number"
                                            onChange={(e) => handleChangeTienCong(e, index)}
                                            value={item.tiencong}
                                            min={0}
                                        />
                                    </CellText>
                                    <CellMoney>{item.tongtien}</CellMoney>
                                    <If condition={!showInfoBill}>
                                        <CellDelete onClick={() => props.deleteRepairedItemProduct(index)}></CellDelete>
                                    </If>
                                </tr>
                            );
                        }}
                    ></DataTable.Body>
                </DataTable>

                <DivFlexRow style={{ marginTop: 15, marginBottom: 5, justifyContent: "end" }}>
                    <DivFlexColumn style={{ marginTop: 10, marginRight: 20 }}>
                        <h4 style={{ textAlign: "center" }}>Tiền PT: {utils.formatVND(props.Repaired.tongpt)} ,</h4>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginTop: 10, marginRight: 20 }}>
                        <h4 style={{ textAlign: "center" }}>Tiền Công : {utils.formatVND(props.Repaired.tongcong)} ,</h4>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginTop: 10, marginRight: 5 }}>
                        <h4 style={{ textAlign: "center" }}>Tổng Tiền : {utils.formatVND(props.Repaired.tongTien)}</h4>
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: "space-between" }}>
                    <label></label>
                    <DivFlexRow>
                        <Choose>
                            <When condition={isUpdateBill == 0}>
                                <CancleButton onClick={handleHuyBan}>Hủy bàn</CancleButton>
                                <Button onClick={handleSaveBill}>Lưu</Button>
                            </When>
                            <When condition={isUpdateBill == 4}>
                                <If condition={moment().valueOf() - moment(mNgayThanhToan.value).valueOf() <= oneDay}>
                                    <Button onClick={handleRedirectUpdate}>Update</Button>
                                </If>
                            </When>
                            <Otherwise>
                                <Button onClick={handleUpdateBill}>Update</Button>
                                <If condition={isUpdateBill != 3}>
                                    <Button style={{ marginLeft: 15 }} onClick={handlePayBill}>
                                        Update và Thanh toán
                                    </Button>
                                    <DelButton style={{ marginLeft: 15 }} onClick={handleDeleteBill}>
                                        Hủy
                                    </DelButton>
                                </If>
                            </Otherwise>
                        </Choose>
                    </DivFlexRow>
                </DivFlexRow>
            </div>
        </DivFragment>
    );
};

const mapState = (state) => ({
    isLoading: state.App.isLoading,
    staffs: state.Staff.data,
    info: state.Authenticate.info,
    Product: state.Product,
    Repaired: state.Repaired,
});

const mapDispatch = {
    loadRepairedItemProduct: () => actions.RepairedAction.loadRepairedItemProduct(),
    addRepairedItemProduct: (item) => actions.RepairedAction.addRepairedItemProduct(item),
    addRepairedListItemProduct: (data) => actions.RepairedAction.addRepairedListItemProduct(data),
    updateRepairedItemProduct: (item, index) => actions.RepairedAction.updateRepairedItemProduct(item, index),
    deleteRepairedItemProduct: (index) => actions.RepairedAction.deleteRepairedItemProduct(index),
};

export default withRouter(connect(mapState, mapDispatch)(RepairedBill));
