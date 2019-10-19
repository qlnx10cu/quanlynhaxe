import React, { useState, useEffect } from 'react'
import { Table, Button, DelButton, DivFlexRow, Input } from '../../styles'
import { connect } from 'react-redux'
import CustomerDetail from './CustomerDetail'
import { GetlistCustomer, DeleteCustomer } from '../../API/Customer'
import HistoryCustomer from './HistoryCustomer'

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

        });
    }
    // const handleButtonEdit = (item) => {
    //     setShowCustomerDetail(true);
    //     setEditItem(item);
    // };
    const handleButtonSearch = () => {
        var arr = []
        arr = listCustomerTemp.filter(e => e.ten.toLowerCase().includes(searchValue.toLowerCase()));
        setlistCustomer(arr);
    };
    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    }
    return (
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
                <tbody>
                    <tr>
                        <th>Mã Khách Hàng</th>
                        <th>Tên Khách Hàng</th>
                        <th>Số Điện Thoại</th>
                        <th>Địa Chỉ</th>
                        <th>Biển Số Xe</th>
                        <th>Loại Xe</th>
                        <th>Số  Khung</th>
                        <th>Số  Máy</th>
                        <th></th>
                    </tr>

                    {listCustomer.map((item, index) => (
                        <tr key={index}>
                            <td>{item.ma}</td>
                            <td>{item.ten}</td>
                            <td>{item.sodienthoai}</td>
                            <td>{item.diachi}</td>
                            <td>{item.biensoxe}</td>
                            <td>{item.loaixe}</td>
                            <td>{item.sokhung}</td>
                            <td>{item.somay}</td>
                            <td>
                                <Button onClick={() => {
                                    setShowHistoryCustomer(true);
                                    setEditItem(item);
                                }} >Chi tiết</Button>
                                <Button onClick={() => {
                                    setShowCustomerDetail(true);
                                    setEditItem(item);
                                }} style={{ marginLeft: 5 }}>Cập nhật</Button>
                                <DelButton onClick={() => {
                                    DeleteCustomer(props.token, item.ma).then().catch(err => {
                                        console.log('Xoa that bai');
                                    });
                                    getlistCustomer();
                                }} style={{ marginLeft: 5 }}><i className="far fa-trash-alt"></i></DelButton>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
            <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button><i className="fas fa-angle-double-left"></i></Button>
                <Button style={{ marginLeft: 10 }}><i className="fas fa-angle-double-right"></i></Button>
            </DivFlexRow>
            <CustomerDetail isShowing={isShowCustomerDetail} onCloseClick={() => {
                setShowCustomerDetail(false)
                setEditItem(null);
                getlistCustomer();
            }
            } editItem={editItem} />

            <HistoryCustomer isShowing={isShowHistoryCustomer} onCloseClick={() => {
                setShowHistoryCustomer(false)
                setEditItem(null);
            }
            } ma={editItem&&editItem.ma?editItem.ma:null} />



        </React.Fragment>

    )
}
const mapState = (state) => ({
    token: state.Authenticate.token
})
export default connect(mapState, null)(Customer);
