import React, { useState, useEffect } from 'react'
import { Table, Button, DelButton, DivFlexRow, Input } from '../../styles'
import { connect } from 'react-redux'
import CustomerDetail from './CustomerDetail'
import { GetlistCustomer, DeleteCustomer } from '../../API/Customer'
import HistoryCustomer from './HistoryCustomer'
import Loading from "../Loading";
import { alert, error, setLoading } from "../../actions/App";


const Customer = (props) => {
    let [editItem, setEditItem] = useState(null);
    let [isShowCustomerDetail, setShowCustomerDetail] = useState(false);
    let [isShowHistoryCustomer, setShowHistoryCustomer] = useState(false);

    var [listCustomer, setlistCustomer] = useState([]);
    var [listCustomerTemp, setlistCustomerTemp] = useState([]);
    var [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        getlistCustomer();
    }, []);

    const getlistCustomer = () => {
        GetlistCustomer(props.token).then(Response => {
            setlistCustomer(Response.data);
            setlistCustomerTemp(Response.data);
            props.setLoading(false);
        }).catch(err => {
            props.alert("Không thể load danh sách khách hàng");
        })
    }
    // const handleButtonEdit = (item) => {
    //     setShowCustomerDetail(true);
    //     setEditItem(item);
    // };
    const handleButtonSearch = () => {
        var arr = []
        arr = listCustomerTemp.filter(e => e.ten.toLowerCase().includes(searchValue.toLowerCase()) || e.biensoxe.toLowerCase().includes(searchValue.toLowerCase()) || e.sodienthoai.toLowerCase().includes(searchValue.toLowerCase()));
        setlistCustomer(arr);
    };
    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    }
    return (
        <React.Fragment>
            {props.isLoading && <Loading />}
            {!props.isLoading &&
                <React.Fragment>
                    <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px' }}>Danh sách Khách Hàng</span>
                        <Button onClick={() => {
                            setShowCustomerDetail(true)
                            setEditItem(null);
                        }}>
                            Thêm mới
              <i className="fas fa-plus"></i>
                        </Button>
                    </DivFlexRow>
                    <DivFlexRow style={{ alignItems: 'center', marginTop: 5, marginBottom: 15 }}>
                        <Input onKeyPress={_handleKeyPress} style={{ width: 250, marginRight: 15 }} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button onClick={() => {
                            handleButtonSearch();
                        }}>
                            Tìm Kiếm
              <i className="fas fa-search"></i>
                        </Button>
                    </DivFlexRow>
                    <Table>
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Tên</th>
                                <th>SDT</th>
                                <th style={{ width: 320 }}>Địa Chỉ</th>
                                <th>Biển Số Xe</th>
                                <th>Loại Xe</th>
                                <th>Số  Khung</th>
                                <th>Số  Máy</th>
                                <th>Chi tiết | Cập nhập | Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCustomer.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ fontSize: 14 }}>{item.ma}</td>
                                    <td style={{ fontSize: 14 }}>{item.ten}</td>
                                    <td style={{ fontSize: 14 }}>{item.sodienthoai}</td>
                                    <td style={{ fontSize: 14 }}>{item.diachi}</td>
                                    <td style={{ fontSize: 14 }}>{item.biensoxe}</td>
                                    <td style={{ fontSize: 14 }}>{item.loaixe}</td>
                                    <td style={{ fontSize: 14 }}>{item.sokhung}</td>
                                    <td style={{ fontSize: 14 }}>{item.somay}</td>
                                    <td style={{ fontSize: 14 }}>
                                        <Button onClick={() => {
                                            setShowHistoryCustomer(true);
                                            setEditItem(item);
                                        }} title="Xem chi tiết"><i className="fas fa-address-book"></i> </Button>
                                        <Button onClick={() => {
                                            setShowCustomerDetail(true);
                                            setEditItem(item);
                                        }} style={{ marginLeft: 5 }} title="Cập nhập thông tin khách hàng"><i className="fas fa-edit"></i></Button>
                                        <DelButton onClick={() => {
                                            if (window.confirm("Bạn chắc muốn xóa khách hàng này") == true) {
                                                DeleteCustomer(props.token, item.ma).then(() => {
                                                    getlistCustomer();
                                                }).catch(err => {
                                                    props.error('Xoa that bai');
                                                });
                                            }
                                        }} style={{ marginLeft: 5 }} title="Xóa Khách hàng"><i className="far fa-trash-alt"></i></DelButton>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </Table>
                    <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 15 }}>
                        <Button><i className="fas fa-angle-double-left"></i></Button>
                        <Button style={{ marginLeft: 10 }}><i className="fas fa-angle-double-right"></i></Button>
                    </DivFlexRow>
                    <CustomerDetail isShowing={isShowCustomerDetail} onCloseClick={(hasUpdate) => {
                        setShowCustomerDetail(false)
                        setEditItem(null);
                        console.log(hasUpdate);
                        if (hasUpdate===true) {
                            getlistCustomer();
                        }
                    }
                    } editItem={editItem} />

                    <HistoryCustomer token={props.token} isShowing={isShowHistoryCustomer} onCloseClick={() => {
                        setShowHistoryCustomer(false)
                        setEditItem(null);
                    }
                    } ma={editItem && editItem.ma ? editItem.ma : null} />

                </React.Fragment>
            }
        </React.Fragment>

    )
}
const mapState = (state) => ({
    isLoading: state.App.isLoading,
    token: state.Authenticate.token
})

export default connect(mapState, null)(Customer);
