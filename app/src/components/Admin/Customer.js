import React, { useState, useEffect } from 'react'
import { Table, Button, DelButton, DivFlexRow, Input, Select } from '../../styles'
import { connect } from 'react-redux'
import CustomerDetail from './CustomerDetail'
import { GetlistCustomer, DeleteCustomer } from '../../API/Customer'
import HistoryCustomer from './HistoryCustomer'
import Loading from "../Loading";
import _ from 'lodash'

const Customer = (props) => {
    let [editItem, setEditItem] = useState(null);
    let [isShowCustomerDetail, setShowCustomerDetail] = useState(false);
    let [isShowHistoryCustomer, setShowHistoryCustomer] = useState(false);

    var [listCustomer, setlistCustomer] = useState([]);
    var [listCustomerTemp, setlistCustomerTemp] = useState([]);
    var [listCustomerFull, setlistCustomerFull] = useState([]);
    var [searchValue, setSearchValue] = useState("");
    let [maxSizePage, setMaxSizePage] = useState(50);
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);


    useEffect(() => {
        getlistCustomer();
    }, []);

    const getlistCustomer = () => {
        props.setLoading(true);
        GetlistCustomer(props.token).then(Response => {
            var dataCustomer = Response.data.reverse();
            setlistCustomerFull(dataCustomer);
            setlistCustomerTemp(dataCustomer)
            tachList(dataCustomer, maxSizePage);
            props.setLoading(false);
        }).catch(err => {
            props.alert("Không thể load danh sách khách hàng");
        })
    }

    const tachList = (list, size) => {
        let tmp = _.chunk(list, size);
        setlistCustomer(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleNextPage = () => {
        let newPage = page + 1;
        if (newPage >= maxPage) {
            return;
        }
        setPage(newPage);
    };

    const handlePrevPage = () => {
        let newPage = page - 1;
        if (newPage < 0) {
            return;
        }
        setPage(newPage);
    };

    // const handleButtonEdit = (item) => {
    //     setShowCustomerDetail(true);
    //     setEditItem(item);
    // };
    const handleButtonSearch = () => {
        if (searchValue == "") {
            return;
        }
        var arr = []
        arr = listCustomerFull.filter(e => e.ten.toLowerCase().includes(searchValue.toLowerCase()) || e.biensoxe.toLowerCase().includes(searchValue.toLowerCase()) || e.sodienthoai.toLowerCase().includes(searchValue.toLowerCase()));
        setlistCustomerTemp(arr);
        tachList(arr, maxSizePage);
    };
    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    }
    const handleChangeSoHang = (e) => {
        setMaxSizePage(parseInt(e));
        tachList(listCustomerTemp, e);
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
                    <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <DivFlexRow style={{ alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
                            <Input onKeyPress={_handleKeyPress} style={{ width: 250, marginRight: 15 }} onChange={(e) => setSearchValue(e.target.value)} />
                            <Button onClick={() => {
                                handleButtonSearch();
                            }}> Tìm Kiếm   <i className="fas fa-search"></i>
                            </Button>
                        </DivFlexRow>
                        <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 5, marginBottom: 10 }}>
                            <label>Số hàng </label>
                            <Select style={{ marginLeft: 10 }} width={100} value={maxSizePage} onChange={(e) => handleChangeSoHang(e.target.value)} >
                                <option value="25" >25</option>
                                <option value="50" >50</option>
                                <option value="100" >100</option>
                                <option value="250" >250</option>
                                <option value="500" >500</option>
                                <option value="1000" >1000</option>
                                <option value="2000" >2000</option>
                            </Select>
                            <Button style={{ marginLeft: 35 }} onClick={handlePrevPage}><i className="fas fa-angle-double-left"></i></Button>
                            <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                                <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                            </DivFlexRow>
                            <Button style={{ marginLeft: 15 }} onClick={handleNextPage}><i className="fas fa-angle-double-right"></i></Button>
                        </DivFlexRow>
                    </DivFlexRow>

                    <Table>
                        <thead>
                            <tr>
                                <th>STT</th>
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
                            {listCustomer[page] && listCustomer[page].map((item, index) => (
                                <tr key={index}>
                                    <td style={{ fontSize: 14 }}>{index + 1}</td>
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
                                            props.confirm("Bạn chắc muốn xóa khách hàng này", () => {
                                                DeleteCustomer(props.token, item.ma).then(() => {
                                                    getlistCustomer();
                                                }).catch(err => {
                                                    props.error('Xoa that bai');
                                                });
                                            })
                                        }} style={{ marginLeft: 5 }} title="Xóa Khách hàng"><i className="far fa-trash-alt"></i></DelButton>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </Table>
                    <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 15 }}>
                        <Button onClick={handlePrevPage}><i className="fas fa-angle-double-left"></i></Button>
                        <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                            <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                        </DivFlexRow>
                        <Button style={{ marginLeft: 15 }} onClick={handleNextPage}><i className="fas fa-angle-double-right"></i></Button>
                    </DivFlexRow>
                    <CustomerDetail alert={props.alert} error={props.error} confirm={props.confirm} isShowing={isShowCustomerDetail} onCloseClick={(hasUpdate) => {
                        setShowCustomerDetail(false)
                        setEditItem(null);
                        if (hasUpdate === true) {
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
