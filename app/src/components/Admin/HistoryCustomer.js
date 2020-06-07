import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input, Table } from '../../styles'
// import { showNoti } from '../../../Actions/Notification';
import { GetCustomerDetail } from '../../API/Customer'
import ChiTietThongKe from '../ThongKe/ChiTietThongKe'

import { connect } from 'react-redux'
import moment from 'moment';



const RenderTableDetail = ({ list }) => {

    let [isShowChitiet, setShowChitiet] = useState(false);
    let [mMaHoaDon, setMaHoaDon] = useState("");
    return (
        <React.Fragment>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>Mã Hóa Đơn</th>
                        <th>Nhân viên sữa chữa</th>
                        <th>Yêu cầu khách hàng</th>
                        <th>Tư vấn sữa chữa</th>
                        <th></th>
                    </tr>

                    {list && list.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ngaythanhtoan}</td>
                            <td>{item.mahoadon}</td>
                            <td>{item.tennvsuachua}</td>
                            <td>{item.yeucaukhachhang}</td>
                            <td>{item.tuvansuachua}</td>
                            <td><Button onClick={() => {
                                    setShowChitiet(true);
                                    setMaHoaDon(item.mahoadon);
                                }} >Chi tiết</Button>
                            </td>
                        </tr>

                    ))}

                </tbody>
            <ChiTietThongKe
                isShowing={isShowChitiet}
                onCloseClick={() => {setShowChitiet(false);setMaHoaDon("")}}
                mahoadon={mMaHoaDon}
                token={""}
                loaihoadon={0}
            />
            </Table>
        </React.Fragment>
    )
}

const HistoryCustomer = (props) => {

    let [mData, setData] = useState("");

    let ma = props.ma;
    useEffect(() => {
        if (ma) {
            GetCustomerDetail(props.token,ma).then((res) => {
                setData(res.data);
            }).catch(err => {
                alert('không thể xem được chi tiết');
                console.log(err);
            })
        }
    }, [ma])

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={props.onCloseClick}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <DivFlexRow style={{ marginTop: 10, width: '100%' }}>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Tên Khách Hàng
                                <Input readOnly width='auto' value={mData.ten} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số Điện Thoại
                                <Input readOnly width='auto' type="Number" value={mData.sodienthoai} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 5 }}>
                        Địa Chỉ
                                <Input readOnly width='auto' value={mData.diachi} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ marginTop: 10, width: '100%' }}>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Biển Số Xe
                                <Input readOnly width='auto' value={mData.biensoxe} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Loại Xe
                                <Input readOnly width='auto' value={mData.loaixe} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số  Khung
                                <Input readOnly width='auto' value={mData.sokhung} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số  Máy
                                <Input readOnly width='auto' value={mData.somay} />
                    </DivFlexColumn>
                </DivFlexRow>
                <RenderTableDetail list={mData.chitiet} />
            </ModalContent>
        </Modal>
    )
}

const mapState = (state) => ({
    token: state.Authenticate.token,
})

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, null)(HistoryCustomer);