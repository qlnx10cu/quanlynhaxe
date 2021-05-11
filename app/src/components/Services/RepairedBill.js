import React, { useState, useEffect } from 'react'
import { DivFlexRow, DivFlexColumn, Button, Input, Table, DelButton, Modal, ModalContent, CloseButton, Textarea } from '../../styles'
import PopupAccessory from './PopupAccessory'
import PopupBillTienCong from './PopupBillTienCong'
import HistoryCustomer from '../Admin/HistoryCustomer'
import lib from '../../lib'
import { HOST } from '../../Config'
import { connect } from 'react-redux'
import { UpdateBill, SaveBill, ThanhToan, HuyThanhToan, GetBillSuaChuaByMaHoaDon, CheckUpdateBill } from '../../API/Bill'
import { GetlistCustomer } from '../../API/Customer'
import { GetListNVSuaChua } from '../../API/Staffs'
import { deleteBillProduct, deleteItemBillProduct, setListBillProduct, updateBillProduct, deleteItemBillProductMa } from '../../actions/Product';
import { withRouter } from 'react-router-dom'
import PopupBillCHN from './PopupBillCHN';
import { GetListCuaHangNgoai } from '../../API/CuaHangNgoai'
import { GetListSalary } from '../../API/Salary'
import { addBillProduct, getAllProduct } from '../../actions/Product';
import moment from 'moment'
import Loading from '../Loading'

const oneDay = 1000 * 3600 * 24;

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
]

const ConfirmHoaDon = (props) => {
    let [maBarcode, setMaBarcode] = useState("");

    const UpdateHoaDon = (maHoaDon) => {
        var date = new Date();
        let url = `/services/repairedbill/updatebill?mahoadon=${maHoaDon}`;
        props.history.push(url, { tokenTime: date.getTime() });
        props.history.go();
    }

    const confirmBarCodeByServer = () => {
        if (!maBarcode) {
            props.alert("vui lòng nhập mã code");
            return;
        }

        CheckUpdateBill(props.token, { ma: maBarcode, mahoadon: props.mahoadon }).then(res => {
            if (res && res.data && res.data.error && res.data.error >= 1) {
                setMaBarcode("")
                UpdateHoaDon(props.mahoadon)
                props.onCloseClick();
            } else {
                props.alert("Mã code không đúng, vui lòng nhập lại")
            }
        }).catch(err => {
            props.alert("Lỗi : " + err.message)
        })
    }

    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            confirmBarCodeByServer();
        }
    };
    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent style={{ width: '90%' }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => { setMaBarcode(""); props.onCloseClick() }}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: 'center' }}>HEAD TRUNG TRANG</h3>
                <h4 style={{ textAlign: 'center' }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
                <h5 style={{ textAlign: 'center' }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
                <DivFlexRow style={{ alignItems: 'center', textAlign: 'center' }}>
                    <label>Nhập barcode: </label>
                    <Input type="password" autocomplete="off" value={maBarcode} onKeyPress={_handleKeyPress} style={{ marginLeft: 10 }} onChange={(e) => setMaBarcode(e.target.value)} />
                    <Button style={{ marginLeft: 10 }} onClick={() => {
                        confirmBarCodeByServer();
                    }}>Thay đổi</Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>


    );
}


const RepairedBill = (props) => {

    let mCustomerName = lib.handleInput("");
    let mPhone = lib.handleInput("");
    let mAddress = lib.handleInput("");
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
    let tennhanvien = lib.handleInput("");
    let mLoaiXe = lib.handleInput("");
    let mSoKhung = lib.handleInput("");
    let mSoMay = lib.handleInput("");
    let ngaythanhtoan = lib.handleInput("");

    let [sokm, setSoKM] = useState("");
    let [yeucau, setYeuCau] = useState("");
    let [tuvan, setTuvan] = useState("");
    let [lydo, setLydo] = useState("");
    let [searchValue, setSearchValue] = useState("");
    let [mDataList, setDataList] = useState([]);
    let [listGiaDichVu, setListGiaDichVu] = useState([]);
    let [isShowingConfirm, setShowingConfirm] = useState(false);

    const getQueryParams = (url) => {
        let queryParams = {};
        var tmp = url.substring(url.lastIndexOf('?') + 1, url.length);
        if (tmp == "")
            return queryParams;
        let params = tmp.split('&');
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split('=');
            var value = pair.lenght == 0 ? "" : pair[1];
            queryParams[pair[0]] = decodeURIComponent(value);
        }
        return queryParams;
    };
    const checkTokenDateTime = (token) => {
        if (token == null)
            return false;
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
    }

    const getState = (name) => {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name])
            return null;
        return window.history.state.state[name];
    }

    const clearState = (name) => {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name])
            return;
        window.history.pushState(window.history.state.state, '', window.href);
    }

    useEffect(() => {
        props.setLoading(true);
        var updateHoadon = 0;
        var mahoadon = '';
        let mb = -1;
        let pathname = window.location.href;
        if (pathname.endsWith("/"))
            pathname = pathname.substring(0, pathname.length - 1);
        if (pathname.indexOf("services/repairedbill/showbill") !== -1) {
            var queryParams = getQueryParams(window.location.href);
            if (!queryParams || !queryParams.mahoadon) {
                props.alert("Đường dẫn không đúng");
                return;
            }
            updateHoadon = 2;
            mahoadon = queryParams.mahoadon;
        } else if (pathname.indexOf("services/repairedbill/updatebill") !== -1) {
            var queryParams = getQueryParams(window.location.href);
            if (!queryParams || !queryParams.mahoadon) {
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
                let tmp = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
                mb = Number.parseInt(tmp) - 1;
                setMaban(mb + 1);
            } catch (ex) {
            }
            if (mb < 0) {
                props.alert("Đường dẫn không đúng");
                window.close()
                return;
            }
        }

        props.setLoading(true, 5);
        try {
            props.getAllProduct(props.token);

            GetlistCustomer(props.token).then(response => {
                setListBienSo(response.data);
                props.addLoading();
            }).catch(err => {
                props.alert("Không thể lấy danh sách khách hàng\nLỗi kết nối đến server\nVui lòng kiểm tra đường mạng")
            })
            GetListNVSuaChua(props.token).then(response => {
                setListNhanVienSuaChua(response.data);
                props.addLoading();
            }).catch(err => {
                props.alert("Không thể lấy danh sách nhân viên sữa chữa\nLỗi kết nối đến server\nVui lòng kiểm tra đường mạng")
            })
            GetListCuaHangNgoai(props.token).then(res => {
                setCuaHangNgoai(res.data);
                props.addLoading();
            }).catch(err => {
                props.alert("Lỗi kết nối đến server\nVui lòng kiểm tra đường mạng")
            })
            GetListSalary(props.token).then(respose => {
                setListGiaDichVu(respose.data);
                props.addLoading();
            }).catch(err => {
                props.alert("Lỗi kết nối đến server\nVui lòng kiểm tra đường mạng")
            })
        } catch (ex) {
            props.alert("Lỗi kết nối đến server\nVui lòng kiểm tra đường mạng");
            window.close()
            return;
        }

        if (updateHoadon == 2) {
            setUpdateBill(4);
            setMaHoaDon(mahoadon)
            showHoaDon(mahoadon);
            setShowInfoBill(true);
        }
        else if (updateHoadon == 1) {
            setUpdateBill(3);
            setMaHoaDon(mahoadon)
            showHoaDon(mahoadon);
        }
        else {
            props.socket.on("mahoadon", (data) => {

                if (pathname.indexOf("services/repairedbill") !== -1) {
                    if (data && data.trangthai === 0) {
                        props.history.goBack();
                    }

                    if (data && data.trangthai && data.trangthai === 2) {
                        setUpdateBill(2);
                        setMaHoaDon(data.mahoadon);
                        showHoaDon(data.mahoadon);
                    }
                    else {
                        mCustomerName.setValue("");
                        mPhone.setValue("");
                        mAddress.setValue("");
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
    }, [])

    const removeItemToProduct = (item) => {
        var tong = 0;
        props.listBillProduct.forEach(element => {
            tong += element.tongtien;
        });
        tong -= item.tongtien;
        setTongTienBill(tong);
    }

    const addItemToProduct = (item, isUpdate) => {

        var i = 0;
        for (i = 0; i < props.listBillProduct.length; i++) {
            if (checkHasItem(item, props.listBillProduct[i])) {
                break;
            }
        }
        var tong = 0;
        props.listBillProduct.forEach(element => {
            tong += element.tongtien;
        });

        if (i == props.listBillProduct.length) {
            setTongTienBill(tong + item.tongtien);
            props.addBillProduct(item);
        }
        else {
            let newItem = props.listBillProduct[i];
            handleChangeSL(parseInt(newItem.soluongphutung) + parseInt(item.soluongphutung), i);
        }
    }
    const exportBill = () => {
        window.open(
            `${HOST}/billsuachua/mahoadon/${mMaHoaDon}/export`,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    const showHoaDon = (mahoadon) => {
        GetBillSuaChuaByMaHoaDon(props.token, mahoadon).then(res => {
            searchBienSoXe(res.data.biensoxe);
            searchNhanVienSuaChua(res.data.manvsuachua);
            updateTongTienBill(res.data.chitiet);
            props.setListBillProduct(res.data.chitiet);
            mLoaiXe.setValue(res.data.loaixe);
            mMaKH.setValue(res.data.ma);
            ngaythanhtoan.setValue(res.data.ngaythanhtoan);
            setTuvan(res.data.tuvansuachua);
            setYeuCau(res.data.yeucaukhachhang);
            setSoKM(res.data.sokm);
            setLydo(res.data.lydo);
            props.addLoading();

            var message = getState("message");
            if (message) {
                clearState("message");
                props.success(message);
            }
        })
            .catch(err => {
                props.alert("Không lấy được hóa đơn\nVui lòng kiểm tra đường mạng")
            })
    }
    const setCustomer = (lbs, values) => {
        let customer = lbs.find(function (item) {
            return item.biensoxe === values;
        });
        if (customer !== undefined) {
            mCustomerName.setValue(customer.ten);
            mPhone.setValue(customer.sodienthoai);
            mAddress.setValue(customer.diachi);
            mMaKH.setValue(customer.ma);
            mSoKhung.setValue(customer.sokhung);
            mSoMay.setValue(customer.somay);
            mLoaiXe.setValue(customer.loaixe);
            setDisableEditInfo(false);
        }
        else {
            if (values) {
                let customers = lbs.filter(function (item) {
                    return (item.biensoxe.toLowerCase().includes(values.toLowerCase()));
                });
                setListBienSoCurrent(customers.slice(0, 20));
            }
            mCustomerName.setValue("");
            mPhone.setValue("");
            mAddress.setValue("");
            mMaKH.setValue("");
            mSoKhung.setValue("");
            mSoMay.setValue("");
            mLoaiXe.setValue("");
            setDisableEditInfo(false);
        }
    };

    const searchBienSoXe = (values) => {

        setBienSoXe(values);
        if (!listBienSo || listBienSo.length == 0) {
            GetlistCustomer(props.token).then(response => {
                setListBienSo(response.data);
                setCustomer(response.data, values);
            })
        }
        else
            setCustomer(listBienSo, values);

    }

    const setNhanVienSuaChua = (lbs, values) => {
        let nv = lbs.find(i => i.ma.toString() === values.toString());
        if (nv) {
            tennhanvien.setValue(nv.ten);
        }
        else
            tennhanvien.setValue("");
    };
    const searchNhanVienSuaChua = (values) => {
        mMaNVSuaChua.setValue(values);
        if (!listNhanVienSuaChua || listNhanVienSuaChua.length == 0) {
            GetListNVSuaChua(props.token).then(response => {
                setListNhanVienSuaChua(response.data);
                setNhanVienSuaChua(response.data, values);
            })
        }
        else
            setNhanVienSuaChua(listNhanVienSuaChua, values);

    };

    const handleSaveBill = () => {
        var data = getData()
        if (data == null) {
            props.error("Không thể lưu phiếu sữa chưa: ");;
            return;
        }
        var length = data.chitiet.length;
        var bsx = data.biensoxe;
        var mess = "Bạn muốn lưu hóa đơn này với: " + length + " phụ tùng và tổng tiền:" + data.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' }) + " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi lưu\n Vì hóa đơn này có " + length + " phụ tùng"
        }
        props.confirmError(mess, length == 0 ? 1 : 0, () => {
            SaveBill(props.token, data).then(Response => {
                props.deleteBillProduct();
                props.socket.emit("bill", { maban: maban - 1, mahoadon: Response.data.mahoadon, biensoxe: bsx });
                props.alert("Tạo Phiếu Sửa Chữa Thành Công - Mã Hóa Đơn:" + Response.data.mahoadon);
                props.history.push("/services")
                props.history.push("/services")
                props.history.goBack();
            }).catch(err => {
                props.error("Không thể lưu phiếu sữa chưa: ");
                console.log(err);
            })
        });

    }
    const HuyHoaDon = () => {
        props.confirmError("Bạn chắc muốn hủy hóa đơn " + mMaHoaDon, 2, () => {
            HuyThanhToan(props.token, mMaHoaDon).then(res => {
                props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                setMaHoaDon("");
                props.alert('Hủy hóa đơn ' + mMaHoaDon + ' thành công');
                props.history.push("/services")
                props.history.push("/services")
                props.history.goBack();
            }).catch(err => {
                props.error('Hủy hóa đơn ' + mMaHoaDon + ' thất bại');
                console.log(err);
            })
        })
    }

    const DelItem = (item) => {
        removeItemToProduct(item)
        if (isUpdateBill !== 0 && !item.key)
            props.deleteItemBillProductMa(item.ma);
        else
            props.deleteItemBillProduct(item.key);
        setUpdated(false);
    }
    const getData = () => {
        if (!biensoxe || biensoxe == "" || biensoxe == undefined) {
            props.alert('Vui lòng điền biển số xe');
            return null;
        }
        if (!mMaNVSuaChua.value || mMaNVSuaChua.value == "") {
            props.alert('Vui lòng điền nhân viên sữa chữa');
            return null;
        }
        if (!listNhanVienSuaChua.find(e => e.ma == mMaNVSuaChua.value)) {
            props.alert('Nhân viên sữa chữa không tồn tại');
            return null;
        }
        if (isUpdateBill == 3) {
            if (!lydo) {
                props.alert('Phải nhập lý do tại sao phải thay đổi hóa đơn.');
                return null;
            }
        }
        var tong = 0;
        var listProduct = [];
        for (let i = 0; i < props.listBillProduct.length; i++) {
            tong = tong + props.listBillProduct[i].tongtien;
            let temp = {
                tenphutungvacongviec: props.listBillProduct[i].tenphutungvacongviec,
                maphutung: props.listBillProduct[i].maphutung,
                soluongphutung: props.listBillProduct[i].soluongphutung,
                tiencong: props.listBillProduct[i].tiencong,
                dongia: props.listBillProduct[i].dongia,
                chietkhau: props.listBillProduct[i].chietkhau,
                manvsuachua: mMaNVSuaChua.value,
                tongtien: props.listBillProduct[i].tongtien
            }
            listProduct.push(temp);
        }

        for (var i = 0; i < listProduct.length; i++) {
            var item = listProduct[i];
            if (item.soluongphutung < 0) {
                props.alert("Phụ tùng :" + item.tenphutungvacongviec + " có số lượng < 0");
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
        var data = {
            manvsuachua: mMaNVSuaChua.value,
            tenkh: mCustomerName.value,
            sodienthoai: mPhone.value,
            diachi: mAddress.value,
            loaixe: mLoaiXe.value,
            somay: mSoMay.value,
            sokhung: mSoKhung.value,
            makh: mMaKH.value && mMaKH.value != '' ? mMaKH.value : null,
            tongtien: tong,
            biensoxe: biensoxe,
            chitiet: listProduct,
            manv: props.info.ma,
            yeucaukhachhang: yeucau,
            tuvansuachua: tuvan,
            lydo: lydo,
            sokm: sokm ? sokm : 0
        }
        return data
    }
    const thanhToanHoaDon = () => {
        var data = getData();
        if (data == null)
            return;
        data.mahoadon = mMaHoaDon;

        var length = data.chitiet.length;
        var mess = "Bạn muốn update và thanh toán hóa đơn " + mMaHoaDon + " với tổng tiền:" + data.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' }) + " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi thánh toán\n Vì hóa đơn này có " + length + " phụ tùng"
        }

        props.confirmError(mess, length == 0 ? 1 : 0, () => {
            UpdateBill(props.token, data).then(res => {
                ThanhToan(props.token, mMaHoaDon).then(res => {
                    props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                    setMaHoaDon("");
                    exportBill()
                    props.history.push("/services")
                    props.history.push("/services")
                    props.history.goBack();
                }).catch(err => {
                    console.log(err);
                    props.error("Không thể  thanh toán hóa đơn " + mMaHoaDon + "\nVui lòng kiểm lại đường mạng")
                })
            }).catch(err => {
                console.log(err);
                props.error("Không thể  update hóa đơn " + mMaHoaDon + "\nVui lòng kiểm lại đường mạng");
            })
        })
    }
    const UpdateHoaDon = () => {
        var data = getData();
        if (data == null)
            return;

        var length = data.chitiet.length;
        var mess = "Bạn muốn update hóa đơn " + mMaHoaDon + " với tổng tiền:" + data.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' }) + " VND";
        if (length == 0) {
            mess = "Vui lòng lưu ý trước khi update\n Vì hóa đơn này có " + length + " phụ tùng"
        }

        props.confirmError(mess, length == 0 ? 1 : 0, () => {
            data.mahoadon = mMaHoaDon;
            UpdateBill(props.token, data).then(res => {
                if (isUpdateBill == 4 || isUpdateBill == 3) {
                    setUpdated(true);
                    props.history.push('/services/repairedbill/showbill?mahoadon=' + mMaHoaDon, { message: "Update hóa đơn " + mMaHoaDon + " thành công" });
                    props.history.go();
                } else {
                    props.success("Update hóa đơn " + mMaHoaDon + " thành công");
                    setUpdated(true);
                }

            }).catch(err => {
                console.log(err);
                props.error("Không thể  update hóa đơn " + mMaHoaDon + "\nVui lòng kiểm lại đường mạng");
            })
        });
    }

    const updateTongTienBill = (product) => {
        var tong = 0;
        product.forEach(element => {
            tong += element.tongtien;
        });
        setTongTienBill(tong);
    }

    const handleChangeSL = (value, index) => {
        let newItem = props.listBillProduct[index];
        if (value && value >= 0)
            newItem.soluongphutung = parseInt(value);
        else
            newItem.soluongphutung = 1;
        newItem.tongtien = Math.round((100 - newItem.chietkhau) * parseInt(newItem.dongia) * parseInt(newItem.soluongphutung)) / 100 + parseInt(newItem.tiencong);
        let newProduct = [...props.listBillProduct.slice(0, index), newItem, ...props.listBillProduct.slice(index + 1, props.listBillProduct.lenght)];
        props.setListBillProduct(newProduct);
        updateTongTienBill(newProduct);
    }

    const handleChangeChieuKhau = (value, index) => {
        try {
            let newItem = props.listBillProduct[index];
            if (value && value >= 0 && value <= 100)
                newItem.chietkhau = parseInt(value);
            else
                newItem.chietkhau = 0;
            if (newItem.chietkhau < 0 || newItem.chietkhau > 100)
                newItem.chietkhau = 0;
            newItem.tongtien = Math.round((100 - newItem.chietkhau) * parseInt(newItem.dongia) * parseInt(newItem.soluongphutung)) / 100 + parseInt(newItem.tiencong);
            let newProduct = [...props.listBillProduct.slice(0, index), newItem, ...props.listBillProduct.slice(index + 1, props.listBillProduct.lenght)];
            props.setListBillProduct(newProduct);
            updateTongTienBill(newProduct);
        } catch (ex) {

        }
    }


    const handleChangeTienCong = (value, index) => {
        let newItem = props.listBillProduct[index];
        if (value && value >= 0)
            newItem.tiencong = parseInt(value);
        else
            newItem.tiencong = 0;
        newItem.tongtien = Math.round((100 - newItem.chietkhau) * parseInt(newItem.dongia) * parseInt(newItem.soluongphutung)) / 100 + parseInt(newItem.tiencong);
        let newProduct = [...props.listBillProduct.slice(0, index), newItem, ...props.listBillProduct.slice(index + 1, props.listBillProduct.lenght)];
        props.setListBillProduct(newProduct);
        updateTongTienBill(newProduct);
    }

    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };

    const SliceTop20 = (list) => {
        var arr = list.filter(e => e.soluongtonkho > 0);
        setDataList(arr.slice(0, 20));
    };
    const searchMaPhuTung = (values) => {
        setSearchValue(values)
        if (values === "") {
            SliceTop20(props.listProduct);
            return;
        }
        let product = props.listProduct.filter(function (item) {
            return ((item.maphutung.toLowerCase()).includes(values.toLowerCase()) ||
                ((item.tentiengviet.toLowerCase()).includes(values.toLowerCase()))
            );
        });
        if (product.length !== 0) {
            if (product.length === 1 && product[0].maphutung === values) {

            } else {
                SliceTop20(product);
            }
        }
    };
    const checkHasRender = (Search, item) => {
        let strSearch = Search.toLowerCase();
        return (item.maphutung != "" && item.maphutung.toLowerCase() == strSearch);
    };

    const handleButtonSearch = () => {
        let search = searchValue;
        let list = props.listProduct.filter(function (item) {
            return (checkHasRender(search, item));
        });

        if (!list || list.length == 0) {
            props.alert("Không tìm thấy item: " + search)
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

        var newData = {
            key: props.listBillProduct.length + 1,
            tenphutungvacongviec: item.tentiengviet,
            maphutung: item.maphutung,
            dongia: parseInt(item.giaban_le),
            chietkhau: 0,
            soluongphutung: 1,
            tiencong: 0,
            tongtien: parseInt(item.giaban_le),
            nhacungcap: "Trung Trang"
        }
        addItemToProduct(newData, false);
        setSearchValue("")
    };

    const checkHasItem = (sp, item) => {
        if (sp.tenphutungvacongviec.toLowerCase() == "" || sp.tenphutungvacongviec.toLowerCase() != item.tenphutungvacongviec.toLowerCase())
            return false;
        if (!sp.maphutung || sp.maphutung == "" || sp.maphutung.toLowerCase() != item.maphutung.toLowerCase())
            return false;
        if (!sp.nhacungcap || sp.nhacungcap == "" || sp.nhacungcap != 'Trung Trang' || sp.nhacungcap.toLowerCase() != item.nhacungcap.toLowerCase())
            return false;
        if (!sp.dongia || sp.dongia < 0 || sp.dongia != item.dongia)
            return false;
        return true;
    };
    const handleRedirectUpdate = () => {
        setShowingConfirm(true);
    }

    return (
        <div>
            {props.isLoading && <Loading></Loading>}
            {!props.isLoading &&
                <div>
                    {isUpdateBill === 0 ?
                        <h1 style={{ textAlign: "center" }}>Phiếu sửa chữa (Bàn số: {maban})</h1> :
                        <h1 style={{ textAlign: "center" }}>Phiếu sửa chữa (Mã Hóa Đơn: {mMaHoaDon})</h1>}

                    <DivFlexRow style={{ alignItems: 'center' }}>
                        <DivFlexColumn>
                            <label>Nhân viên sửa chữa: </label>
                            <Input readOnly={showInfoBill} autocomplete="off" list="nv_suachua" name="nv_suachua" value={mMaNVSuaChua.value} onChange={(e) => {
                                searchNhanVienSuaChua(e.target.value);
                            }} />
                            <datalist id="nv_suachua">
                                {
                                    listNhanVienSuaChua.map((item, index) => (
                                        <option key={index} value={item.ma}>{item.ten}</option>
                                    ))}
                            </datalist>
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Tên nhân viên sửa chữa: </label>
                            <Input readOnly={true} autocomplete="off" {...tennhanvien} />
                        </DivFlexColumn>
                    </DivFlexRow>
                    <DivFlexRow style={{ alignItems: 'center' }}>
                        <DivFlexColumn>
                            <label>Biển số xe: </label>
                            <Input readOnly={showInfoBill} autocomplete="off" list="bien_so" name="bien_so" value={biensoxe} onChange={(e) => {
                                searchBienSoXe(e.target.value);
                            }} readOnly={isUpdateBill != 0} />
                            <datalist id="bien_so">
                                {listBienSoCurrent.map((item, index) => (
                                    <option key={index} value={item.biensoxe} >{item.ten}</option>
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
                    </DivFlexRow>
                    <DivFlexRow style={{ alignItems: 'center' }}>
                        <DivFlexColumn>
                            <label>Loại xe: </label>
                            <Input readOnly={showInfoBill} autocomplete="off" list="loai_xe" name="loai_xe" readOnly={isUpdateBill != 0} {...mLoaiXe} />
                            <datalist id="loai_xe">
                                {listLoaiXe.map((item, index) => (
                                    <option key={index} value={item} >{item}</option>
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
                            <Input readOnly={showInfoBill} disabled={isDisableEditInfo} autocomplete="off" value={sokm} type="Number" max={999999} min={0} onChange={(e => { setSoKM(e.target.value) })} />
                        </DivFlexColumn>
                        <Button disabled={isUpdateBill == 0} onClick={() => setShowHistoryCustomer(true)} style={{ marginLeft: 20, marginTop: 10 }}>
                            Chi tiết
                </Button>
                    </DivFlexRow>
                    <DivFlexRow style={{ alignItems: 'center' }}>
                        <DivFlexColumn>
                            <label>Yêu cầu khách hàng: </label>
                            <Textarea readOnly={showInfoBill} autocomplete="off" value={yeucau} onChange={(e => { setYeuCau(e.target.value) })} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Tư vấn Sữa chữa: </label>
                            <Textarea readOnly={showInfoBill} autocomplete="off" value={tuvan} onChange={(e => { setTuvan(e.target.value) })} />
                        </DivFlexColumn>
                    </DivFlexRow>
                    {(isUpdateBill == 3 || lydo) &&
                        <DivFlexRow style={{ alignItems: 'center' }}>
                            <DivFlexColumn>
                                <label>Lý do thay đổi: </label>
                                <Textarea readOnly={showInfoBill} autocomplete="off" value={lydo} onChange={(e => { setLydo(e.target.value) })} />
                            </DivFlexColumn>
                        </DivFlexRow>
                    }

                    {isUpdateBill < 4 &&
                        <DivFlexRow style={{ marginTop: 5, marginBottom: 5, alignItems: 'center', justifyContent: 'space-between', }}>
                            <DivFlexRow style={{ alignItems: 'center' }}>
                                <label> Bảng giá phụ tùng: </label>
                                <Input autoFocus list="browser_search_suachua" onKeyPress={_handleKeyPress} value={searchValue} style={{ width: 250, marginRight: 15 }}
                                    onChange={(e) => searchMaPhuTung(e.target.value)} />
                                <datalist id="browser_search_suachua">
                                    {mDataList.map((item, index) => (
                                        <option disabled={item.soluongtonkho === 0} key={index}
                                            value={item.maphutung}>{item.tentiengviet} ({item.soluongtonkho})</option>
                                    ))}
                                </datalist>
                                <Button onClick={() => { handleButtonSearch(); }}>
                                    Tìm Kiếm <i className="fas fa-search" />
                                </Button>
                            </DivFlexRow>
                            <DivFlexRow style={{ alignItems: 'center', float: 'right' }}>
                                <Button onClick={() => {
                                    setShowTienCong(true);
                                    setUpdated(false)
                                }}> Thêm Tiền Công </Button>
                                <Button onClick={() => {
                                    setShowCuaHangNgoai(true);
                                    setUpdated(false)
                                }}> Thêm của hàng ngoài </Button>
                                <Button onClick={() => {
                                    setShowNewBill(true)
                                    setUpdated(false)
                                }}> Thêm mới </Button>
                            </DivFlexRow>
                        </DivFlexRow>
                    }
                    <Table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Tên phụ tùng <br /> và công việc</th>
                                <th>Mã phụ tùng</th>
                                <th>Đơn giá</th>
                                <th>SL</th>
                                <th>Chiết khấu (%)</th>
                                <th>Tiền phụ tùng</th>
                                <th>Tiền công</th>
                                <th>Tổng tiền công <br />+ phụ tùng</th>
                                {!showInfoBill && <th><i className="far fa-trash-alt"></i></th>}
                            </tr>

                            {props.listBillProduct && props.listBillProduct.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.tenphutungvacongviec}</td>
                                    <td>{item.maphutung}</td>
                                    <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    <td><input readOnly={showInfoBill} type="number" onChange={(e) => handleChangeSL(e.target.value, index)} value={props.listBillProduct[index].soluongphutung} min="1" /></td>
                                    <td><input readOnly={showInfoBill} type="number" max={100} onChange={(e) => handleChangeChieuKhau(e.target.value, index)} value={props.listBillProduct[index].chietkhau} min="0" /></td>
                                    <td>{(Math.round((100 - item.chietkhau) * item.dongia * item.soluongphutung) / 100).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    <td>
                                        <input readOnly={showInfoBill} list="tien_cong_bill" type="number" onChange={(e) => handleChangeTienCong(e.target.value, index)} value={props.listBillProduct[index].tiencong} min="0" />
                                        <datalist id="tien_cong_bill">
                                            {listGiaDichVu.map((item, index) => (
                                                <option key={index} value={item.tien} >{item.ten}</option>
                                            ))}
                                        </datalist>
                                    </td>
                                    <td>{item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    {!showInfoBill && <td>
                                        <DelButton onClick={() => {
                                            DelItem(item)
                                        }}>
                                            <i className="far fa-trash-alt"></i>
                                        </DelButton>
                                    </td>
                                    }
                                </tr>

                            ))}

                        </tbody>
                    </Table>

                    <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                        <h4 style={{ textAlign: "center" }}>Tong Tiền : {tongTienBill} VND</h4>
                    </DivFlexRow>

                    {isUpdateBill < 4 ?
                        <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                            <label></label>
                            {isUpdateBill === 0 ?
                                <Button onClick={() => {
                                    handleSaveBill();
                                }}> Lưu   </Button>
                                :
                                <DivFlexRow>
                                    <Button onClick={() => {
                                        UpdateHoaDon();
                                    }}>  Update  </Button>
                                    {isUpdateBill != 3 && <Button style={{ marginLeft: 15 }} onClick={() => {
                                        thanhToanHoaDon()
                                    }}> Update và Thanh toán  </Button>}
                                    {isUpdateBill != 3 && <DelButton style={{ marginLeft: 15 }} onClick={() => {
                                        HuyHoaDon();
                                    }}> Hủy </DelButton>}
                                </DivFlexRow>
                            }
                        </DivFlexRow>
                        : <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                            <label></label>
                            {(moment().valueOf() - moment(ngaythanhtoan.value).valueOf()) <= oneDay &&
                                <Button onClick={() => {
                                    handleRedirectUpdate();
                                }}> Update </Button>
                            }
                        </DivFlexRow>
                    }
                    <PopupBillTienCong addItemToProduct={(item) => addItemToProduct(item)} isShowing={isShowTienCong} listGiaDichVu={listGiaDichVu} onCloseClick={() => { setShowTienCong(false) }} />
                    <PopupBillCHN addItemToProduct={(item) => addItemToProduct(item)} isShowing={isShowCuaHangNgoai} listCuaHangNgoai={listCuaHangNgoai} onCloseClick={() => { setShowCuaHangNgoai(false) }} />
                    <PopupAccessory addItemToProduct={(item) => addItemToProduct(item)} isShowing={isShowNewBill} listProduct={props.listProduct} onCloseClick={() => { setShowNewBill(false) }} />

                    <ConfirmHoaDon
                        isShowing={isShowingConfirm}
                        onCloseClick={() => setShowingConfirm(false)}
                        mahoadon={mMaHoaDon}
                        token={props.token}
                        history={props.history}
                        alert={(mess) => props.alert(mess)}
                    />

                    <HistoryCustomer isShowing={isShowHistoryCustomer} onCloseClick={() => {
                        setShowHistoryCustomer(false)
                    }
                    } ma={mMaKH.value && mMaKH.value !== "" ? mMaKH.value : null} />
                </div>
            }
        </div>
    )
}
const mapState = (state) => ({
    token: state.Authenticate.token,
    listBillProduct: state.Product.listBillProduct,
    listProduct: state.Product.listProduct,
    isLoading: state.App.isLoading,
    info: state.Authenticate.info
})
const mapDispatch = (dispatch) => ({
    deleteBillProduct: () => { dispatch(deleteBillProduct()) },
    deleteItemBillProduct: (key) => { dispatch(deleteItemBillProduct(key)) },
    deleteItemBillProductMa: (key) => { dispatch(deleteItemBillProductMa(key)) },
    setListBillProduct: (arr) => { dispatch(setListBillProduct(arr)) },
    addBillProduct: (data) => { dispatch(addBillProduct(data)) },
    getAllProduct: (token) => { dispatch(getAllProduct(token)) },
    updateBillProduct: (data, index) => { dispatch(updateBillProduct(data, index)) }
})
export default withRouter(connect(mapState, mapDispatch)(RepairedBill));
// export default RepairedBill;
