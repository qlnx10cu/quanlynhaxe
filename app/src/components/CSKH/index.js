import React, { useState, useEffect } from 'react';
import { DivFlexRow, DivFlexColumn, Button, Input, Table, DelButton, Modal, ModalContent, CloseButton, Select, Tab, TabContent, Textarea } from '../../styles'
import moment from 'moment'
import { GetChamSocTheoNgay } from "../../API/ChamSoc"
import HistoryCustomer from '../Admin/HistoryCustomer'
import ChiTietThongKe from '../ThongKe/ChiTietThongKe'


import { UpdateChamSoc } from '../../API/ChamSoc'

import { GetListStaff } from '../../API/Staffs'
import { HOST, HOST_SHEME } from '../../Config'
import { connect } from 'react-redux'
import { alert, success, setLoading } from "../../actions/App";
import _ from 'lodash'

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

const NoteCSKH = (props) => {

    let [data, setData] = useState({});
    let [isUpload, setUpload] = useState(false);
    let [note, setNote] = useState('');
    let [trangthai, setTrangThai] = useState(0);

    useEffect(() => {
        if (props.data) {
            setData(props.data);
            setNote(props.data.ghichu);
            setTrangThai(props.data.trangthai);
        } else {
            setData({});
        }
    }, [])

    const handleButtonUpdate = () => {
        if (isUpload == true || !data || !data.ma) {
            props.alert("Thao tác quá nhanh");
            return;
        }
        var dataUpdate = {
            ma: data.ma,
            ghichu: note,
            trangthai: trangthai
        }
        setUpload(true);
        UpdateChamSoc(props.token, dataUpdate, data.ma).then(Response => {
            setUpload(false);
            props.onCloseClick(true);
        }).catch(err => {
            setUpload(false);
            props.alert("Cập nhập thông in thất bại \n Error:" + err.response.data.error.message);
        });
    };

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
                        <Input readOnly width='auto' value={data.tenkh || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Số Điện Thoại
                        <Input readOnly width='auto' value={data.sodienthoai || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Hóa đơn
                        <Input readOnly width='auto' value={data.mahoadon || ''} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                        Trạng thái
                        <Select width='auto' value={trangthai || 0} onChange={(e) => setTrangThai(e.target.value)} >
                            <option value="0">{getTrangThai(0)}</option>
                            <option value="1">{getTrangThai(1)}</option>
                            <option value="2">{getTrangThai(2)}</option>
                            <option value="3">{getTrangThai(3)}</option>
                        </Select>
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ marginTop: 10, width: '100%' }}>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Ghi chú
                        <Textarea width='100%' value={note || ''} onChange={(e) => setNote(e.target.value)} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                    <Button width='150px' onClick={() => handleButtonUpdate()}>
                        {isUpload ? "" : "Cập nhật"}
                        {isUpload ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-edit"></i>}
                    </Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    )
}

const CSKH = (props) => {

    let [dateStart, setDateStart] = useState(moment().subtract(5, 'days').format("YYYY-MM-DD"));
    let [dateEnd, setDateEnd] = useState(moment().add(5, 'days').format("YYYY-MM-DD"));
    let [searchName, setSearchName] = useState("");
    let [mHistoryCalls, setHistoryCalls] = useState([]);
    let [mHistoryCallCurrents, setHistoryCallCurrents] = useState([]);
    let [isShowing, setShowing] = useState(false);
    let [isLoading, setLoading] = useState(false);
    let [isShowHistoryCustomer, setShowHistoryCustomer] = useState(false);
    let [maKHHistoryCustomer, setMaKHHistoryCustomer] = useState(null);
    let [isShowChitiet, setShowChitiet] = useState(false);
    let [isShowNote, setShowNote] = useState(false);
    let [dataCSKH, setDataCSKH] = useState("");

    let [listStaff, setListStaff] = useState([]);
    let [mMaHoaDon, setMaHoaDon] = useState("");
    let [loaihoadon, setLoaiHoaDon] = useState("");
    let [maxSizePage, setMaxSizePage] = useState(20);
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);
    let [activePage, setActive] = useState(0);


    useEffect(() => {
        setLoading(true)
        GetListStaff(props.token).then(res => {
            setListStaff(res.data);
            handleLayDanhSach();
        }).catch(err => {
            props.alert("Không lấy được danh sách nhân viên");
        })
    }, []);


    const handleLayDanhSach = () => {
        setLoading(true)
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        GetChamSocTheoNgay(props.token, start, end).then(res => {
            tachList(res.data, maxSizePage, activePage);
            setHistoryCallCurrents([...res.data]);
        }).catch(err => {
            props.alert("Có lỗi không thể lấy danh sách");
        }).finally(() => {
            setLoading(false);
        })
    }

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

    const handleChangeSoHang = (e) => {
        setMaxSizePage(parseInt(e));
        tachList(mHistoryCallCurrents, e, activePage);
    }

    const convertDirection = (tab) => {
        if (tab == 1) {
            return 'agent2user';
        }
        if (tab == 2) {
            return 'user2agent';
        }
        return '';
    }

    const tachList = (list, size, tab) => {
        if (tab != 0)
            list = list.filter(x => x && x.trangthai == (tab - 1));
        if (searchName != "") {
            list = list.filter(bill => searchName == ""
                || (bill && bill.tenkh && bill.tenkh.toLowerCase().includes(searchName.toLowerCase()))
                || (bill && bill.sodienthoai && bill.sodienthoai.toLowerCase().includes(searchName.toLowerCase()))
                || (bill && bill.biensoxe && bill.biensoxe.toLowerCase().includes(searchName.toLowerCase()))
            );
        }
        let tmp = _.chunk(list, size);
        setHistoryCalls(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleSearchName = () => {
        tachList(mHistoryCallCurrents, maxSizePage, activePage)
    }

    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchName();
        }
    }

    const setTab = (tab) => {
        if (mHistoryCallCurrents) {
            setActive(tab);
            tachList(mHistoryCallCurrents, maxSizePage, tab);
        }

    }

    const copyCallId = (callid) => {
        try {
            navigator.clipboard.writeText(callid);
        } catch (ex) {

        }
    }

    const goiKhachHang = (e) => {
        if (!e) {
            props.error('Không thể gọi');
            return;
        }
        let url = `microsip://callto:${e}`;
        window.open(
            url,
        );
    }


    return (
        <div>

            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                    <h3>Danh sách Khách Hàng.</h3>
                    <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                    <Input type="date" value={dateStart} style={{ marginLeft: 10 }} onChange={(e) => setDateStart(e.target.value)} />
                    <label style={{ marginLeft: 10 }}>Kết thúc</label>
                    <Input type="date" value={dateEnd} style={{ marginLeft: 10 }} onChange={(e) => setDateEnd(e.target.value)} />
                </DivFlexRow>
                <DivFlexRow>
                    <Button onClick={isLoading ? () => { } : handleLayDanhSach} style={{ marginLeft: 10 }}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Lấy danh sách"}
                    </Button>
                </DivFlexRow>

            </DivFlexRow>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>

            </DivFlexRow>
            <Tab>
                <button className={activePage === 0 ? "active" : ""} onClick={() => setTab(0)}>Tất cả</button>
                <button className={activePage === 1 ? "active" : ""} onClick={() => setTab(1)}>Chưa chăm sóc</button>
                <button className={activePage === 2 ? "active" : ""} onClick={() => setTab(2)}>Đang chăm sóc</button>
                <button className={activePage === 3 ? "active" : ""} onClick={() => setTab(3)}>Thành công</button>
                <button className={activePage === 4 ? "active" : ""} onClick={() => setTab(4)}>Thất bại</button>
            </Tab>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                    <label style={{ marginLeft: 10 }}>Search SDT,Tên,BSX: </label>
                    <Input type="text" onKeyPress={_handleKeyPress} value={searchName} style={{ marginLeft: 10 }} onChange={(e) => setSearchName(e.target.value)} />
                    <Button style={{ marginLeft: 10 }} onClick={handleSearchName}>Search </Button>
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 5, marginBottom: 10 }}>
                    <label>Số hàng </label>
                    <Select style={{ marginLeft: 10 }} width={100} value={maxSizePage} onChange={(e) => handleChangeSoHang(e.target.value)} >
                        <option value="20" >20</option>
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

            <Table style={{ marginTop: 15 }}>
                <thead>
                    <tr>
                        <th>Thời gian Hẹn</th>
                        <th>Tên KH</th>
                        <th>SDT /ZaloId</th>
                        <th>BSX</th>
                        <th>Hóa đơn</th>
                        <th style={{ width: 200 }}>Kiểm tra lần tới</th>
                        <th>Số lần gọi</th>
                        <th>Trạng thái</th>
                        <th style={{ width: 200 }}>Ghi Chú</th>
                        <th style={{ width: 120 }}>Xem | Gọi</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        mHistoryCalls[page] && mHistoryCalls[page].map((item, index) => (
                            <tr key={index}>
                                <td>{moment(item.ngayhen).format("DD/MM/YYYY")}</td>
                                <td>{item.tenkh}</td>
                                <td>
                                    {item.sodienthoai || item.zaloid}</td>
                                <td><a style={{
                                    borderBottom: "1px solid blue",
                                    color: "blue",
                                    cursor: "pointer"
                                }} onClick={() => {
                                    setMaKHHistoryCustomer(item.makh);
                                    setShowHistoryCustomer(true);
                                }}> {item.biensoxe}</a></td>
                                <td><a style={{
                                    borderBottom: "1px solid blue",
                                    color: "blue",
                                    cursor: "pointer"
                                }} onClick={() => {
                                    setShowChitiet(true);
                                    setMaHoaDon(item.mahoadon);
                                }}> {item.mahoadon}</a></td>
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
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100px'
                                    }}
                                >{item.ghichu || ''}</td>
                                <td>
                                    <Button onClick={() => {
                                        setDataCSKH(item);
                                        setShowNote(true);
                                    }} style={{ marginLeft: 5, height: 30, width: 30, display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} title="Xem chi tiết"><i className="fas fa-eye"></i></Button>
                                    <Button onClick={() => {

                                        props.confirm(`Bạn muốn gọi ${item.tenkh || ''} (${item.sodienthoai || item.zaloid || (item.direction == 'agent2user' ? item.tosip : item.fromsip)}) `, () => {
                                            goiKhachHang(item.sodienthoai || item.zaloid || (item.direction == 'agent2user' ? item.tosip : item.fromsip));
                                        })

                                    }} style={{ marginLeft: 5, height: 30, width: 30, display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} title="Gọi khách hàng"><i className="fas fa-phone"></i></Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button onClick={handlePrevPage}><i className="fas fa-angle-double-left"></i></Button>
                <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                    <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                </DivFlexRow>
                <Button style={{ marginLeft: 15 }} onClick={handleNextPage}><i className="fas fa-angle-double-right"></i></Button>
            </DivFlexRow>

            <HistoryCustomer isShowing={isShowHistoryCustomer} onCloseClick={() => {
                setShowHistoryCustomer(false)
                setMaKHHistoryCustomer(null);
            }
            } ma={maKHHistoryCustomer} />

            <ChiTietThongKe
                isShowing={isShowChitiet}
                onCloseClick={() => { setShowChitiet(false); setMaHoaDon("") }}
                mahoadon={mMaHoaDon}
                token={""}
                loaihoadon={0}
            />

            <NoteCSKH
                isShowing={isShowNote}
                onCloseClick={(upload) => {
                    setShowNote(false);
                    setDataCSKH("");
                    if (upload) {
                        handleLayDanhSach()
                    }
                }}
                data={dataCSKH}
                token={""}
                alert={props.alert}
            />
        </div>
    );
}

const mapState = (state) => ({
    token: state.Authenticate.token,
    isLoading: state.App.isLoading
})

const mapDispatch = (dispatch) => ({
    alert: (mess) => { dispatch(alert(mess)) },
    success: (mess) => { dispatch(success(mess)) },
    setLoading: (isLoad) => { dispatch(setLoading(isLoad)) }
})

export default connect(mapState, mapDispatch)(CSKH);