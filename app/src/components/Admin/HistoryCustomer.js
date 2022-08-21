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
                        <th>KTDK</th>
                        <th>Xem chi tiết</th>
                    </tr>

                    {list && list.sort(function (a, b) {
                        var x = a.ngaythanhtoan.toLowerCase();
                        var y = b.ngaythanhtoan.toLowerCase();
                        return x > y ? -1 : x < y ? 1 : 0;
                    }).map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ngaythanhtoan}</td>
                            <td>{item.mahoadon}</td>
                            <td>{item.tennvsuachua}</td>
                            <td style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                            }}>{item.yeucaukhachhang}</td>
                            <td style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                            }}>{item.tuvansuachua}</td>
                            <td>{(!item.kiemtradinhky || item.kiemtradinhky == "0") ? "Không" : ("Lần " + (item.kiemtradinhky || ""))}</td>
                            <td><Button title="Xem chi tiết" onClick={() => {
                                setShowChitiet(true);
                                setMaHoaDon(item.mahoadon);
                            }} ><i className="fas fa-address-book"></i> </Button>
                            </td>
                        </tr>

                    ))}

                </tbody>
            </Table>
            <ChiTietThongKe
                isShowing={isShowChitiet}
                onCloseClick={() => { setShowChitiet(false); setMaHoaDon("") }}
                mahoadon={mMaHoaDon}
                token={""}
                loaihoadon={0}
            />
        </React.Fragment>
    )
}

const HistoryCustomer = (props) => {

    let [mData, setData] = useState("");

    let ma = props.ma;
    useEffect(() => {
        if (ma) {
            GetCustomerDetail(props.token, ma).then((res) => {
                setData(res.data);
            }).catch(err => {
                alert('không thể xem được chi tiết');
                console.log(err);
            })
        } else {
            setData({});
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
                        <Input readOnly width='auto' value={mData.ten || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số Điện Thoại
                        <Input readOnly width='100px' type="Number" value={mData.sodienthoai || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Giới Tính
                        <Input readOnly width='100px' value={mData.gioitinh == '1' ? 'Nữ' : mData.gioitinh == '0' ? 'Nam' : ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Thành Phố
                        <Input readOnly width='150px' value={mData.thanhpho} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 5, width: 400 }}>
                        Địa Chỉ
                        <Input readOnly width='auto' value={mData.diachi || ''} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ marginTop: 10, width: '100%' }}>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Biển Số Xe
                        <Input readOnly width='auto' value={mData.biensoxe || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Loại Xe
                        <Input readOnly width='auto' value={mData.loaixe || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số  Khung
                        <Input readOnly width='auto' value={mData.sokhung || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số  Máy
                        <Input readOnly width='auto' value={mData.somay || ''} />
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