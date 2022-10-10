import React, { useState, useEffect } from "react";
import {
    DivFlexRow,
    DivFlexColumn,
    Button,
    Input,
    Table,
    DelButton,
    Modal,
    ModalContent,
    CloseButton,
    Textarea,
    Select,
    CancleButton,
} from "../../styles";
import PopupAccessory from "./PopupAccessory";
import PopupBillTienCong from "./PopupBillTienCong";
import HistoryCustomer from "../Admin/HistoryCustomer";
import lib from "../../lib";
import { HOST } from "../../Config";
import { connect } from "react-redux";
import { UpdateBill, SaveBill, ThanhToan, HuyThanhToan, GetBillSuaChuaByMaHoaDon, CheckUpdateBill } from "../../API/Bill";
import { GetlistCustomer } from "../../API/Customer";
import { GetListNVSuaChua } from "../../API/Staffs";
import { withRouter } from "react-router-dom";
import PopupBillCHN from "./PopupBillCHN";
import { GetListCuaHangNgoai } from "../../API/CuaHangNgoai";
import { GetListSalary } from "../../API/Salary";
import {
    deleteBillProduct,
    addBillProduct,
    getAllProduct,
    deleteItemBillProduct,
    setListBillProduct,
    updateBillProduct,
    deleteItemBillProductMa,
} from "../../actions/Product";
import moment from "moment";
import Loading from "../Loading";
import utils from "../../lib/utils";
import ButtonDelete from "../Warrper/ButtonDelete";

const oneDay = 1000 * 3600 * 24;

const ListThanhPho = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hồ Chí Minh",
    "Hoà Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
];

const listLoaiXe = [
    "Airblade",
    "Blade",
    "CBR",
    "Click ",
    "Cub",
    "Dream",
    "Future",
    "Lead",
    "MSX",
    "PCX",
    "PS",
    "SH",
    "SH mode",
    "Sonic",
    "Super Cub",
    "Super Dream",
    "Vario",
    "Vision",
    "Wave",
    "Wave Alpha",
    "Wave RSX",
    "Winner",
    "Khác",
];

const ConfirmHoaDon = (props) => {
    let [maBarcode, setMaBarcode] = useState("");

    const UpdateHoaDon = (maHoaDon) => {
        var date = new Date();
        let url = `/services/updatebill?mahoadon=${maHoaDon}`;
        props.history.push(url, { tokenTime: date.getTime(), mhdToken: maHoaDon });
    };

    const confirmBarCodeByServer = () => {
        if (!maBarcode) {
            props.alert("vui lòng nhập mã code");
            return;
        }

        CheckUpdateBill(props.token, { ma: maBarcode, mahoadon: props.mahoadon })
            .then((res) => {
                if (res && res.data && res.data.error && res.data.error >= 1) {
                    setMaBarcode("");
                    UpdateHoaDon(props.mahoadon);
                    props.onCloseClick();
                } else {
                    props.alert("Mã code không đúng, vui lòng nhập lại");
                }
            })
            .catch((err) => {
                props.errorHttp(err, "Lỗi : " + err.message);
            });
    };

    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            confirmBarCodeByServer();
        }
    };
    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent style={{ width: "90%" }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton
                        onClick={() => {
                            setMaBarcode("");
                            props.onCloseClick();
                        }}
                    >
                        &times;
                    </CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: "center" }}>HEAD TRUNG TRANG</h3>
                <h4 style={{ textAlign: "center" }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
                <h5 style={{ textAlign: "center" }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
                <DivFlexRow style={{ alignItems: "center", textAlign: "center" }}>
                    <label>Nhập barcode: </label>
                    <Input
                        type="password"
                        autocomplete="off"
                        value={maBarcode}
                        onKeyPress={_handleKeyPress}
                        style={{ marginLeft: 10 }}
                        onChange={(e) => setMaBarcode(e.target.value)}
                    />
                    <Button
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                            confirmBarCodeByServer();
                        }}
                    >
                        Thay đổi
                    </Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};

const RepairedBill = (props) => {
    let mCustomerName = lib.handleInput("");
    let mPhone = lib.handleInput("");
    let mAddress = lib.handleInput("");
    let mThanhPho = lib.handleInput("An Giang");
    let mGioiTinh = lib.handleInput("0");
    let mMaKH = lib.handleInput("");
    let mMaNVSuaChua = lib.handleInput("");
    let [biensoxe, setBienSoXe] = useState("");
    let [isShowHistoryCustomer, setShowHistoryCustomer] = useState(false);
    let [isShowNewBill, setShowNewBill] = useState(false);
    let [isShowTienCong, setShowTienCong] = useState(false);
    let [isDisableEditInfo, setDisableEditInfo] = useState(false);
    let [isUpdated, setUpdated] = useState(true);
    let [showInfoBill, setShowInfoBill] = useState(false);

    let [isShowCuaHangNgoai, setShowCuaHangNgoai] = useState(false);

    let [listBienSo, setListBienSo] = useState([]);
    let [listBienSoCurrent, setListBienSoCurrent] = useState([]);
    let [listCuaHangNgoai, setCuaHangNgoai] = useState([]);
    let [listNhanVienSuaChua, setListNhanVienSuaChua] = useState([]);
    let [maban, setMaban] = useState(null);
    let [isUpdateBill, setUpdateBill] = useState(0);
    let [mMaHoaDon, setMaHoaDon] = useState("");
    let [manhanvien, setMaNhanVien] = useState(-1);
    let [tongTienBill, setTongTienBill] = useState(0);
    let [tongTienCong, setTongTienCong] = useState(0);
    let [tongTienPT, setTongTienPT] = useState(0);
    let tennhanvien = lib.handleInput("");
    let mLoaiXe = lib.handleInput("");
    let mSoKhung = lib.handleInput("");
    let mSoMay = lib.handleInput("");
    let ngaythanhtoan = lib.handleInput("");

    let [sokm, setSoKM] = useState("");
    let [yeucau, setYeuCau] = useState("");
    let [tuvan, setTuvan] = useState("");
    let [lydo, setLydo] = useState("");
    let [trangthai, setTrangThai] = useState("0");
    let [kiemtradinhky, setKiemTraDinhKy] = useState("0");
    let [kiemtralantoi, setKiemTraLanToi] = useState("");
    let [thoigianhen, setThoiGianHen] = useState("");

    let [searchValue, setSearchValue] = useState("");
    let [mDataList, setDataList] = useState([]);
    let [listGiaDichVu, setListGiaDichVu] = useState([]);
    let [isShowingConfirm, setShowingConfirm] = useState(false);

    var connectSocket = false;

    const getQueryParams = (url) => {
        let queryParams = {};
        var tmp = url.substring(url.lastIndexOf("?") + 1, url.length);
        if (tmp == "") return queryParams;
        let params = tmp.split("&");
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            var value = pair.lenght == 0 ? "" : pair[1];
            queryParams[pair[0]] = decodeURIComponent(value);
        }
        return queryParams;
    };
    const checkTokenDateTime = (token) => {
        if (token == null) return false;
        var dateCurrent = new Date();
        var tokenCheck = 0;
        try {
            tokenCheck = parseInt(token);
        } catch (e) {
            return false;
        }
        if (dateCurrent.getTime() < tokenCheck || dateCurrent.getTime() - tokenCheck >= 3600000) {
            return false;
        }
        return true;
    };

    const getState = (name) => {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name]) return null;
        return window.history.state.state[name];
    };

    const clearState = (name) => {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name]) return;
        window.history.pushState(window.history.state.state, "", window.href);
    };

    const loadHoaDon = async () => {
        isUpdateBill = 0;
        var updateHoadon = 0;
        var mahoadon = "";
        let mb = -1;
        var queryParams = getQueryParams(window.location.href);
        let pathname = window.location.href;
        if (pathname.endsWith("/")) pathname = pathname.substring(0, pathname.length - 1);

        if (pathname.indexOf("services/showbill") !== -1) {
            if (!queryParams || !queryParams.mahoadon) {
                props.alert("Đường dẫn không đúng");
                return;
            }
            updateHoadon = 2;
            mahoadon = queryParams.mahoadon;
        } else if (pathname.indexOf("services/updatebill") !== -1) {
            if (!queryParams || !queryParams.mahoadon) {
                props.alert("Đường dẫn không đúng");
                return;
            }
            if (queryParams.mahoadon != getState("mhdToken")) {
                props.alert("Đường dẫn không đúng");
                return;
            }
            if (!checkTokenDateTime(getState("tokenTime"))) {
                props.alert("Update đã hết hiệu lực, vui lòng làm lại");
                return;
            }

            updateHoadon = 1;
            mahoadon = queryParams.mahoadon;
        } else {
            try {
                let tmp = pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length);
                mb = Number.parseInt(tmp) - 1;
                setMaban(mb + 1);
            } catch (ex) {}
            if (mb < 0) {
                props.alert("Đường dẫn không đúng");
                window.close();
                return;
            }
        }

        props.setLoading(true, 5);
        try {
            await props.getAllProduct(props.token);

            await GetlistCustomer(props.token)
                .then((response) => {
                    listBienSo = response.data;
                    setListBienSo(response.data);
                    props.addLoading();
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể lấy danh sách khách hàng\nLỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
                });
            await GetListNVSuaChua(props.token)
                .then((response) => {
                    listNhanVienSuaChua = response.data;
                    setListNhanVienSuaChua(response.data);
                    props.addLoading();
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể lấy danh sách nhân viên sữa chữa\nLỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
                });
            await GetListCuaHangNgoai(props.token)
                .then((res) => {
                    setCuaHangNgoai(res.data);
                    props.addLoading();
                })
                .catch((err) => {
                    props.aerrorHttp(err, "Lỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
                });
            await GetListSalary(props.token)
                .then((respose) => {
                    setListGiaDichVu(respose.data);
                    props.addLoading();
                })
                .catch((err) => {
                    props.errorHttp(err, "Lỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
                });
        } catch (ex) {
            props.alert("Lỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
            return;
        }

        if (updateHoadon == 2) {
            isUpdateBill = 4;
            setUpdateBill(4);
            setMaHoaDon(mahoadon);
            showHoaDon(mahoadon);
            setShowInfoBill(true);
        } else if (updateHoadon == 1) {
            isUpdateBill = 3;
            setUpdateBill(3);
            setMaHoaDon(mahoadon);
            showHoaDon(mahoadon);
        } else {
            if (!connectSocket || !props.socket) return;
            props.socket.on("mahoadon", (data) => {
                if (!connectSocket) return;

                if (pathname.indexOf("services/repairedbill") !== -1) {
                    if (data && data.trangthai === 0) {
                        props.alert("Bạn đã bị ai đó hủy bàn này");
                        props.setLoading(false);
                        props.history.push("/service");
                        return;
                    }

                    if (data && data.trangthai && data.trangthai === 2) {
                        setUpdateBill(2);
                        setMaHoaDon(data.mahoadon);
                        showHoaDon(data.mahoadon);
                    } else {
                        mCustomerName.setValue("");
                        mPhone.setValue("");
                        mAddress.setValue("");
                        mThanhPho.setValue("An Giang");
                        mGioiTinh.setValue("0");
                        mMaKH.setValue("");
                        mSoKhung.setValue("");
                        mSoMay.setValue("");
                        mLoaiXe.setValue("");
                        props.deleteBillProduct();
                        props.addLoading();
                    }
                }
            });

            props.socket.emit("maban", mb);
        }
    };

    useEffect(() => {
        connectSocket = true;
        props.setLoading(true);
        loadHoaDon();
        return () => {
            connectSocket = false;
        };
    }, []);

    const removeItemToProduct = (item) => {
        var tong = 0;
        var tongCong = 0;
        var tongTienpt = 0;
        props.listBillProduct.forEach((element) => {
            tong += element.tongtien;
            tongCong += element.thanhtiencong;
            tongTienpt += element.thanhtienpt;
        });
        tong -= item.tongtien;
        tongCong -= item.thanhtiencong;
        tongTienpt -= item.thanhtienpt;

        setTongTienCong(tongCong);
        setTongTienPT(tongTienpt);
        setTongTienBill(tong);
    };

    const addItemToProduct = (item, isUpdate) => {
        var i = 0;
        for (i = 0; i < props.listBillProduct.length; i++) {
            if (checkHasItem(item, props.listBillProduct[i])) {
                break;
            }
        }
        var tong = 0;
        var tongCong = 0;
        var tongTienpt = 0;
        props.listBillProduct.forEach((element) => {
            tong += element.tongtien;
            tongCong += element.thanhtiencong;
            tongTienpt += element.thanhtienpt;
        });

        if (i == props.listBillProduct.length) {
            tong = tong + item.tongtien;
            tongCong += item.thanhtiencong;
            tongTienpt += item.thanhtienpt;
            setTongTienCong(tongCong);
            setTongTienPT(tongTienpt);
            setTongTienBill(tong);
            props.addBillProduct(item);
        } else {
            let newItem = props.listBillProduct[i];
            handleChangeSL(parseInt(newItem.soluongphutung) + parseInt(item.soluongphutung), i);
        }
    };
    const exportBill = () => {
        window.open(
            `${HOST}/billsuachua/mahoadon/${mMaHoaDon}/export`,
            "_blank" // <- This is what makes it open in a new window.
        );
    };

    const showHoaDon = (mahoadon) => {
        GetBillSuaChuaByMaHoaDon(props.token, mahoadon)
            .then((res) => {
                searchBienSoXe(res.data.biensoxe);
                searchNhanVienSuaChua(res.data.manvsuachua);
                showChiTietPhutung(res.data.chitiet);
                props.setListBillProduct(res.data.chitiet);
                mLoaiXe.setValue(res.data.loaixe);
                mMaKH.setValue(res.data.ma);
                ngaythanhtoan.setValue(res.data.ngaythanhtoan);
                setTrangThai(res.data.trangthai);
                setTuvan(res.data.tuvansuachua);
                setYeuCau(res.data.yeucaukhachhang);
                setKiemTraDinhKy(res.data.kiemtradinhky);
                setKiemTraLanToi(res.data.kiemtralantoi);
                setThoiGianHen(res.data.thoigianhen);
                setSoKM(res.data.sokm);
                setLydo(res.data.lydo);
                props.addLoading();

                var message = getState("message");
                if (message) {
                    clearState("message");
                    props.success(message);
                }
            })
            .catch((err) => {
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
            GetlistCustomer(props.token, `biensoxe=${values}`)
                .then((response) => {
                    if (biensoxe != values) return;
                    if (response.data && response.data[0] && response.data[0].biensoxe == values) {
                        updateCustomer(response.data[0]);
                    } else {
                        resetCustomer(lbs, values);
                    }
                })
                .catch((err) => {
                    if (biensoxe != values) return;
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
        biensoxe = values;
        setBienSoXe(values);
        if (listBienSo && listBienSo.length != 0) {
            setCustomer(listBienSo, values, enter);
        }
    };

    const setNhanVienSuaChua = (lbs, values) => {
        let nv = lbs.find((i) => i.ma.toString() === values.toString());
        if (nv) {
            tennhanvien.setValue(nv.ten);
        } else tennhanvien.setValue("");
    };
    const searchNhanVienSuaChua = (values) => {
        mMaNVSuaChua.setValue(values);
        if (listNhanVienSuaChua && listNhanVienSuaChua.length != 0) {
            setNhanVienSuaChua(listNhanVienSuaChua, values);
        }
    };

    const handleSaveBill = () => {
        var data = getData();
        if (data == null) {
            return;
        }
        var length = data.chitiet.length;
        var bsx = data.biensoxe;
        var mess =
            "Bạn muốn lưu hóa đơn này với: " +
            length +
            " phụ tùng và tổng tiền:" +
            data.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" }) +
            " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi lưu\n Vì hóa đơn này có " + length + " phụ tùng";
        }
        props.confirmError(mess, length == 0 ? 1 : 0, () => {
            SaveBill(props.token, data)
                .then((Response) => {
                    props.deleteBillProduct();
                    if (props.socket) props.socket.emit("bill", { maban: maban - 1, mahoadon: Response.data.mahoadon, biensoxe: bsx });
                    props.alert("Tạo Phiếu Sửa Chữa Thành Công - Mã Hóa Đơn:" + Response.data.mahoadon);
                    props.history.push("/services");
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể lưu phiếu sữa chưa: ");
                });
        });
    };
    const HuyHoaDon = () => {
        props.confirmError("Bạn chắc muốn hủy hóa đơn " + mMaHoaDon, 2, () => {
            HuyThanhToan(props.token, mMaHoaDon)
                .then((res) => {
                    if (props.socket) props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                    setMaHoaDon("");
                    props.alert("Hủy hóa đơn " + mMaHoaDon + " thành công");
                    props.history.push("/services");
                })
                .catch((err) => {
                    props.errorHttp(err, "Hủy hóa đơn " + mMaHoaDon + " thất bại");
                });
        });
    };

    const handleHuyBan = () => {
        props.confirmError("Bạn chắc muốn hủy bàn này", 2, () => {
            if (props.socket) props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
            setMaHoaDon("");
            props.history.push("/services");
        });
    };

    const DelItem = (item) => {
        removeItemToProduct(item);
        if (isUpdateBill !== 0 && !item.key) props.deleteItemBillProductMa(item.ma);
        else props.deleteItemBillProduct(item.key);
        setUpdated(false);
    };
    const getData = () => {
        if (
            (!biensoxe || biensoxe == "" || biensoxe == undefined) &&
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
            if (!lydo) {
                props.alert("Phải nhập lý do tại sao phải thay đổi hóa đơn.");
                return null;
            }
        }

        var tong = 0;
        var tienpt = 0;
        var tiencong = 0;
        var listProduct = [];
        for (let i = 0; i < props.listBillProduct.length; i++) {
            tong = tong + props.listBillProduct[i].tongtien;
            tiencong = tiencong + props.listBillProduct[i].thanhtiencong;
            tienpt = tienpt + props.listBillProduct[i].thanhtienpt;

            let temp = {
                loaiphutung: props.listBillProduct[i].loaiphutung,
                tenphutungvacongviec: props.listBillProduct[i].tenphutungvacongviec,
                maphutung: props.listBillProduct[i].maphutung,
                soluongphutung: props.listBillProduct[i].soluongphutung,
                tiencong: props.listBillProduct[i].tiencong,
                tienpt: props.listBillProduct[i].tienpt,
                thanhtiencong: props.listBillProduct[i].thanhtiencong,
                thanhtienpt: props.listBillProduct[i].thanhtienpt,
                dongia: props.listBillProduct[i].dongia,
                chietkhau: props.listBillProduct[i].chietkhau,
                manvsuachua: mMaNVSuaChua.value,
                tongtien: props.listBillProduct[i].tongtien,
            };
            listProduct.push(temp);
        }

        for (var i = 0; i < listProduct.length; i++) {
            var item = listProduct[i];
            if (item.soluongphutung <= 0) {
                props.alert("Phụ tùng :" + item.tenphutungvacongviec + " có số lượng <= 0");
                return null;
            }
            if (item.dongia < 0) {
                props.alert("Phụ tùng :" + item.tenphutungvacongviec + " có đơn giá < 0");
                return null;
            }
            if (item.chietkhau < 0 || item.chietkhau > 100) {
                props.alert("Phụ tùng :" + item.tenphutungvacongviec + " có chiết kháu không hợp lệ");
                return null;
            }
            if (item.tiencong < 0) {
                props.alert("Phụ tùng :" + item.tenphutungvacongviec + " có tiền công < 0");
                return null;
            }
        }

        if (tienpt + tiencong != tong) {
            props.alert("Hóa đơn đang có lỗi, vui lòng tạo lại");
            return;
        }

        var data = {
            manvsuachua: mMaNVSuaChua.value,
            tenkh: mCustomerName.value,
            sodienthoai: mPhone.value,
            diachi: mAddress.value,
            thanhpho: mThanhPho.value,
            gioitinh: mGioiTinh.value,
            loaixe: mLoaiXe.value,
            somay: mSoMay.value,
            sokhung: mSoKhung.value,
            makh: mMaKH.value && mMaKH.value != "" ? mMaKH.value : null,
            tongtien: tong,
            tienpt: tienpt,
            tiencong: tiencong,
            biensoxe: biensoxe,
            chitiet: listProduct,
            manv: props.info.ma,
            yeucaukhachhang: yeucau,
            tuvansuachua: tuvan,
            lydo: lydo,
            kiemtradinhky: kiemtradinhky ? kiemtradinhky : "0",
            kiemtralantoi: kiemtralantoi,
            thoigianhen: thoigianhen,
            sokm: sokm ? sokm : 0,
        };
        return data;
    };
    const thanhToanHoaDon = () => {
        var data = getData();
        if (data == null) return;
        data.mahoadon = mMaHoaDon;

        var length = data.chitiet.length;
        var mess =
            "Bạn muốn thanh toán hóa đơn " +
            mMaHoaDon +
            " với tổng tiền: " +
            data.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" }) +
            " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi thanh toán hóa đơn " + mMaHoaDon + "\n Vì hóa đơn này có " + length + " phụ tùng";
        }
        if (!data.tenkh) {
            mess = "Hóa đơn này không có tên khách hàng\n Lưu ý trước khi thanh toán hóa đơn " + mMaHoaDon;
        }

        props.confirmError(mess, !data.tenkh || length == 0 ? 1 : 0, () => {
            UpdateBill(props.token, data)
                .then(() => {
                    ThanhToan(props.token, mMaHoaDon)
                        .then(() => {
                            if (props.socket) props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                            setMaHoaDon("");
                            exportBill();
                            props.alert("Thanh toán hóa đơn " + mMaHoaDon + " thành công");
                            props.history.push("/services");
                        })
                        .catch((err) => {
                            props.errorHttp(err, "Không thể  thanh toán hóa đơn " + mMaHoaDon + "\nVui lòng kiểm lại đường mạng");
                        });
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể  update hóa đơn " + mMaHoaDon + "\nVui lòng kiểm lại đường mạng");
                });
        });
    };
    const UpdateHoaDon = () => {
        var data = getData();
        if (data == null) return;

        var length = data.chitiet.length;
        var mess =
            "Bạn muốn update hóa đơn " +
            mMaHoaDon +
            " với tổng tiền:" +
            data.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" }) +
            " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi thanh toán hóa đơn " + mMaHoaDon + "\n Vì hóa đơn này có " + length + " phụ tùng";
        }
        if (!data.tenkh) {
            mess = "Hóa đơn này không có tên khách hàng\n Lưu ý trước khi thanh toán hóa đơn " + mMaHoaDon;
        }
        props.confirmError(mess, !data.tenkh || length == 0 ? 1 : 0, () => {
            data.mahoadon = mMaHoaDon;
            UpdateBill(props.token, data)
                .then((res) => {
                    if (isUpdateBill == 4 || isUpdateBill == 3) {
                        setUpdated(true);
                        props.history.push("/services/showbill?mahoadon=" + mMaHoaDon, { message: "Update hóa đơn " + mMaHoaDon + " thành công" });
                    } else {
                        props.success("Update hóa đơn " + mMaHoaDon + " thành công");
                        setUpdated(true);
                    }
                })
                .catch((err) => {
                    props.errorHttp(err, "Không thể  update hóa đơn " + mMaHoaDon + "\nVui lòng kiểm lại đường mạng");
                });
        });
    };

    const showChiTietPhutung = (product) => {
        product.forEach((element) => {
            if (element.loaiphutung === null) {
                if (element.dongia == 0) {
                    element.soluongphutung = 1;
                    element.dongia = element.tiencong;
                    element.thanhtiencong = element.tiencong;
                    element.thanhtienpt = 0;
                    element.loaiphutung = "tiencong";
                    element.tongtien = element.thanhtiencong + element.thanhtienpt;
                } else {
                    element.tienpt = utils.tinhTongTien(element.dongia, element.soluongphutung);
                    element.thanhtienpt = utils.tinhTongTien(element.dongia, element.soluongphutung, element.chietkhau);
                    element.thanhtiencong = utils.tinhTongTien(element.tiencong, 1, element.chietkhau);
                    element.tongtien = element.thanhtienpt + element.thanhtiencong;
                    if (element.maphutung) {
                        element.loaiphutung = "phutung";
                    } else {
                        element.loaiphutung = "cuahangngoai";
                    }
                }
            }
        });

        updateTongTienBill(product);
    };

    const updateTongTienBill = (product) => {
        var tong = 0;
        var tongCong = 0;
        var tongTienpt = 0;
        product.forEach((element) => {
            tong += element.tongtien;
            tongCong += element.thanhtiencong;
            tongTienpt += element.thanhtienpt;
        });

        setTongTienCong(tongCong);
        setTongTienPT(tongTienpt);
        setTongTienBill(tong);
    };

    const updateItemNew = (newItem, index) => {
        try {
            if (newItem.loaiphutung == "tiencong") {
                newItem.tienpt = 0;
                newItem.thanhtienpt = 0;
                newItem.tiencong = utils.tinhTongTien(newItem.dongia, newItem.soluongphutung, 0);
                newItem.thanhtiencong = utils.tinhTongTien(newItem.dongia, newItem.soluongphutung, newItem.chietkhau);
            } else {
                newItem.thanhtiencong = utils.tinhTongTien(newItem.tiencong, 1, newItem.chietkhau);
                newItem.tienpt = utils.tinhTongTien(newItem.dongia, newItem.soluongphutung, 0);
                newItem.thanhtienpt = utils.tinhTongTien(newItem.dongia, newItem.soluongphutung, newItem.chietkhau);
            }
            newItem.tongtien = newItem.thanhtiencong + newItem.thanhtienpt;

            let newProduct = [
                ...props.listBillProduct.slice(0, index),
                newItem,
                ...props.listBillProduct.slice(index + 1, props.listBillProduct.lenght),
            ];
            props.setListBillProduct(newProduct);
            updateTongTienBill(newProduct);
        } catch (ex) {}
    };

    const handleChangeSL = (value, index) => {
        try {
            let newItem = props.listBillProduct[index];
            newItem.soluongphutung = utils.parseInt(value, 1, 1000);

            updateItemNew(newItem, index);
        } catch (error) {}
    };

    const handleChangeChieuKhau = (value, index) => {
        try {
            let newItem = props.listBillProduct[index];
            newItem.chietkhau = utils.parseInt(value, 0, 100);
            updateItemNew(newItem, index);
        } catch (ex) {}
    };

    const handleChangeTienCong = (value, index) => {
        let newItem = props.listBillProduct[index];
        newItem.tiencong = utils.parseInt(value);
        updateItemNew(newItem, index);
    };

    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleButtonSearch();
        }
    };

    const SliceTop20 = (list) => {
        var arr = list.filter((e) => e.soluongtonkho > 0);
        setDataList(arr.slice(0, 20));
    };
    const searchMaPhuTung = (values) => {
        setSearchValue(values);
        if (values === "") {
            SliceTop20(props.listProduct);
            return;
        }
        let product = props.listProduct.filter(function (item) {
            return item.maphutung.toLowerCase().includes(values.toLowerCase()) || item.tentiengviet.toLowerCase().includes(values.toLowerCase());
        });
        if (product.length !== 0) {
            if (product.length != 1 || product[0].maphutung != values) {
                SliceTop20(product);
            }
        }
    };
    const checkHasRender = (Search, item) => {
        let strSearch = Search.toLowerCase();
        return item.maphutung != "" && item.maphutung.toLowerCase() == strSearch;
    };

    const handleButtonSearch = () => {
        let search = searchValue;
        let list = props.listProduct.filter(function (item) {
            return checkHasRender(search, item);
        });

        if (!list || list.length == 0) {
            props.alert("Không tìm thấy item: " + search);
            return;
        }
        var item = list[0];

        if (!item.maphutung || item.maphutung === "") {
            props.alert("mã phụ tùng không đúng: " + item.maphutung);
            return;
        }
        if (!item.giaban_le || !item.giaban_le < 0) {
            props.alert("phụ tùng không hợp lệ");
            return;
        }

        const dongia = utils.parseInt(item.giaban_le);
        var newData = {
            key: props.listBillProduct.length + 1,
            loaiphutung: "phutung",
            tenphutungvacongviec: item.tentiengviet,
            maphutung: item.maphutung,
            dongia: dongia,
            chietkhau: 0,
            soluongphutung: 1,
            tienpt: dongia,
            tiencong: 0,
            thanhtiencong: 0,
            thanhtienpt: dongia,
            tongtien: dongia,
            nhacungcap: "Trung Trang",
        };
        addItemToProduct(newData, false);
        setSearchValue("");
    };

    const checkHasItem = (sp, item) => {
        if (sp.tenphutungvacongviec.toLowerCase() == "" || sp.tenphutungvacongviec.toLowerCase() != item.tenphutungvacongviec.toLowerCase())
            return false;
        if (!sp.maphutung || sp.maphutung == "" || sp.maphutung.toLowerCase() != item.maphutung.toLowerCase()) return false;
        if (!sp.nhacungcap || sp.nhacungcap == "" || sp.nhacungcap != "Trung Trang" || sp.nhacungcap.toLowerCase() != item.nhacungcap.toLowerCase())
            return false;
        if (!sp.dongia || sp.dongia < 0 || sp.dongia != item.dongia) return false;
        return true;
    };
    const handleRedirectUpdate = () => {
        setShowingConfirm(true);
    };

    return (
        <div>
            {props.isLoading && <Loading></Loading>}
            {!props.isLoading && (
                <div>
                    {isUpdateBill === 0 ? (
                        <h1 style={{ textAlign: "center" }}>Phiếu sửa chữa (Bàn số: {maban})</h1>
                    ) : (
                        <h1 style={{ textAlign: "center" }}>
                            Phiếu sửa chữa (Mã Hóa Đơn: {mMaHoaDon}) {maban > 0 ? `(Bàn số: ${maban})` : ""}
                        </h1>
                    )}

                    <DivFlexRow style={{ alignItems: "center" }}>
                        <DivFlexColumn>
                            <label>Nhân viên sửa chữa: </label>
                            <Input
                                readOnly={showInfoBill}
                                autocomplete="off"
                                list="nv_suachua"
                                name="nv_suachua"
                                value={mMaNVSuaChua.value}
                                onChange={(e) => {
                                    searchNhanVienSuaChua(e.target.value);
                                }}
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
                            <Input readOnly autocomplete="off" {...tennhanvien} />
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
                                value={biensoxe || ""}
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
                            <Select {...mGioiTinh} style={{ width: 100 }}>
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                            </Select>
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Thành Phố: </label>
                            <Select readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" {...mThanhPho}>
                                {ListThanhPho.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </Select>
                        </DivFlexColumn>
                    </DivFlexRow>
                    <DivFlexRow style={{ alignItems: "center" }}>
                        <DivFlexColumn>
                            <label>Loại xe: </label>
                            <Input readOnly={showInfoBill} autocomplete="off" list="loai_xe" name="loai_xe" {...mLoaiXe} />
                            <datalist id="loai_xe">
                                {listLoaiXe.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </datalist>
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
                            <Input
                                readOnly={showInfoBill}
                                disabled={isDisableEditInfo}
                                autocomplete="off"
                                value={sokm}
                                type="Number"
                                max={999999}
                                min={0}
                                onChange={(e) => {
                                    setSoKM(e.target.value);
                                }}
                            />
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
                        <Button disabled={!biensoxe} onClick={() => setShowHistoryCustomer(true)} style={{ marginLeft: 20, marginTop: 10 }}>
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
                                    value={moment(trangthai == 1 && ngaythanhtoan.value ? ngaythanhtoan.value : new Date())
                                        .add(thoigianhen, "days")
                                        .format("DD/MM/YYYY")}
                                />
                            </If>
                        </DivFlexColumn>
                    </DivFlexRow>
                    {(isUpdateBill == 3 || lydo) && (
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
                    )}

                    {isUpdateBill < 4 && (
                        <DivFlexRow style={{ marginTop: 5, marginBottom: 5, alignItems: "center", justifyContent: "space-between" }}>
                            <DivFlexRow style={{ alignItems: "center" }}>
                                <label> Bảng giá phụ tùng: </label>
                                <Input
                                    autoFocus
                                    list="browser_search_suachua"
                                    onKeyPress={_handleKeyPress}
                                    value={searchValue}
                                    style={{ width: 250, marginRight: 15 }}
                                    onChange={(e) => searchMaPhuTung(e.target.value)}
                                />
                                <datalist id="browser_search_suachua">
                                    {mDataList.map((item, index) => (
                                        <option disabled={item.soluongtonkho === 0} key={index} value={item.maphutung}>
                                            {item.tentiengviet} ({item.soluongtonkho})
                                        </option>
                                    ))}
                                </datalist>
                                <Button
                                    onClick={() => {
                                        handleButtonSearch();
                                    }}
                                >
                                    Tìm Kiếm <i className="fas fa-search" />
                                </Button>
                            </DivFlexRow>
                            <DivFlexRow style={{ alignItems: "center", float: "right" }}>
                                <Button
                                    onClick={() => {
                                        setShowTienCong(true);
                                        setUpdated(false);
                                    }}
                                >
                                    {" "}
                                    Thêm Tiền Công{" "}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowCuaHangNgoai(true);
                                        setUpdated(false);
                                    }}
                                >
                                    {" "}
                                    Thêm của hàng ngoài{" "}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowNewBill(true);
                                        setUpdated(false);
                                    }}
                                >
                                    {" "}
                                    Thêm mới{" "}
                                </Button>
                            </DivFlexRow>
                        </DivFlexRow>
                    )}
                    <Table>
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}>STT</th>
                                <th>
                                    Tên phụ tùng <br /> và công việc
                                </th>
                                <th>Mã phụ tùng</th>
                                <th>Đơn giá</th>
                                <th style={{ maxWidth: 100 }}>SL</th>
                                <th style={{ maxWidth: 100 }}>Chiết khấu (%)</th>
                                <th style={{ maxWidth: 150 }}>Tiền phụ tùng</th>
                                <th>Tiền công</th>
                                <th>
                                    Tổng tiền công <br />+ phụ tùng
                                </th>
                                <If condition={!showInfoBill}>
                                    <th style={{ width: 100 }}>
                                        <i className="far fa-trash-alt"></i>
                                    </th>
                                </If>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listBillProduct &&
                                props.listBillProduct.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.tenphutungvacongviec}</td>
                                        <td>{item.maphutung}</td>
                                        <td>{item.dongia.toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                                        <td>
                                            <input
                                                style={{ maxWidth: 60, textAlign: "right" }}
                                                readOnly={showInfoBill || item.loaiphutung == "tiencong"}
                                                type="number"
                                                max={1000}
                                                onChange={(e) => handleChangeSL(e.target.value, index)}
                                                value={item.soluongphutung}
                                                min="1"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                style={{ maxWidth: 100, textAlign: "right" }}
                                                readOnly={showInfoBill}
                                                type="number"
                                                max={100}
                                                onChange={(e) => handleChangeChieuKhau(e.target.value, index)}
                                                value={item.chietkhau}
                                                min="0"
                                            />
                                        </td>
                                        <td>{utils.formatVND(item.tienpt)}</td>
                                        <td>
                                            <input
                                                style={{ width: "90%", maxWidth: 150, textAlign: "right" }}
                                                readOnly={showInfoBill || item.loaiphutung == "tiencong"}
                                                type="number"
                                                max={100}
                                                onChange={(e) => handleChangeTienCong(e.target.value, index)}
                                                value={item.tiencong}
                                                min="0"
                                            />
                                        </td>
                                        <td>{utils.formatVND(item.tongtien)}</td>
                                        <If condition={!showInfoBill}>
                                            <td>
                                                <ButtonDelete data={item} onClick={DelItem} />
                                            </td>
                                        </If>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>

                    <DivFlexRow style={{ marginTop: 15, marginBottom: 5, justifyContent: "end" }}>
                        <DivFlexColumn style={{ marginTop: 10, marginRight: 20 }}>
                            <h4 style={{ textAlign: "center" }}>
                                Tiền PT: {tongTienPT.toLocaleString("vi-VI", { style: "currency", currency: "VND" })} ,
                            </h4>
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginTop: 10, marginRight: 20 }}>
                            <h4 style={{ textAlign: "center" }}>
                                Tiền Công : {tongTienCong.toLocaleString("vi-VI", { style: "currency", currency: "VND" })} ,
                            </h4>
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginTop: 10, marginRight: 5 }}>
                            <h4 style={{ textAlign: "center" }}>
                                Tổng Tiền : {tongTienBill.toLocaleString("vi-VI", { style: "currency", currency: "VND" })}{" "}
                            </h4>
                        </DivFlexColumn>
                    </DivFlexRow>

                    {isUpdateBill < 4 ? (
                        <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: "space-between" }}>
                            <label></label>
                            {isUpdateBill === 0 ? (
                                <DivFlexRow>
                                    <CancleButton
                                        onClick={() => {
                                            handleHuyBan();
                                        }}
                                    >
                                        {" "}
                                        Hủy bàn{" "}
                                    </CancleButton>
                                    <Button
                                        onClick={() => {
                                            handleSaveBill();
                                        }}
                                    >
                                        {" "}
                                        Lưu{" "}
                                    </Button>
                                </DivFlexRow>
                            ) : (
                                <DivFlexRow>
                                    <Button
                                        onClick={() => {
                                            UpdateHoaDon();
                                        }}
                                    >
                                        {" "}
                                        Update{" "}
                                    </Button>
                                    {isUpdateBill != 3 && (
                                        <Button
                                            style={{ marginLeft: 15 }}
                                            onClick={() => {
                                                thanhToanHoaDon();
                                            }}
                                        >
                                            {" "}
                                            Update và Thanh toán{" "}
                                        </Button>
                                    )}
                                    {isUpdateBill != 3 && (
                                        <DelButton
                                            style={{ marginLeft: 15 }}
                                            onClick={() => {
                                                HuyHoaDon();
                                            }}
                                        >
                                            {" "}
                                            Hủy{" "}
                                        </DelButton>
                                    )}
                                </DivFlexRow>
                            )}
                        </DivFlexRow>
                    ) : (
                        <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: "space-between" }}>
                            <label></label>
                            {moment().valueOf() - moment(ngaythanhtoan.value).valueOf() <= oneDay && (
                                <Button
                                    onClick={() => {
                                        handleRedirectUpdate();
                                    }}
                                >
                                    {" "}
                                    Update{" "}
                                </Button>
                            )}
                        </DivFlexRow>
                    )}
                    <PopupBillTienCong
                        alert={(mess) => props.alert(mess)}
                        addItemToProduct={(item) => addItemToProduct(item)}
                        isShowing={isShowTienCong}
                        listGiaDichVu={listGiaDichVu}
                        onCloseClick={() => {
                            setShowTienCong(false);
                        }}
                    />
                    <PopupBillCHN
                        alert={(mess) => props.alert(mess)}
                        addItemToProduct={(item) => addItemToProduct(item)}
                        isShowing={isShowCuaHangNgoai}
                        listCuaHangNgoai={listCuaHangNgoai}
                        onCloseClick={() => {
                            setShowCuaHangNgoai(false);
                        }}
                    />
                    <PopupAccessory
                        alert={(mess) => props.alert(mess)}
                        addItemToProduct={(item) => addItemToProduct(item)}
                        isShowing={isShowNewBill}
                        listProduct={props.listProduct}
                        onCloseClick={() => {
                            setShowNewBill(false);
                        }}
                    />

                    <ConfirmHoaDon
                        isShowing={isShowingConfirm}
                        onCloseClick={() => setShowingConfirm(false)}
                        mahoadon={mMaHoaDon}
                        token={props.token}
                        history={props.history}
                        alert={(mess) => props.alert(mess)}
                    />

                    <HistoryCustomer
                        alert={props.alert}
                        error={props.error}
                        confirm={props.confirm}
                        isShowing={isShowHistoryCustomer}
                        onCloseClick={() => {
                            setShowHistoryCustomer(false);
                        }}
                        ma={mMaKH.value && mMaKH.value !== "" ? mMaKH.value : null}
                    />
                </div>
            )}
        </div>
    );
};
const mapState = (state) => ({
    token: state.Authenticate.token,
    listBillProduct: state.Product.listBillProduct,
    listProduct: state.Product.listProduct,
    isLoading: state.App.isLoading,
    info: state.Authenticate.info,
});
const mapDispatch = (dispatch) => ({
    deleteBillProduct: () => {
        dispatch(deleteBillProduct());
    },
    deleteItemBillProduct: (key) => {
        dispatch(deleteItemBillProduct(key));
    },
    deleteItemBillProductMa: (key) => {
        dispatch(deleteItemBillProductMa(key));
    },
    setListBillProduct: (arr) => {
        dispatch(setListBillProduct(arr));
    },
    addBillProduct: (data) => {
        dispatch(addBillProduct(data));
    },
    getAllProduct: (token) => {
        dispatch(getAllProduct(token));
    },
    updateBillProduct: (data, index) => {
        dispatch(updateBillProduct(data, index));
    },
});
export default withRouter(connect(mapState, mapDispatch)(RepairedBill));
// export default RepairedBill;
