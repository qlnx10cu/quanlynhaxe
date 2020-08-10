import React, { useState } from 'react';
import { DivFlexRow, Button, Input, Table, DelButton, Modal, ModalContent, CloseButton } from '../../styles'
import moment from 'moment'
import { GetBillTheoNgay } from "../../API/ThongKeAPI"
import ChiTietThongKe from './ChiTietThongKe'
import { GetListStaff } from '../../API/Staffs'
import { HuyThanhToan, HuyThanhToanLe, CheckUpdateBill } from '../../API/Bill'
import { HOST } from '../../Config'
import { connect } from 'react-redux'
import { alert, setLoading } from "../../actions/App";


const oneDay = 1000 * 3600 * 24;

const ConfirmHoaDon = (props) => {
    let [maBarcode, setMaBarcode] = useState("");

    const UpdateHoaDon = (maHoaDon, loai) => {
        var date = new Date();
        if (loai == 0) {
            let url = `/services/repairedbill/updatebill?mahoadon=${maHoaDon}&token=${date.getTime()}`;
            window.open(
                url,
                '_blank' // <- This is what makes it open in a new window.
            );
        }
        if (loai == 1) {
            let url = `/banle?mahoadon=${maHoaDon}&token=${date.getTime()}`;
            window.open(
                url,
                '_blank' // <- This is what makes it open in a new window.
            );
        }
    }

    const confirmBarCodeByServer = () => {
        if (!maBarcode) {
            props.alert("vui lòng nhập mã code");
            return;
        }

        CheckUpdateBill(props.token, { ma: maBarcode, mahoadon: props.mahoadon }).then(res => {
            if (res && res.data && res.data.error && res.data.error >= 1) {
                UpdateHoaDon(props.mahoadon, props.loaihoadon)
                setMaBarcode("")
                props.onCloseClick();
            } else {
                props.alert("Mã code không đúng, vui lòng nhập lại")
            }
        }).catch(err => {
            props.alert("Lỗi : " + err.message)
        })
    }

    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            confirmBarCodeByServer();
        }
    };
    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent style={{ width: '90%' }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => props.onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: 'center' }}>HEAD TRUNG TRANG</h3>
                <h4 style={{ textAlign: 'center' }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
                <h5 style={{ textAlign: 'center' }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
                <DivFlexRow style={{ alignItems: 'center', textAlign: 'center' }}>
                    <label>Nhập barcode: </label>
                    <Input type="password" autocomplete="off" value={maBarcode} onKeyPress={_handleKeyPress} style={{ marginLeft: 10 }} onChange={(e) => setMaBarcode(e.target.value)} />
                    <Button style={{ marginLeft: 10 }} onClick={() => {
                        confirmBarCodeByServer();
                    }}>Thay đổi</Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>


    );
}



const ThongKe = (props) => {

    let [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
    let [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));
    let [searchBSX, setSearchBSX] = useState("");
    let [mBills, setBills] = useState([]);
    let [mBillCurrents, setBillCurrents] = useState([]);
    let [isShowing, setShowing] = useState(false);
    let [isShowingConfirm, setShowingConfirm] = useState(false);


    let [mMaHoaDon, setMaHoaDon] = useState("");
    let [loaihoadon, setLoaiHoaDon] = useState("");
    let [isLoading, setLoading] = useState(false);
    let [listStaff, setListStaff] = useState([]);

    const CallApiGetListStaff = () => {
        GetListStaff(props.token).then(res => {
            setListStaff(res.data);
        }).catch(err => {
            props.alert("Không lấy được danh sách nhân viên");
        })
    }
    const HuyHoaDon = (mMaHoaDon, loaiHD) => {
        if (loaiHD == 0) {
            HuyThanhToan(props.token, mMaHoaDon).then(res => {
                props.alert('Hủy hóa đơn '+mMaHoaDon +' đã thành công: ');
            }).catch(err => {
                props.alert("Lỗi hủy hóa đơn "+mMaHoaDon )
            })
        }
        if (loaiHD == 1) {
            HuyThanhToanLe(props.token, mMaHoaDon).then(res => {
                props.alert('Hủy hóa đơn '+mMaHoaDon +' đã thành công: ');
            }).catch(err => {
                props.alert("Lỗi hủy hóa đơn "+mMaHoaDon)
            })
        }
    }

    const handleLayDanhSach = () => {
        setLoading(true)
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        GetBillTheoNgay(props.token, start, end).then(res => {
            setBills(res.data);
            setBillCurrents([...res.data]);
            CallApiGetListStaff();
        })
            .catch(err => {
                props.alert("Có lỗi không thể lấy danh sách");
            }).finally(() => {
                setLoading(false);
            })
    }


    const handleExport = () => {
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        let url = `${HOST}/statistic/bill/export?start=${start}&end=${end}&trangthai=1`;
        window.open(
            url,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    const handleExportEmployee = () => {
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        let url = `${HOST}/statistic/bill/employee/export?start=${start}&end=${end}&trangthai=1`;
        window.open(
            url,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    const handleSearchBienSoXe = () => {
        if (mBillCurrents) {
            const result = mBillCurrents.filter(bill => searchBSX == "" || bill && bill.biensoxe && bill.biensoxe.toLowerCase().includes(searchBSX.toLowerCase()));
            setBills(result)
        }
    }

    const _handleKeyPressBSX = (e) => {
        if (e.key === 'Enter') {
            handleSearchBienSoXe();
        }
    }
    return (
        <div>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                    <h3>Danh sách bill.</h3>
                    <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                    <Input type="date" value={dateStart} style={{ marginLeft: 10 }} onChange={(e) => setDateStart(e.target.value)} />
                    <label style={{ marginLeft: 10 }}>Kết thúc</label>
                    <Input type="date" value={dateEnd} style={{ marginLeft: 10 }} onChange={(e) => setDateEnd(e.target.value)} />
                </DivFlexRow>
                <DivFlexRow>
                    <Button onClick={isLoading ? () => { } : handleExportEmployee}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Xuất khách hàng"}
                    </Button>
                    <Button onClick={isLoading ? () => { } : handleExport} style={{ marginLeft: 10 }}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Export"}
                    </Button>
                    <Button onClick={isLoading ? () => { } : handleLayDanhSach} style={{ marginLeft: 10 }}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Lấy danh sách"}
                    </Button>
                </DivFlexRow>

            </DivFlexRow>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                    <label style={{ marginLeft: 10 }}>Biển số xe </label>
                    <Input type="text" onKeyPress={_handleKeyPressBSX} value={searchBSX} style={{ marginLeft: 10 }} onChange={(e) => setSearchBSX(e.target.value)} />
                    <Button style={{ marginLeft: 10 }} onClick={handleSearchBienSoXe}>Search </Button>
                </DivFlexRow>
            </DivFlexRow>

            <Table style={{ marginTop: 15 }}>
                <tbody>
                    <tr>
                        <th>Mã hóa đơn</th>
                        <th>Biển số xe</th>
                        <th>Tổng tiền</th>
                        <th>Ngày thanh toán</th>
                        <th>Loại hóa đơn</th>
                        <th><i className="fas fa-info"></i></th>
                        <th><i className="fas fa-info"></i></th>
                    </tr>

                    {
                        mBills && mBills.map((item, index) => (
                            <tr key={index}>
                                <td>{item.mahoadon}</td>
                                <td>{item.biensoxe}</td>
                                <td>{item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                                <td>{moment(item.ngaythanhtoan).format("hh:mm DD/MM/YYYY")}</td>
                                <td>{item.loaihoadon === 0 ? "Sửa chữa" : "Bán lẻ"}</td>
                                <td>
                                    <Button onClick={() => {
                                        setMaHoaDon(item.mahoadon)
                                        setShowing(true);
                                        setLoaiHoaDon(item.loaihoadon);
                                    }}>Chi tiết</Button>
                                </td>

                                {
                                    (moment().valueOf() - moment(item.ngaythanhtoan).valueOf()) <= oneDay ?
                                        <td>
                                            <Button style={{ marginLeft: 15 }} onClick={() => {
                                                setMaHoaDon(item.mahoadon)
                                                setShowingConfirm(true);
                                                setLoaiHoaDon(item.loaihoadon);
                                            }}>Thay đổi</Button>

                                            <DelButton style={{ marginLeft: 15 }} onClick={() => {
                                                if (window.confirm("Bạn chắc muốn hủy") == true) { HuyHoaDon(item.mahoadon, item.loaihoadon); handleLayDanhSach() }
                                            }}> Hủy</DelButton>
                                        </td>
                                        :
                                        <td></td>
                                }

                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <ConfirmHoaDon
                isShowing={isShowingConfirm}
                onCloseClick={() => setShowingConfirm(false)}
                mahoadon={mMaHoaDon}
                token={props.token}
                alert={(mess) => props.alert(mess)}
                loaihoadon={loaihoadon}
            />

            <ChiTietThongKe
                isShowing={isShowing}
                onCloseClick={() => setShowing(false)}
                mahoadon={mMaHoaDon}
                token={props.token}
                loaihoadon={loaihoadon}
                listStaff={listStaff}
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
    setLoading: (isLoad) => { dispatch(setLoading(isLoad)) }
})

export default connect(mapState, mapDispatch)(ThongKe);