import React, { useState, useEffect } from 'react'
import { DivFlexRow, Table, Button, DelButton } from '../../styles'
import PopupCuaHangNgoai from './PopupCuaHangNgoai'
import { connect } from 'react-redux'
import { DeleteItemCuaHangNgoai, GetListCuaHangNgoai } from '../../API/CuaHangNgoai'
import { getListCuaHangNgoai } from '../../actions/Product.js'

const CuaHangNgoai = (props) => {

    let [isShowing, setIsShowing] = useState(false);
    let [item, setItem] = useState(null);
    var [listCuaHang, setCuaHang] = useState([]);

    const handleDelItem = (tenphutung, nhacungcap) => {
        DeleteItemCuaHangNgoai(props.token, tenphutung, nhacungcap).then(res => {
            loadCuaHangNgoai();
        }).catch(err => {
            alert("Lỗi xóa item");
        });
    };
    useEffect(() => {
        loadCuaHangNgoai();
    }, []);
    const loadCuaHangNgoai = () => {
        GetListCuaHangNgoai(props.token).then(res => {
            setCuaHang(res.data);
        });
    }
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Cửa hàng ngoài</h1>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>Danh sách: </span>
                <Button onClick={() => {
                    setIsShowing(true);
                    setItem(null);
                }}>
                    Thêm mới
                        <i className="fas fa-plus"></i>
                </Button>
            </DivFlexRow>

            <Table style={{ marginTop: 15 }}>
                <tbody>
                    <tr>
                        <th>Tên phụ tùng</th>
                        <th>Nhà cung cấp</th>
                        <th>Đơn giá</th>
                        <th>Ghi chú</th>
                        <th></th>
                    </tr>
                    {listCuaHang && listCuaHang.map((item, index) => (
                        <tr key={index}>
                            <td>{item.tenphutung}</td>
                            <td>{item.nhacungcap}</td>
                            <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>{item.ghichu}</td>
                            <td>
                                <Button onClick={() => {
                                    setIsShowing(true);
                                    setItem(item);
                                }}><i className="fas fa-cog"></i></Button>
                                <DelButton onClick={() => {
                                    if (window.confirm("Bạn chắc muốn hủy") == true) {
                                        handleDelItem(item.tenphutung, item.nhacungcap);
                                    }
                                }} style={{ marginLeft: 5 }}><i className="far fa-trash-alt"></i></DelButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <PopupCuaHangNgoai
                isShowing={isShowing}
                onCloseClick={() => { setIsShowing(false); setItem(null); }}
                token={props.token}
                item={item}
                getList={() => loadCuaHangNgoai()}
            />
        </div>
    )
};

const mapState = state => ({
    token: state.Authenticate.token,
    listCuaHangNgoai: state.Product.listCuaHangNgoai,
});

const mapDispatch = dispatch => ({
    getListCuaHangNgoai: (token) => { dispatch(getListCuaHangNgoai(token)) },
});

export default connect(mapState, mapDispatch)(CuaHangNgoai);
