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
import { GetBillBanLeByMaHoaDon, GetBillSuaChuaByMaHoaDon } from '../../API/Bill'



const BanLe = (props) => {

    let mCustomerName = lib.handleInput("");
    let [makhachhang, setMaKhachHang] = useState("");
    let [mProducts, setProducts] = useState([]);
    let [mHangNgoais, setHangNgoais] = useState([]);
    let [isShowNewProduct, setNewProduct] = useState(false);
    let [isShowCuaHangNgoai, setNewCuaHangNgoai] = useState(false);
    let [listCuaHangNgoai, setCuaHangNgoai] = useState([]);
    let [mTongTien, setTongTien] = useState(0);
    let [listCustomer, setListCustomer] = useState([]);
    let [loai, setLoai] = useState(false);
    let [mahoadonUpdate, setmahoadonUpdate] = useState("");

    useEffect(() => {
        clearAll();
        GetListCuaHangNgoai(props.token).then(res => {
            setCuaHangNgoai(res.data);
        });
        GetlistCustomer(props.token).then(res => {
            setListCustomer(res.data);
        })
            .catch(err => {
                alert("Không thể lấy danh sách khách hàng")
            })
    }, [])

    useEffect(() => {
        let pathname = window.location.href;
        if (pathname.endsWith("/"))
            pathname = pathname.substring(0, pathname.length - 1);
        if (pathname.endsWith("/banle")) {
            setLoai(false)
        }
        else {
            let tmp = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
            if (tmp == "" || tmp.length != 9) {
                setLoai(false)
            }
            else {
                setmahoadonUpdate(tmp)
                setLoai(true)
                getBill(tmp)
            }
        }

    });
    const getBill = (mahoadon) => {
        GetBillBanLeByMaHoaDon(props.token, mahoadon).then(res => {
            let data = res.data;
            if (data.makh) {
                setMaKhachHang(data.makh)
            }
            if (data.tenkh) {
                mCustomerName.setValue(data.tenkh)
            }
            setTongTien(tongtien);
            setProducts(data.chitiet)
        }).catch(err => {
            alert("Không lấy được chi tiết hóa đơn:" + mahoadon);
        })
    }
    const clearAll = () => {
        setTongTien(0);
        setProducts([]);
        setNewProduct(false);
        setNewCuaHangNgoai(false);
        mCustomerName.setValue("");
        setMaKhachHang("");
    }

    const handleSaveBill = () => {

        if (mTongTien === 0) {
            alert("Chưa có sản phẩm nào.")
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

        let data = {
            mahoadon: mahoadonUpdate,
            manv: props.info.ma,
            tenkh: mCustomerName.value,
            tongtien: mTongTien,
            chitiet: chitiet,
        }
        alert("Chức năng đang thực hiện");

        // UpdateBillBanLe(props.token, data).then(res => {
        //     alert('Thành công. ');
        // })
        //     .catch(err => {
        //         alert("Không xuất được hóa đơn.");
        //     })
    }

    const handleAddBill = () => {

        if (mTongTien === 0) {
            alert("Chưa có sản phẩm nào.")
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

        let data = {
            manv: props.info.ma,
            tenkh: mCustomerName.value,
            tongtien: mTongTien,
            chitiet: chitiet,
        }

        SaveBillBanLe(props.token, data).then(res => {
            clearAll();
            alert('Thành công. ' + res.data.mahoadon);
        })
            .catch(err => {
                alert("Không xuất được hóa đơn.");
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
        setTongTien(mTongTien + item.tongtien);
        setProducts([...mProducts, item]);
    }

    const handleChangeKH = (e) => {
        setMaKhachHang(e.target.value);
        let kq = null;
        kq = listCustomer.find(function (item) {
            return item.ma === parseInt(e.target.value)
        });
        if (kq) {
            mCustomerName.setValue(kq.ten);
        }
    };

    const handleChangeSL = (e, index) => {
        let newItem = mProducts[index];
        newItem.soluong = e.target.value;
        let tongTien = mTongTien - newItem.tongtien;
        newItem.tongtien = newItem.dongia * newItem.soluong * ((100 - newItem.chietkhau) / 100)
        let newProduct = [...mProducts.slice(0, index), newItem, ...mProducts.slice(index + 1, mProducts.lenght)];
        setProducts(newProduct);
        setTongTien(tongTien + newItem.tongtien);
    }


    const handleChangeChieuKhau = (e, index) => {
        let newItem = mProducts[index];
        newItem.chietkhau = e.target.value;
        let tongTien = mTongTien - newItem.tongtien;
        newItem.tongtien = newItem.dongia * newItem.soluong * ((100 - newItem.chietkhau) / 100)
        let newProduct = [...mProducts.slice(0, index), newItem, ...mProducts.slice(index + 1, mProducts.lenght)];
        setProducts(newProduct);
        setTongTien(tongTien + newItem.tongtien);
    }

    return (
        <div>
            {loai && <h1 style={{ textAlign: "center" }}> Hóa đơn {mahoadonUpdate}</h1>}
            {!loai && <h1 style={{ textAlign: "center" }}> Hóa đơn bán lẻ</h1>}
            <DivFlexRow>
                <DivFlexColumn>
                    <label>Tên khách hàng: </label>
                    <Input autocomplete="off" {...mCustomerName} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Mã khách hàng: </label>
                    <Input list="customer" name="customer" autocomplete="off" value={makhachhang} onChange={(e) => handleChangeKH(e)} />
                    <datalist id="customer">
                        {listCustomer.map((item, index) => (
                            <option key={index} value={item.ma} >{item.ten}</option>
                        ))}
                    </datalist>
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
                            <td><input type="number" onChange={(e) => handleChangeChieuKhau(e, index)} value={mProducts[index].chietkhau} min="0" /></td>
                            <td>{item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>
                                <DelButton onClick={() => {
                                    deleteProduct(item);
                                }}>
                                    <i className="far fa-trash-alt" />
                                </DelButton>
                            </td>
                        </tr>

                    ))}

                </tbody>
            </Table>
            <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                <h3>Tổng tiền: {mTongTien} VND</h3>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: 'space-between' }}>
                <label></label>
                {loai && <Button onClick={() => {
                    handleSaveBill();
                }}>Thay đổi</Button>}
                {!loai && <Button onClick={() => {
                    handleAddBill();
                }}>Lưu</Button>}
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
        </div>
    );
}

const mapState = (state) => ({
    token: state.Authenticate.token,
    info: state.Authenticate.info,
})

export default connect(mapState)(BanLe);
