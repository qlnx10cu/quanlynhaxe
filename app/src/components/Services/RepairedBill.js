import React, { useState, useEffect } from 'react'
import { DivFlexRow, DivFlexColumn, Button, Input, Table, DelButton } from '../../styles'
import PopupAccessory from './PopupAccessory'
import PopupBillTienCong from './PopupBillTienCong'
import HistoryCustomer from '../Admin/HistoryCustomer'
import lib from '../../lib'
import { HOST } from '../../Config'
import { connect } from 'react-redux'
import { UpdateBill, SaveBill, ThanhToan, HuyThanhToan, GetBillSuaChuaByMaHoaDon } from '../../API/Bill'
import { GetlistCustomer } from '../../API/Customer'
import { GetListNVSuaChua } from '../../API/Staffs'
import { deleteBillProduct, deleteItemBillProduct, setListBillProduct, updateBillProduct, deleteItemBillProductMa } from '../../actions/Product';
import { withRouter } from 'react-router-dom'
import PopupBillCHN from './PopupBillCHN';
import { GetListCuaHangNgoai } from '../../API/CuaHangNgoai'
import { GetListSalary } from '../../API/Salary'
import { addBillProduct } from '../../actions/Product';
import AlertWarrper from '../Warrper/AlertWarrper';
import { alert, error, setLoading } from "../../actions/App";

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

    let [isShowCuaHangNgoai, setShowCuaHangNgoai] = useState(false);

    let [listBienSo, setListBienSo] = useState([]);
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
    let mSoKM = lib.handleInput("0");
    let mYeuCau = lib.handleInput("");
    let mTuVan = lib.handleInput("");

    let [sokm, setSoKM] = useState("");
    let [yeucau, setYeuCau] = useState("");
    let [tuvan, setTuvan] = useState("");
    let [searchValue, setSearchValue] = useState("");
    let [mDataList, setDataList] = useState([]);
    let [listGiaDichVu, setListGiaDichVu] = useState([]);



    useEffect(() => {
        GetlistCustomer(props.token).then(response => {
            setListBienSo(response.data);
        })
        GetListNVSuaChua(props.token).then(response => {
            setListNhanVienSuaChua(response.data);
        })
        GetListCuaHangNgoai(props.token).then(res => {
            setCuaHangNgoai(res.data);
        });
        GetListSalary(props.token).then(respose => {
            setListGiaDichVu(respose.data);
        })
    }, [])

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


    useEffect(() => {
        let pathname = window.location.href;
        if (pathname.endsWith("/"))
            pathname = pathname.substring(0, pathname.length - 1);
        if (pathname.indexOf("services/repairedbill/updatebill") !== -1) {
            var queryParams = getQueryParams(window.location.href);
            if (!queryParams || !queryParams.mahoadon || !queryParams.token) {
                props.alert("Đường dẫn không đúng");
                window.close()
                return;
            }
            if (!checkTokenDateTime(queryParams.token)) {
                props.alert("Update đã hết hiệu lực, vui lòng làm lại");
                window.close()
                return;
            }

            setUpdateBill(3);
            setMaHoaDon(queryParams.mahoadon)
            showHoaDon(queryParams.mahoadon);
            return;
        }

        let tmp = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
        let mb = Number.parseInt(tmp) - 1;
        setMaban(mb + 1);

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
                }
            }
        });

        // props.socket.on('lifttableBill', async data => {
        //         let val = await data;
        //         if(mb > -1) {
        //             if (val && val[mb].trangthai === 0) {
        //                 alert("Có người đã thu hồi bàn này");
        //                 props.history.goBack();
        //             }
        //         }
        // })
        props.socket.emit("maban", mb);
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
            // mTuVan.setValue(res.data.tuvansuachua);
            // mYeuCau.setValue(res.data.yeucaukhachhang);
            // mSoKM.setValue(res.data.sokm);
            setTuvan(res.data.tuvansuachua);
            setYeuCau(res.data.yeucaukhachhang);
            setSoKM(res.data.sokm);
        })
            .catch(err => {
                props.alert("Không lấy được hóa đơn.")
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
        if (data == null)
            return;
        var bsx = data.biensoxe;
        SaveBill(props.token, data).then(Response => {
            props.deleteBillProduct();
            props.socket.emit("bill", { maban: maban - 1, mahoadon: Response.data.mahoadon, biensoxe: bsx });
            props.alert("Tạo Phiếu Sửa Chữa Thành Công - Mã Hóa Đơn:" + Response.data.mahoadon);
            props.history.goBack();
        }).catch(err => {
            props.error("Không thể lưu phiếu sữa chưa: ");
            console.log(err);
        })

    }
    const HuyHoaDon = () => {
        if (window.confirm("Bạn chắc muốn hủy hóa đơn này") == true) {
            HuyThanhToan(props.token, mMaHoaDon).then(res => {
                props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                setMaHoaDon("");
                props.alert('Hủy đã thành công');
                window.location.href = '/services';
            }).catch(err => {
                props.error("Lỗi hủy hóa đơn");
                console.log(err);
            })
        }
    }

    const DelItem = (item) => {
        removeItemToProduct(item)
        if (isUpdateBill !== 0)
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
            sokm: sokm ? sokm : 0
        }
        return data
    }
    const thanhToanHoaDon = () => {
        var data = getData();
        if (data == null)
            return;
        data.mahoadon = mMaHoaDon;
        UpdateBill(props.token, data).then(res => {
            ThanhToan(props.token, mMaHoaDon).then(res => {
                props.socket.emit("release", { maban: maban - 1, mahoadon: "", biensoxe: "" });
                setMaHoaDon("");
                exportBill()
                props.history.goBack();
            }).catch(err => {
                alert("Lỗi thanh toán")
            })
        }).catch(err => {
            alert("Lỗi thanh toán")
        })
    }
    const UpdateHoaDon = () => {
        var data = getData();
        if (data == null)
            return;
        data.mahoadon = mMaHoaDon;
        UpdateBill(props.token, data).then(res => {
            props.alert("Update hóa đơn thành công");
            setUpdated(true);
        }).catch(err => {
            props.error("!!Không thể update hóa đơn thanh toán");
            console.log(err);
        })
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
        newItem.tongtien = parseInt(newItem.dongia) * parseInt(newItem.soluongphutung) + parseInt(newItem.tiencong);
        let newProduct = [...props.listBillProduct.slice(0, index), newItem, ...props.listBillProduct.slice(index + 1, props.listBillProduct.lenght)];
        props.setListBillProduct(newProduct);
        updateTongTienBill(newProduct);
    }


    const handleChangeTienCong = (value, index) => {
        let newItem = props.listBillProduct[index];
        if (value && value >= 0)
            newItem.tiencong = parseInt(value);
        else
            newItem.tiencong = 0;
        newItem.tongtien = parseInt(newItem.dongia) * parseInt(newItem.soluongphutung) + parseInt(newItem.tiencong);
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
        if (sp.maphutung == "" || sp.maphutung.toLowerCase() != item.maphutung.toLowerCase())
            return false;
        if (sp.nhacungcap == "" || sp.nhacungcap != 'Trung Trang' || sp.nhacungcap.toLowerCase() != item.nhacungcap.toLowerCase())
            return false;
        if (!sp.dongia || sp.dongia < 0 || sp.dongia != item.dongia)
            return false;
        return true;
    };

    return (
        <div>
            {isUpdateBill === 0 ?
                <h1 style={{ textAlign: "center" }}>Phiếu sửa chữa (Bàn số: {maban})</h1> :
                <h1 style={{ textAlign: "center" }}>Phiếu sửa chữa (Mã Hóa Đơn: {mMaHoaDon})</h1>}

            <DivFlexRow style={{ alignItems: 'center' }}>
                <DivFlexColumn>
                    <label>Nhân viên sửa chữa: </label>
                    <Input autocomplete="off" list="nv_suachua" name="nv_suachua" value={mMaNVSuaChua.value} onChange={(e) => {
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
                    <Input autocomplete="off" list="bien_so" name="bien_so" value={biensoxe} onChange={(e) => {
                        searchBienSoXe(e.target.value);
                    }} readOnly={isUpdateBill != 0} />
                    <datalist id="bien_so">
                        {listBienSo.map((item, index) => (
                            <option key={index} value={item.biensoxe} >{item.ten}</option>
                        ))}
                    </datalist>
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Tên khách hàng: </label>
                    <Input disabled={isDisableEditInfo} autocomplete="off" {...mCustomerName} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Số điện thoại: </label>
                    <Input disabled={isDisableEditInfo} autocomplete="off" {...mPhone} pattern="[0-9]{10}" />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Địa chỉ: </label>
                    <Input disabled={isDisableEditInfo} autocomplete="off" {...mAddress} />
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ alignItems: 'center' }}>
                <DivFlexColumn>
                    <label>Loại xe: </label>
                    <Input autocomplete="off" list="loai_xe" name="loai_xe" readOnly={isUpdateBill != 0} {...mLoaiXe} />
                    <datalist id="loai_xe">
                        {listLoaiXe.map((item, index) => (
                            <option key={index} value={item} >{item}</option>
                        ))}
                    </datalist>

                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Số khung: </label>
                    <Input disabled={isDisableEditInfo} autocomplete="off" {...mSoKhung} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Số máy: </label>
                    <Input disabled={isDisableEditInfo} autocomplete="off" {...mSoMay} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Số km: </label>
                    <Input disabled={isDisableEditInfo} autocomplete="off" value={sokm} type="Number" max={999999} min={0} onChange={(e => { setSoKM(e.target.value) })} />
                </DivFlexColumn>
                <Button disabled={isUpdateBill == 0} onClick={() => setShowHistoryCustomer(true)} style={{ marginLeft: 20, marginTop: 10 }}>
                    Chi tiết
                </Button>
            </DivFlexRow>
            <DivFlexRow style={{ alignItems: 'center' }}>
                <DivFlexColumn>
                    <label>Yêu cầu khách hàng: </label>
                    <Input autocomplete="off" value={yeucau} onChange={(e => { setYeuCau(e.target.value) })} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Tư vấn Sữa chữa: </label>
                    <Input autocomplete="off" value={tuvan} onChange={(e => { setTuvan(e.target.value) })} />
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 5, marginBottom: 5, alignItems: 'center', justifyContent: 'space-between', }}>
                {/* {isUpdateBill === 0 ? <div></div> :
                    <Button onClick={exportBill}>
                        Export
                </Button>
                } */}
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
                    }}>
                        Thêm Tiền Công
                </Button>
                    <Button onClick={() => {
                        setShowCuaHangNgoai(true);
                        setUpdated(false)
                    }}>
                        Thêm của hàng ngoài
                </Button>
                    <Button onClick={() => {
                        setShowNewBill(true)
                        setUpdated(false)
                    }}>
                        Thêm mới
                </Button>
                </DivFlexRow>
            </DivFlexRow>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Tên phụ tùng <br /> và công việc</th>
                        <th>Mã phụ tùng</th>
                        <th>Đơn giá</th>
                        <th>SL</th>
                        <th>Tiền phụ tùng</th>
                        <th>Tiền công</th>
                        <th>Tổng tiền công <br />+ phụ tùng</th>
                        <th><i className="far fa-trash-alt"></i></th>
                    </tr>

                    {props.listBillProduct && props.listBillProduct.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.tenphutungvacongviec}</td>
                            <td>{item.maphutung}</td>
                            <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td><input type="number" onChange={(e) => handleChangeSL(e.target.value, index)} value={props.listBillProduct[index].soluongphutung} min="1" /></td>
                            <td>{(item.dongia * item.soluongphutung).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>
                                <input list="tien_cong_bill" type="number" onChange={(e) => handleChangeTienCong(e.target.value, index)} value={props.listBillProduct[index].tiencong} min="0" />
                                <datalist id="tien_cong_bill">
                                    {listGiaDichVu.map((item, index) => (
                                        <option key={index} value={item.tien} >{item.ten}</option>
                                    ))}
                                </datalist>
                            </td>
                            <td>{item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>
                                <DelButton onClick={() => {
                                    DelItem(item)
                                }}>
                                    <i className="far fa-trash-alt"></i>
                                </DelButton>
                            </td>
                        </tr>

                    ))}

                </tbody>
            </Table>

            <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                <h4 style={{ textAlign: "center" }}>Tong Tiền : {tongTienBill} VND</h4>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                <label></label>
                {isUpdateBill === 0 ?
                    <Button onClick={() => {
                        if (window.confirm("Bạn chắc muốn lưu")) {
                            handleSaveBill();
                        }
                    }}>
                        Lưu
                    </Button>
                    :
                    <DivFlexRow>
                        <Button onClick={() => {
                            if (window.confirm("Bạn chắc muốn thay đổi")) {
                                UpdateHoaDon();
                            }
                        }}>
                            Update
                        </Button>
                        {isUpdateBill != 3 && <Button style={{ marginLeft: 15 }} onClick={() => {
                            if (window.confirm("Bạn chắc muốn update và thanh toán")) {
                                thanhToanHoaDon()
                            }
                        }}>
                            Update và Thanh toán
                        </Button>}
                        {isUpdateBill != 3 && <DelButton style={{ marginLeft: 15 }} onClick={() => {
                            if (window.confirm("Bạn chắc muốn Hủy hóa đợn")) {
                                HuyHoaDon();
                            }
                        }}>
                            Hủy
                        </DelButton>}
                    </DivFlexRow>
                }
            </DivFlexRow>
            <PopupBillTienCong addItemToProduct={(item) => addItemToProduct(item)} isShowing={isShowTienCong} onCloseClick={() => { setShowTienCong(false) }} />
            <PopupAccessory addItemToProduct={(item) => addItemToProduct(item)} isShowing={isShowNewBill} onCloseClick={() => { setShowNewBill(false) }} />
            <PopupBillCHN addItemToProduct={(item) => addItemToProduct(item)} isShowing={isShowCuaHangNgoai} listCuaHangNgoai={listCuaHangNgoai} onCloseClick={() => { setShowCuaHangNgoai(false) }} />

            <HistoryCustomer isShowing={isShowHistoryCustomer} onCloseClick={() => {
                setShowHistoryCustomer(false)
            }
            } ma={mMaKH.value && mMaKH.value !== "" ? mMaKH.value : null} />
            <AlertWarrper />
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
    deleteItemBillProduct: (key) => { console.log(key); dispatch(deleteItemBillProduct(key)) },
    deleteItemBillProductMa: (key) => { console.log(key); dispatch(deleteItemBillProductMa(key)) },
    setListBillProduct: (arr) => { dispatch(setListBillProduct(arr)) },
    addBillProduct: (data) => { dispatch(addBillProduct(data)) },
    alert: (mess) => { dispatch(alert(mess)) },
    error: (mess) => { dispatch(error(mess)) },
    setLoading: (isLoad) => { dispatch(setLoading(isLoad)) },
    updateBillProduct: (data, index) => { dispatch(updateBillProduct(data, index)) }
})
export default withRouter(connect(mapState, mapDispatch)(RepairedBill));
// export default RepairedBill;
