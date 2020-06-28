import React, { useState, useEffect } from 'react';
import lib from '../../lib'
import { DivFlexRow, DivFlexColumn, Button, Input, Table, DelButton } from '../../styles'
import PopupNewProduct from './PopupNewProduct'
import PopupNewCuaHangNgoai from './PopupNewCuaHangNgoai'
import { SaveBillBanLe } from '../../API/Bill'
import { UpdateBillBanLe } from '../../API/Bill'
import { GetlistCustomer } from '../../API/Customer'
import { connect } from 'react-redux'
import { GetListCuaHangNgoai } from '../../API/CuaHangNgoai'
import { GetBillBanLeByMaHoaDon } from '../../API/Bill'
import ChiTietThongKe from '../ThongKe/ChiTietThongKe'
import Loading from "../Loading";

const BanLe = (props) => {

    let mCustomerName = lib.handleInput("");
    let mDiaChi = lib.handleInput("");
    let [makhachhang, setMaKhachHang] = useState("");
    let [sodienthoai, setSoDienThoai] = useState("");
    let [mProducts, setProducts] = useState([]);
    let [mHangNgoais, setHangNgoais] = useState([]);
    let [isShowNewProduct, setNewProduct] = useState(false);
    let [isShowCuaHangNgoai, setNewCuaHangNgoai] = useState(false);
    let [listCuaHangNgoai, setCuaHangNgoai] = useState([]);
    let [mTongTien, setTongTien] = useState(0);
    let [listCustomer, setListCustomer] = useState([]);
    let [loai, setLoai] = useState(false);
    let [mahoadonUpdate, setmahoadonUpdate] = useState("");
    let [searchValue, setSearchValue] = useState("");
    let [mDataList, setDataList] = useState([]);


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
        props.setLoading(true, 2);
        clearAll();

        var mhd = '';
        var loai = false;
        let pathname = window.location.href;
        if (pathname.endsWith("/"))
            pathname = pathname.substring(0, pathname.length - 1);
        if (pathname.endsWith("/banle")) {
            loai = false;
        }
        else {
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

            mhd = queryParams.mahoadon;
            setmahoadonUpdate(queryParams.mahoadon)
            loai = true;
        }
        if (loai == true) {
            props.setLoading(true, 3);
        }

        GetListCuaHangNgoai(props.token).then(res => {
            setCuaHangNgoai(res.data);
            props.addLoading();
        });
        GetlistCustomer(props.token).then(res => {
            setListCustomer(res.data);
            props.addLoading();
        }).catch(err => {
            props.alert("Không thể lấy danh sách khách hàng")
        })

        setLoai(loai)

        if (loai == true) {
            getBill(mhd)
        }


    }, []);
    const getBill = (mahoadon) => {
        GetBillBanLeByMaHoaDon(props.token, mahoadon).then(res => {
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
            setTongTien(data.tongtien);
            setProducts(chitiet)
            props.addLoading();

        }).catch(err => {
            props.error("Không lấy được chi tiết hóa đơn:" + mahoadon);
            window.location.href = "/thongke";
        })
    }
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

        if (mTongTien === 0) {
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
            chitiet: chitiet,
        }

        UpdateBillBanLe(props.token, data).then(res => {
            props.alert('Thành công. ');
        })
            .catch(err => {
                props.error("Không update được hóa đơn.");
            })
    }

    const handleAddBill = () => {
        if (mTongTien === 0) {
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

    const handleChangeKH = (e) => {
        setMaKhachHang(e.target.value);
        let kq = null;
        kq = listCustomer.find(function (item) {
            return item.ma && item.ma === parseInt(e.target.value)
        });
        if (kq) {
            mCustomerName.setValue(kq.ten);
            mDiaChi.setValue(kq.diachi);
            setSoDienThoai(kq.sodienthoai);
        } else {
            mCustomerName.setValue("");
            mDiaChi.setValue("");
            setSoDienThoai("");
        }
    };

    const handleChangeSDT = (e) => {
        setSoDienThoai(e.target.value);
        let kq = null;
        kq = listCustomer.find(function (item) {
            return item.sodienthoai && item.sodienthoai === e.target.value
        });
        if (kq) {
            mCustomerName.setValue(kq.ten);
            mDiaChi.setValue(kq.diachi);
            setMaKhachHang(kq.ma);
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
        let newProduct = [...mProducts.slice(0, index), newItem, ...mProducts.slice(index + 1, mProducts.lenght)];
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
            let newProduct = [...mProducts.slice(0, index), newItem, ...mProducts.slice(index + 1, mProducts.lenght)];
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
    return (
        <div>
            {props.isLoading && <Loading />}
            {!props.isLoading &&
                <div>
                    {loai && <h1 style={{ textAlign: "center" }}> Hóa đơn {mahoadonUpdate}</h1>}
                    {!loai && <h1 style={{ textAlign: "center" }}> Hóa đơn bán lẻ</h1>}
                    <DivFlexRow>
                        <DivFlexColumn>
                            <label>Tên khách hàng: </label>
                            <Input autocomplete="off" {...mCustomerName} readOnly={loai == true} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Mã khách hàng: </label>
                            <Input list="customer" name="customer" autocomplete="off" value={makhachhang} onChange={(e) => handleChangeKH(e)} readOnly={loai == true} />
                            <datalist id="customer">
                                {listCustomer.map((item, index) => (
                                    <option key={index} value={item.ma} >{item.ten}</option>
                                ))}
                            </datalist>
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Số điện thoại: </label>
                            <Input list="sodienthoai" name="sodienthoai" autocomplete="off" value={sodienthoai} onChange={(e) => handleChangeSDT(e)} readOnly={loai == true} />
                            <datalist id="sodienthoai">
                                {listCustomer.map((item, index) => (
                                    <option key={index} value={item.sodienthoai} >{item.ten}</option>
                                ))}
                            </datalist>
                        </DivFlexColumn>

                        <DivFlexColumn style={{ marginLeft: 20 }} >
                            <label>Địa chỉ: </label>
                            <Input autocomplete="off" {...mDiaChi} width='400px' readOnly readOnly={loai == true} />
                        </DivFlexColumn>
                    </DivFlexRow>
                    <DivFlexRow style={{ marginTop: 5, marginBottom: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                        <label>Bảng giá phụ tùng: </label>
                        <Button onClick={() => setNewCuaHangNgoai(true)}>
                            Thêm Của Hàng Ngoài
                </Button>
                        <Button onClick={() => setNewProduct(true)}>
                            Thêm Phụ Tùng
                </Button>
                    </DivFlexRow>
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
                                <th><i className="far fa-trash-alt" /></th>
                            </tr>

                            {mProducts.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.tencongviec}</td>
                                    <td>{item.maphutung}</td>
                                    <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    <td><input type="number" onChange={(e) => handleChangeSL(e, index)} value={mProducts[index].soluong} min="1" /></td>
                                    <td>{item.nhacungcap ? item.nhacungcap : "Trung Trang"}</td>
                                    <td><input type="number" max={100} onChange={(e) => handleChangeChieuKhau(e, index)} value={mProducts[index].chietkhau} min="0" /></td>
                                    <td>{item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                    <td>
                                        <DelButton onClick={() => {
                                            deleteProduct(item);
                                        }} title="Xóa">
                                            <i className="far fa-trash-alt" />
                                        </DelButton>
                                    </td>
                                </tr>

                            ))}

                        </tbody>
                    </Table>
                    <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                        <h3>Tổng tiền: {mTongTien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</h3>
                    </DivFlexRow>
                    <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                        <label></label>
                        {loai && <Button onClick={() => {
                            props.confirm("Bạn chắc muốn thay đổi hóa đơn " + mahoadonUpdate, () => {
                                handleSaveBill();
                            })
                        }}>Thay đổi</Button>}
                        {!loai && <Button onClick={() => {
                            props.confirm("Bạn muốn thanh toán", () => {
                                handleAddBill();
                            })
                        }}>Thánh Toán</Button>}
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

export default connect(mapState, null)(BanLe);
