import React, { useState, useEffect } from 'react';
import lib from '../../lib'
import { DivFlexRow, DivFlexColumn, Button, Input, Table, DelButton, ButtonChooseFile, Modal, ModalContent, CloseButton, Textarea } from '../../styles'
import { getAllProduct } from '../../actions/Product';
import PopupNewProduct from './PopupNewProduct'
import PopupNewCuaHangNgoai from './PopupNewCuaHangNgoai'
import { SaveBillBanLe } from '../../API/Bill'
import { UpdateBillBanLe } from '../../API/Bill'
import { GetlistCustomer } from '../../API/Customer'
import { connect } from 'react-redux'
import { GetListCuaHangNgoai } from '../../API/CuaHangNgoai'
import { GetBillBanLeByMaHoaDon, CheckUpdateBill } from '../../API/Bill'
import ChiTietThongKe from '../ThongKe/ChiTietThongKe'
import Loading from "../Loading";
import moment from 'moment'
import XLSX from 'xlsx';

const oneDay = 1000 * 3600 * 24;

const ConfirmHoaDon = (props) => {
    let [maBarcode, setMaBarcode] = useState("");

    const UpdateHoaDon = (maHoaDon) => {
        var date = new Date();
        let url = `/banle?mahoadon=${maHoaDon}`;
        props.history.push(url, { tokenTime: date.getTime(), mhdToken: maHoaDon });
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


const BanLe = (props) => {

    let mCustomerName = lib.handleInput("");
    let mDiaChi = lib.handleInput("");
    let [ngaythanhtoan, setNgaythanhtoan] = useState("");
    let [makhachhang, setMaKhachHang] = useState("");
    let [sodienthoai, setSoDienThoai] = useState("");
    let [mProducts, setProducts] = useState([]);
    let [mHangNgoais, setHangNgoais] = useState([]);
    let [isShowNewProduct, setNewProduct] = useState(false);
    let [isShowCuaHangNgoai, setNewCuaHangNgoai] = useState(false);
    let [listCuaHangNgoai, setCuaHangNgoai] = useState([]);
    let [mTongTien, setTongTien] = useState(0);
    let [listCustomer, setListCustomer] = useState([]);
    let [listCustomerCurrent, setListCustomerCurrent] = useState([]);
    let [loai, setLoai] = useState(0);
    let [lydo, setLydo] = useState("");
    let [mahoadonUpdate, setmahoadonUpdate] = useState("");
    let [searchValue, setSearchValue] = useState("");
    let [mDataList, setDataList] = useState([]);
    let [isShowingConfirm, setShowingConfirm] = useState(false);


    let [isShowChitiet, setShowChitiet] = useState(false);
    let [mMaHoaDon, setMaHoaDon] = useState("");

    const getQueryParams = (url) => {
        let queryParams = {};
        var tmp = url.substring(url.lastIndexOf('?') + 1, url.length);
        if (tmp == "")
            return queryParams;
        let params = tmp.split('&');
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split('=');
            var value = pair.length == 0 ? "" : pair[1];
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


    const getState = (name) => {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name])
            return null;
        return window.history.state.state[name];
    }

    const clearState = (name) => {
        if (!window.history || !window.history.state || !window.history.state.state || !window.history.state.state[name])
            return;
        delete window.history.state.state[name];
        window.history.pushState(window.history.state.state, '', window.href);
    }

    useEffect(() => {

        var mhd = '';
        var loai = 0;
        let pathname = window.location.href;
        if (pathname.endsWith("/"))
            pathname = pathname.substring(0, pathname.length - 1);

        if (!pathname.includes("/banle")) {
            return;
        }

        let isMouted = true;

        props.setLoading(true, 2);
        clearAll();

        if (pathname.endsWith("/banle")) {
            loai = 0;
        } else if (pathname.includes("/banle/showbill")) {
            var queryParams = getQueryParams(window.location.href);
            if (!queryParams || !queryParams.mahoadon) {
                props.alert("Đường dẫn không đúng");
                window.close()
                return;
            }
            mhd = queryParams.mahoadon;
            setmahoadonUpdate(queryParams.mahoadon)
            loai = 2;
        } else {

            var queryParams = getQueryParams(window.location.href);
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

            mhd = queryParams.mahoadon;
            setmahoadonUpdate(queryParams.mahoadon)
            loai = 1;
        }
        if (loai != 0) {
            props.setLoading(true, 3);
        }

        GetListCuaHangNgoai(props.token).then(res => {
            if (!isMouted)
                return;
            setCuaHangNgoai(res.data);
            props.addLoading();

        });
        GetlistCustomer(props.token).then(res => {
            if (!isMouted)
                return;
            setListCustomer(res.data);
            props.addLoading();

        }).catch(err => {
            props.alert("Không thể lấy danh sách khách hàng")
        })

        props.getAllProduct(props.token);

        setLoai(loai)

        if (loai != 0) {
            GetBillBanLeByMaHoaDon(props.token, mhd).then(res => {
                if (!isMouted)
                    return;
                let data = res.data;
                if (data.makh) {
                    setMaKhachHang(data.makh)
                }
                if (data.tenkh) {
                    mCustomerName.setValue(data.tenkh)
                }
                if (data.sodienthoai) {
                    setSoDienThoai(data.sodienthoai);
                }
                if (data.diachi) {
                    mDiaChi.setValue(data.diachi);
                }
                var chitiet = [...data.chitiet]
                for (var k in chitiet) {
                    var newItem = chitiet[k];
                    newItem.tencongviec = newItem.tenphutung
                    newItem.tongtien = newItem.dongia * newItem.soluong * ((100 - newItem.chietkhau) / 100)
                }
                setNgaythanhtoan(data.ngaythanhtoan);
                setLydo(data.lydo);
                setTongTien(data.tongtien);
                setProducts(chitiet)
                props.addLoading();

                var message = getState("message");
                if (message) {
                    clearState("message");
                    props.success(message);
                }

            }).catch(err => {
                props.error("Không lấy được chi tiết hóa đơn:" + mhd);
                window.location.href = "/thongke";
            })
        }


        return () => {
            isMouted = false;
        }


    }, []);

    const clearAll = () => {
        setTongTien(0);
        setProducts([]);
        setNewProduct(false);
        setNewCuaHangNgoai(false);
        mCustomerName.setValue("");
        setMaKhachHang("");
        mDiaChi.setValue("");
        setSoDienThoai("");
    }

    const tinhTongTien = (chitiet) => {
        var tongtien = 0;
        for (var i = 0; i < chitiet.length; i++) {
            var item = chitiet[i];
            tongtien += item.dongia * item.soluong * ((100 - item.chietkhau) / 100)
        }
        return tongtien
    }

    const handleSaveBill = () => {

        if (mProducts.length === 0) {
            props.alert("Chưa có sản phẩm nào.")
            return;
        }
        if (!lydo) {
            props.alert('Phải nhập lý do tại sao phải thay đổi hóa đơn.');
            return;
        }

        let chitiet = mProducts.map(function (item) {
            return {
                maphutung: item.maphutung,
                tenphutung: item.tencongviec,
                dongia: item.dongia,
                soluong: item.soluong,
                chietkhau: item.chietkhau,
                nhacungcap: item.nhacungcap,
            }
        })

        for (var i = 0; i < chitiet.length; i++) {
            var item = chitiet[i];
            if (item.dongia < 0) {
                props.alert("Ma: " + item.maphutung + " SP: " + item.tenphutung + " co don gia < 0")
                return;
            }
            if (item.soluong < 0) {
                props.alert("Ma: " + item.maphutung + " SP: " + item.tenphutung + " co soluong < 0")
                return;
            }
            if (item.chietkhau < 0 || item.chietkhau > 100) {
                props.alert("Ma: " + item.maphutung + " SP: " + item.tenphutung + " co chietkhau < 0% or > 100%")
                return;
            }
        }


        var tongtien = tinhTongTien(chitiet)
        let data = {
            mahoadon: mahoadonUpdate,
            manv: props.info.ma,
            tenkh: mCustomerName.value,
            tongtien: tongtien,
            tienpt: tongtien,
            tiencong: 0,
            lydo: lydo,
            chitiet: chitiet,
        }

        UpdateBillBanLe(props.token, data).then(res => {
            clearState("tokenTime");
            props.history.push('/banle/showbill?mahoadon=' + mahoadonUpdate, { message: "Update hóa đơn " + mahoadonUpdate + " thành công" });
        })
            .catch(err => {
                props.error("Không update được hóa đơn.");
            })
    }

    const handleAddBill = () => {
        if (mProducts.length === 0) {
            props.alert("Chưa có sản phẩm nào.")
            return;
        }

        let chitiet = mProducts.map(function (item) {
            return {
                maphutung: item.maphutung,
                tenphutung: item.tencongviec,
                dongia: item.dongia,
                soluong: item.soluong,
                chietkhau: item.chietkhau,
                nhacungcap: item.nhacungcap,
            }
        })

        for (var i = 0; i < chitiet.length; i++) {
            var item = chitiet[i];
            if (item.dongia < 0) {
                props.alert(" SP: " + item.tenphutung + " co don gia < 0")
                return;
            }
            if (item.soluong < 0) {
                props.alert(" SP: " + item.tenphutung + " co soluong < 0")
                return;
            }
            if (item.chietkhau < 0 || item.chietkhau > 100) {
                props.alert(" SP: " + item.tenphutung + " co chietkhau < 0% or > 100%")
                return;
            }
        }

        var tongtien = tinhTongTien(chitiet)

        let data = {
            manv: props.info.ma,
            tenkh: mCustomerName.value,
            tongtien: tongtien,
            tiencong: 0,
            tienpt: tongtien,
            chitiet: chitiet,
        }
        if (makhachhang)
            data.makh = makhachhang;

        SaveBillBanLe(props.token, data).then(res => {
            clearAll();
            setMaHoaDon(res.data.mahoadon);
            setShowChitiet(true);
        })
            .catch(err => {
                props.error("Không thể thanh toán hóa đơn.");
            })
    }

    const deleteProduct = (it) => {
        setTongTien(mTongTien - it.tongtien);
        if (it.maphutung && it.maphutung !== '') {
            setProducts(mProducts.filter(function (item) {
                return item.maphutung !== it.maphutung;
            }))
        }
        else {
            setProducts(mProducts.filter(function (item) {
                return !(item.tencongviec === it.tencongviec && item.nhacungcap === it.nhacungcap);
            }))
        }

    }
    const deleteHangNgoai = (maphutung) => {
        setProducts(mHangNgoais.filter(function (item) {
            return item.maphutung !== maphutung;
        }))
    }
    const addItemToProduct = (item) => {
        var i = 0;
        for (i = 0; i < mProducts.length; i++) {
            if (checkHasItem(item, mProducts[i])) {
                break;
            }
        }
        if (i == mProducts.length) {
            setTongTien(mTongTien + item.tongtien);
            setProducts([...mProducts, item]);
        }
        else {
            let newItem = mProducts[i];
            updateChangSL(i, parseInt(newItem.soluong) + parseInt(item.soluong));
        }
    }

    const addListItemToProduct = (items) => {
        var tongtien = 0;
        for (var k in items) {
            var item = items[k];
            tongtien += item.tongtien;
        }
        var product = [...mProducts];
        setProducts(product.concat(items));
        setTongTien(mTongTien + tongtien);
    }
    const _handleKeyPressKH = (e) => {
        if (e.key === 'Enter') {
            handleChangeKH(e.target.value, true);
        }
    };

    const handleChangeKH = (value, enter) => {
        setMaKhachHang(value);
        let kq = null;
        kq = listCustomer.find(function (item) {
            return item.ma && item.ma === parseInt(value)
        });

        if (value) {
            let customers = listCustomer.filter(function (item) {
                return (item.ma.toString().includes(value.toLowerCase()) || item.ten.toLowerCase().includes(value.toLowerCase()));
            });
            setListCustomerCurrent(customers.slice(0, 20));
        }

        if (kq) {
            mCustomerName.setValue(kq.ten);
            mDiaChi.setValue(kq.diachi);
            setSoDienThoai(kq.sodienthoai);
        } else if (enter) {
            var resCheck = 0;
            GetlistCustomer(props.token, `ma=${value}`).then(res => {
                try {
                    if (res.data && res.data[0]) {
                        mCustomerName.setValue(res.data[0].ten);
                        mDiaChi.setValue(res.data[0].diachi);
                        setSoDienThoai(res.data[0].sodienthoai);
                    } else {
                        mCustomerName.setValue("");
                        mDiaChi.setValue("");
                        setSoDienThoai("");
                    }
                } catch (ex) {

                }
                if (resCheck != 0)
                    props.addLoading();
                else
                    resCheck = 1;
            }).catch(err => {
                if (resCheck != 0)
                    props.addLoading();
                else
                    resCheck = 1;
            })
            setTimeout(function () {
                if (resCheck == 0) {
                    resCheck = 1;
                    props.setLoading(true, 1);
                }
            }, 500);
        } else {
            mCustomerName.setValue("");
            mDiaChi.setValue("");
            setSoDienThoai("");
        }
    };

    const _handleKeyPressSDT = (e) => {
        if (e.key === 'Enter') {
            handleChangeSDT(e.target.value, true);
        }
    };

    const handleChangeSDT = (value, enter) => {
        setSoDienThoai(value);
        let kq = null;
        kq = listCustomer.find(function (item) {
            return item.sodienthoai && item.sodienthoai === value
        });

        if (value) {
            let customers = listCustomer.filter(function (item) {
                return item.sodienthoai.toLowerCase().includes(value.toLowerCase());
            });
            setListCustomerCurrent(customers.slice(0, 20));
        }

        if (kq) {
            mCustomerName.setValue(kq.ten);
            mDiaChi.setValue(kq.diachi);
            setMaKhachHang(kq.ma);
        } else if (enter || value.length == 10) {
            var resCheck = 0;
            GetlistCustomer(props.token, `sodienthoai=${value}`).then(res => {
                try {
                    if (res.data && res.data[0]) {
                        mCustomerName.setValue(res.data[0].ten);
                        mDiaChi.setValue(res.data[0].diachi);
                        setMaKhachHang(res.data[0].ma);
                    } else {
                        mCustomerName.setValue("");
                        mDiaChi.setValue("");
                        setMaKhachHang("");
                    }
                } catch (ex) {

                }
                if (resCheck != 0)
                    props.addLoading();
                else
                    resCheck = 1;
            }).catch(err => {
                if (resCheck != 0)
                    props.addLoading();
                else
                    resCheck = 1;
            })
            setTimeout(function () {
                if (resCheck == 0) {
                    resCheck = 1;
                    props.setLoading(true, 1);
                }
            }, 500);
        } else {
            mCustomerName.setValue("");
            mDiaChi.setValue("");
            setMaKhachHang("");
        }
    };

    const updateChangSL = (index, soluong) => {
        let newItem = mProducts[index];
        newItem.soluong = soluong;
        let tongTien = mTongTien - newItem.tongtien;
        newItem.tongtien = newItem.dongia * newItem.soluong * ((100 - newItem.chietkhau) / 100)
        let newProduct = [...mProducts.slice(0, index), newItem, ...mProducts.slice(index + 1, mProducts.length)];
        setProducts(newProduct);
        setTongTien(tinhTongTien(newProduct));
    }
    const handleChangeSL = (e, index) => {
        updateChangSL(index, e.target.value);
    }


    const handleChangeChieuKhau = (e, index) => {
        try {
            let newItem = mProducts[index];
            newItem.chietkhau = parseInt(e.target.value);
            let tongTien = mTongTien - newItem.tongtien;
            newItem.tongtien = newItem.dongia * newItem.soluong * ((100 - newItem.chietkhau) / 100)
            let newProduct = [...mProducts.slice(0, index), newItem, ...mProducts.slice(index + 1, mProducts.length)];
            setProducts(newProduct);
            setTongTien(tinhTongTien(newProduct));
        } catch (ex) {

        }
    }
    const checkHasItem = (sp, item) => {
        if (sp.tencongviec.toLowerCase() == "" || sp.tencongviec.toLowerCase() != item.tencongviec.toLowerCase())
            return false;
        if (sp.maphutung == "" || sp.maphutung.toLowerCase() != item.maphutung.toLowerCase())
            return false;
        if (sp.nhacungcap == "" || sp.nhacungcap != 'Trung Trang' || sp.nhacungcap.toLowerCase() != item.nhacungcap.toLowerCase())
            return false;
        if (!sp.dongia || sp.dongia < 0 || sp.dongia != item.dongia)
            return false;
        return true;
    };

    const checkHasRender = (Search, item) => {
        let strSearch = Search.toLowerCase();
        return (item.maphutung != "" && item.maphutung.toLowerCase() == strSearch);
    };

    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };

    const handleButtonSearch = () => {
        let search = searchValue;
        if (search === "")
            return;
        let list = props.listProduct.filter(function (item) {
            return (checkHasRender(search, item));
        });
        if (!list || list.length == 0) {
            props.alert("Không tìm thấy phụ tùng: " + search)
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
        if (item.soluongtonkho <= 0) {
            props.alert("hiện tại phụ tùng " + item.maphutung + " đã hết hàng\n Vui lòng kiểm tra lại kho");
            return;
        }

        let newData = {
            tencongviec: item.tentiengviet,
            maphutung: item.maphutung,
            dongia: parseInt(item.giaban_le),
            soluong: 1,
            chietkhau: 0,
            tongtien: parseInt(item.giaban_le),
            nhacungcap: 'Trung Trang'
        };
        addItemToProduct(newData);
        setSearchValue("")
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

    const handleChoseFile = async (e) => {
        var files = e.target.files;
        // props.setLoading(true);
        try {
            var value = await readFile(files[0], props.token)
            addListItemToProduct(value);
        }
        catch (err) {
        };
        // props.setLoading(false);
    }
    function readFile(file, token) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(file)
            reader.onload = function (e) {
                var dataFile = new Uint8Array(e.target.result);
                var workbook = XLSX.read(dataFile, { type: 'array' });
                var data = [];
                for (let k in workbook.SheetNames) {
                    if (k != "0") continue;
                    console.log(workbook.SheetNames[k])
                    const wsname = workbook.SheetNames[k];
                    const ws = workbook.Sheets[wsname];
                    var K = ws['!ref'].split(':')[1];
                    var vitriK = parseInt(K.substring(1, K.length));
                    for (var i = 13; i <= vitriK; i++) {
                        if (ws["B" + i] == null && ws["C" + i] == null || ws["D" + i] == null || ws["D" + i].v == null || ws["E" + i] == null || ws["E" + i].v == null || ws["E" + i].v == 0)
                            continue;
                        var dongia = parseInt(ws["D" + i].v);
                        var soluong = parseInt(ws["E" + i].v);
                        var chieukhau = ws["G" + i] ? parseFloat(ws["G" + i].v) : 0

                        let newData = {
                            tencongviec: ws["C" + i] ? ws["C" + i].v : "",
                            maphutung: ws["B" + i] ? ws["B" + i].v : "",
                            dongia: dongia,
                            soluong: soluong,
                            chietkhau: chieukhau * 100,
                            tongtien: (dongia - dongia * chieukhau) * soluong,
                            nhacungcap: 'Trung Trang'
                        };
                        console.log(newData);

                        data.push(newData);
                    }
                }
                return resolve(data);
            }
            reader.onloadend = function (e) {
                // return resolve(dataws);
            }
            reader.onerror = function (e) {
                return reject(e);
            }
        })
    }
    return (
        <div>
            {props.isLoading && <Loading />}
            {!props.isLoading &&
                <div>
                    {loai != 0 && <h1 style={{ textAlign: "center" }}> Hóa đơn {mahoadonUpdate}</h1>}
                    {loai == 0 && <h1 style={{ textAlign: "center" }}> Hóa đơn bán lẻ</h1>}
                    <DivFlexRow>
                        <DivFlexColumn>
                            <label>Tên khách hàng: </label>
                            <Input autocomplete="off" {...mCustomerName} readOnly={loai != 0} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Mã khách hàng: </label>
                            <Input list="customer" name="customer" autocomplete="off"
                                onKeyPress={_handleKeyPressKH}
                                value={makhachhang} onChange={(e) => handleChangeKH(e.target.value, false)} readOnly={loai != 0} />
                            <datalist id="customer">
                                {listCustomerCurrent.map((item, index) => (
                                    <option key={index} value={item.ma} >{item.ten}</option>
                                ))}
                            </datalist>
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Số điện thoại: </label>
                            <Input list="sodienthoai" name="sodienthoai" autocomplete="off"
                                onKeyPress={_handleKeyPressSDT}
                                value={sodienthoai} onChange={(e) => handleChangeSDT(e.target.value, false)} readOnly={loai != 0} />
                            <datalist id="sodienthoai">
                                {listCustomerCurrent.map((item, index) => (
                                    <option key={index} value={item.sodienthoai} >{item.ten}</option>
                                ))}
                            </datalist>
                        </DivFlexColumn>

                        <DivFlexColumn style={{ marginLeft: 20 }} >
                            <label>Địa chỉ: </label>
                            <Input autocomplete="off" {...mDiaChi} width='400px' readOnly={loai != 0} />
                        </DivFlexColumn>
                    </DivFlexRow>
                    {(loai == 2 && lydo || loai == 1) &&
                        <DivFlexRow style={{ alignItems: 'center' }}>
                            <DivFlexColumn>
                                <label>Lý do thay đổi: </label>
                                <Textarea autocomplete="off" value={lydo} readOnly={loai == 2} onChange={(e => { setLydo(e.target.value) })} />
                            </DivFlexColumn>
                        </DivFlexRow>
                    }
                    {loai != 2 &&
                        <DivFlexRow style={{ marginTop: 5, marginBottom: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Bảng giá phụ tùng: </label>
                            <Button onClick={() => setNewCuaHangNgoai(true)}>    Thêm Của Hàng Ngoài   </Button>
                            <DivFlexRow>
                                <ButtonChooseFile>
                                    <input type="file"
                                        multiple
                                        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        onChange={(e) => handleChoseFile(e)} />
                                    Import +
                                </ButtonChooseFile>
                                <Button style={{ marginLeft: 15 }} onClick={() => setNewProduct(true)}> Thêm Phụ Tùng  </Button>
                            </DivFlexRow>
                        </DivFlexRow>
                    }
                    {loai != 2 &&
                        <DivFlexRow style={{ alignItems: 'center' }}>
                            <Input autoFocus list="browser_search" onKeyPress={_handleKeyPress} value={searchValue} style={{ width: 250, marginRight: 15 }}
                                onChange={(e) => searchMaPhuTung(e.target.value)} />
                            <datalist id="browser_search">
                                {mDataList.map((item, index) => (
                                    <option disabled={item.soluongtonkho === 0} key={index}
                                        value={item.maphutung}>{item.tentiengviet} ({item.soluongtonkho})</option>
                                ))}
                            </datalist>
                            <Button onClick={() => {
                                handleButtonSearch();
                            }}>

                                Tìm Kiếm
                                <i className="fas fa-search" />
                            </Button>
                        </DivFlexRow>
                    }
                    <Table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Tên phụ tùng</th>
                                <th>Mã phụ tùng</th>
                                <th>Đơn giá (VND)</th>
                                <th>SL</th>
                                <th>Nhà Cung Cấp</th>
                                <th>Chiết khấu (%)</th>
                                <th>Tổng tiền (VND)</th>
                                {loai != 2 && <th><i className="far fa-trash-alt" /></th>}
                            </tr>

                            {mProducts.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.tencongviec}</td>
                                    <td>{item.maphutung}</td>
                                    <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    <td><input type="number" readOnly={loai == 2} onChange={(e) => handleChangeSL(e, index)} value={mProducts[index].soluong} min="1" /></td>
                                    <td>{item.nhacungcap ? item.nhacungcap : "Trung Trang"}</td>
                                    <td><input type="number" max={100} readOnly={loai == 2} onChange={(e) => handleChangeChieuKhau(e, index)} value={mProducts[index].chietkhau} min="0" /></td>
                                    <td>{item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    {loai != 2 && <td>
                                        <DelButton onClick={() => {
                                            deleteProduct(item);
                                        }} title="Xóa">
                                            <i className="far fa-trash-alt" />
                                        </DelButton>
                                    </td>}
                                </tr>

                            ))}

                        </tbody>
                    </Table>
                    <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                        <h3>Tổng tiền: {mTongTien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</h3>
                    </DivFlexRow>
                    <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                        <label></label>
                        {loai == 1 && <Button onClick={() => {
                            props.confirm("Bạn chắc muốn thay đổi hóa đơn " + mahoadonUpdate, () => {
                                handleSaveBill();
                            })
                        }}>Thay đổi</Button>}
                        {loai == 0 && <Button onClick={() => {
                            props.confirm("Bạn muốn thanh toán", () => {
                                handleAddBill();
                            })
                        }}>Thánh Toán</Button>}

                        {loai == 2 && ngaythanhtoan && (moment().valueOf() - moment(ngaythanhtoan).valueOf()) <= oneDay &&
                            <Button onClick={() => {
                                setShowingConfirm(true);
                            }}> Update </Button>
                        }

                    </DivFlexRow>
                    <PopupNewProduct
                        isShowing={isShowNewProduct}
                        onCloseClick={() => setNewProduct(false)}
                        addItemToProduct={(item) => addItemToProduct(item)}
                    />
                    <PopupNewCuaHangNgoai
                        isShowing={isShowCuaHangNgoai}
                        onCloseClick={() => setNewCuaHangNgoai(false)}
                        listCuaHangNgoai={listCuaHangNgoai}
                        addItemToHangNgoai={(item) => addItemToProduct(item)}
                    />
                    <ConfirmHoaDon
                        isShowing={isShowingConfirm}
                        onCloseClick={() => setShowingConfirm(false)}
                        mahoadon={mahoadonUpdate}
                        token={props.token}
                        history={props.history}
                        alert={(mess) => props.alert(mess)}
                    />
                    <ChiTietThongKe
                        isShowing={isShowChitiet}
                        onCloseClick={() => { setShowChitiet(false); setMaHoaDon("") }}
                        mahoadon={mMaHoaDon}
                        token={props.token}
                        loaihoadon={1}
                    />
                </div>
            }
        </div>
    );
}

const mapState = (state) => ({
    token: state.Authenticate.token,
    info: state.Authenticate.info,
    listProduct: state.Product.listProduct,
    isLoading: state.App.isLoading

})
const mapDispatch = (dispatch) => ({
    getAllProduct: (token) => { dispatch(getAllProduct(token)) },
})
export default connect(mapState, mapDispatch)(BanLe);
