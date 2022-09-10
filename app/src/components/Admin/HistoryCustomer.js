import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input, Table, Tab, Link } from '../../styles'
// import { showNoti } from '../../../Actions/Notification';
import { GetCustomerDetail } from '../../API/Customer'
import ChiTietThongKe from '../ThongKe/ChiTietThongKe'

import { connect } from 'react-redux'
import moment from 'moment';

const IconCircle = (props) => {
    return (
        <i className='fa fa-circle' style={props.style}></i>
    )
}
const getTrangThai = (e) => {
    switch (e) {
        case -1:
            return "Tất cả";
        case 0:
            return "Chưa chăm sóc";
        case 1:
            return "Đang chăm sóc";
        case 2:
            return "Thành công";
        case 3:
            return "Thất bại";
        default:
            return "Không biết";
    }
}


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
                        <tr key={index} style={{ fontSize: 14 }}>
                            <td>{index + 1}</td>
                            <td>{moment(item.ngaythanhtoan).format('DD/MM/YYYY')}</td>
                            <td><Link onClick={() => {
                                setShowChitiet(true);
                                setMaHoaDon(item.mahoadon);
                            }}>{item.mahoadon}</Link></td>
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

const RenderTableCSKH = ({ list }) => {

    let [isShowChitiet, setShowChitiet] = useState(false);
    let [mMaHoaDon, setMaHoaDon] = useState("");

    return (
        <React.Fragment>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Ngày Hẹn</th>
                        <th>Hóa đơn</th>
                        <th style={{ width: 200 }}>Kiểm tra lần tới</th>
                        <th>Số lần gọi</th>
                        <th>Trạng thái</th>
                        <th style={{ width: 200 }}>Ghi Chú</th>
                    </tr>

                    {list && list.sort(function (a, b) {
                        var x = a.ngayhen.toLowerCase();
                        var y = b.ngayhen.toLowerCase();
                        return x > y ? -1 : x < y ? 1 : 0;
                    }).map((item, index) => (
                        <tr key={index} style={{ fontSize: 14 }}>
                            <td>{index + 1}</td>
                            <td>{moment(item.ngayhen).format('DD/MM/YYYY')}</td>

                            <td><Link style={{
                                borderBottom: "1px solid blue",
                                color: "blue",
                                cursor: "pointer"
                            }} onClick={() => {
                                setShowChitiet(true);
                                setMaHoaDon(item.mahoadon);
                            }}> {item.mahoadon}</Link></td>
                            <td
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100px'
                                }}
                            >{item.kiemtralantoi || ''}</td>
                            <td>{item.solangoi}</td>
                            <td>
                                {getTrangThai(item.trangthai)}
                            </td>
                            <td
                                title={item.ghichu || ''}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100px'
                                }}
                            >{item.ghichu || ''}</td>
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
        </React.Fragment >
    )
}

const RenderTableCall = ({ list }) => {

    const copyCallId = (callid) => {
        try {
            navigator.clipboard.writeText(callid);
        } catch (ex) {

        }
    }


    return (
        <React.Fragment>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Ngày</th>
                        <th>CallId</th>
                        <th>Nhánh</th>
                        <th>Nhân Viên</th>
                        <th>Chiều gọi</th>
                        <th>Kết quả</th>
                        <th>Thời gian gọi</th>
                        <th>Note</th>
                    </tr>

                    {list && list.sort(function (a, b) {
                        var x = a.starttime.toLowerCase();
                        var y = b.starttime.toLowerCase();
                        return x > y ? -1 : x < y ? 1 : 0;
                    }).map((item, index) => (
                        <tr key={index} style={{ fontSize: 14 }}>
                            <td>{index + 1}</td>
                            <td>{moment(item.starttime).format('HH:mm DD/MM/YYYY')}</td>
                            <td
                                title={item.callid}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100px'
                                }}
                                onClick={copyCallId(item.callid)}
                            >{item.callid}</td>
                            <td>{item.breachsip}</td>
                            <td>{item.tennv}</td>
                            <td style={{ color: item.status == 1 ? 'green' : item.status == 2 ? 'red' : '#00ffd0' }}>
                                {
                                    item.direction == 'agent2user' ? <i className='fa fa-arrow-right'></i> :
                                        <i className='fa fa-arrow-left'></i>
                                }
                            </td>
                            <td>
                                <IconCircle style={{ marginRight: '10px', color: item.status == 1 ? 'green' : item.status == 2 ? 'red' : '#00ffd0' }} />
                                {item.status == 1 ? 'Thành công' : item.status == 2 ? 'Gọi nhỡ' : 'Đang gọi'}
                            </td>
                            <td>{parseInt(item.durationms / 1000)}</td>
                            <td
                                onClick={() => {

                                }}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100px',
                                    cursor: 'pointer'
                                }}
                            >{item.note || ''}</td>
                        </tr>

                    ))}

                </tbody>
            </Table>

        </React.Fragment>
    )
}
const HistoryCustomer = (props) => {

    let [mData, setData] = useState("");
    let [activePage, setActive] = useState(0);

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


    const goiKhachHang = (e) => {
        let url = `microsip://callto:${e}`;
        window.open(
            url,
        );
    }

    useEffect(() => {
        function handleEscapeKey(event) {
            if (event.code === 'Escape') {
                props.onCloseClick();
            }
        }

        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
    }, [])


    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={props.onCloseClick}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <DivFlexRow style={{ marginTop: 10, width: '100%', justifyContent: 'space-between' }}>
                    <DivFlexColumn style={{ fontSize: 14, marginBottom: 2 }}>
                        Tên Khách Hàng
                        <Input readOnly value={mData.ten || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                        Số Điện Thoại
                        <Input readOnly type="Number" value={mData.sodienthoai || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                        Zalo Id
                        <Input readOnly type="" value={mData.zaloid || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2, width: '100px' }}>
                        Giới Tính
                        <Input readOnly value={mData.gioitinh == '1' ? 'Nữ' : mData.gioitinh == '0' ? 'Nam' : ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2, width: '150px' }}>
                        Thành Phố
                        <Input readOnly value={mData.thanhpho} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2, width: '150px', justifyContent: "space-around" }}>
                        <DivFlexColumn style={{ display: "inline", width: "100%" }}>
                            <Button style={{ width: "50px" }} title="Nhắn tin khách hàng" onClick={() => {
                                if (!mData.zaloid) {
                                    props.alert('Chưa có thông tin zalo từ khách hàng này')
                                } else {
                                    window.open(`https://oa.zalo.me/chatv2?uid=${mData.zaloid}&oaid=2867735993958514567`, '_blank');
                                }
                            }} ><i className="fas fa-comment"></i> </Button>
                            <Button style={{ width: "50px", marginLeft: "10px" }} title="Gọi khách hàng" onClick={() => {
                                props.confirm(`Bạn muốn gọi ${mData.ten} (${mData.sodienthoai}) `, () => {
                                    goiKhachHang(mData.sodienthoai);
                                })
                            }} ><i className="fas fa-phone"></i> </Button>
                        </DivFlexColumn>

                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ marginTop: 10, width: '100%', justifyContent: 'space-between' }}>
                    <DivFlexColumn style={{ fontSize: 14, marginBottom: 2 }}>
                        Biển Số Xe
                        <Input readOnly width='auto' value={mData.biensoxe || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                        Loại Xe
                        <Input readOnly width='auto' value={mData.loaixe || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                        Số  Khung
                        <Input readOnly width='auto' value={mData.sokhung || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                        Số  Máy
                        <Input readOnly width='auto' value={mData.somay || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                        Địa Chỉ
                        <Input readOnly width='auto' value={mData.diachi || ''} />
                    </DivFlexColumn>
                </DivFlexRow>
                <Tab>
                    <button className={activePage === 0 ? "active" : ""} onClick={() => setActive(0)}>Sữa chữa</button>
                    <button className={activePage === 1 ? "active" : ""} onClick={() => setActive(1)}>Chăm sóc</button>
                    <button className={activePage === 2 ? "active" : ""} onClick={() => setActive(2)}>Cuộc gọi</button>
                </Tab>
                {activePage === 0 &&
                    <RenderTableDetail list={mData.chitiet} {...props} />
                }
                {activePage === 1 &&
                    <RenderTableCSKH list={mData.historycskh} {...props} />
                }
                {activePage === 2 &&
                    <RenderTableCall list={mData.historycall} {...props} />
                }
            </ModalContent>
        </Modal>
    )
}

const mapState = (state) => ({
    token: state.Authenticate.token,
})

export default connect(mapState, null)(HistoryCustomer);