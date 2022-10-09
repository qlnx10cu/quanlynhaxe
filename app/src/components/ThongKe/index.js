import React, { useState, useEffect } from "react";
import { DivFlexRow, Button, Input, Table, DelButton, Modal, ModalContent, CloseButton, Select, Tab, Link } from "../../styles";
import moment from "moment";
import { GetBillTheoNgay } from "../../API/ThongKeAPI";
import ChiTietThongKe from "./ChiTietThongKe";
import HistoryCustomer from "../Admin/HistoryCustomer";
import { GetListStaff } from "../../API/Staffs";
import { HuyThanhToan, HuyThanhToanLe, CheckUpdateBill } from "../../API/Bill";
import { HOST, HOST_SHEME } from "../../Config";
import { connect } from "react-redux";
import { alert, success, setLoading, error, confirm } from "../../actions/App";
import { withRouter } from "react-router-dom";
import _ from "lodash";

const oneDay = 1000 * 3600 * 24;

const ConfirmHoaDon = (props) => {
    let [maBarcode, setMaBarcode] = useState("");

    const UpdateHoaDon = (maHoaDon, loai) => {
        var date = new Date();
        let url = "";
        if (loai == 0) {
            url = `/services/updatebill?mahoadon=${maHoaDon}`;
        }
        if (loai == 1) {
            url = `/banle?mahoadon=${maHoaDon}`;
        }
        props.history.push(url, { tokenTime: date.getTime(), mhdToken: maHoaDon });
    };

    const confirmBarCodeByServer = () => {
        if (!maBarcode) {
            props.alert("vui lòng nhập mã code");
            return;
        }

        CheckUpdateBill(props.token, { ma: maBarcode, mahoadon: props.mahoadon })
            .then((res) => {
                if (res && res.data && res.data.error && res.data.error >= 1) {
                    setMaBarcode("");
                    UpdateHoaDon(props.mahoadon, props.loaihoadon);
                    props.onCloseClick();
                } else {
                    props.alert("Mã code không đúng, vui lòng nhập lại");
                }
            })
            .catch((err) => {
                props.alert("Lỗi : " + err.message);
            });
    };

    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            confirmBarCodeByServer();
        }
    };
    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent style={{ width: "90%" }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton
                        onClick={() => {
                            setMaBarcode("");
                            props.onCloseClick();
                        }}
                    >
                        &times;
                    </CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: "center" }}>HEAD TRUNG TRANG</h3>
                <h4 style={{ textAlign: "center" }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
                <h5 style={{ textAlign: "center" }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
                <DivFlexRow style={{ alignItems: "center", textAlign: "center" }}>
                    <label>Nhập barcode: </label>
                    <Input
                        type="password"
                        autocomplete="off"
                        value={maBarcode}
                        onKeyPress={_handleKeyPress}
                        style={{ marginLeft: 10 }}
                        onChange={(e) => setMaBarcode(e.target.value)}
                    />
                    <Button
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                            confirmBarCodeByServer();
                        }}
                    >
                        Thay đổi
                    </Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};

const ThongKe = (props) => {
    // let [dateStart, setDateStart] = useState(moment().subtract(45, 'day').format("YYYY-MM-DD"));
    let [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
    let [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));
    let [searchBSX, setSearchBSX] = useState("");
    let [mBills, setBills] = useState([]);
    let [mBillCurrents, setBillCurrents] = useState([]);
    let [isShowing, setShowing] = useState(false);
    let [isShowingConfirm, setShowingConfirm] = useState(false);
    let [isShowHistoryCustomer, setShowHistoryCustomer] = useState(false);
    let [maKHHistoryCustomer, setMaKHHistoryCustomer] = useState(null);

    let [mMaHoaDon, setMaHoaDon] = useState("");
    let [loaihoadon, setLoaiHoaDon] = useState("");
    let [isLoading, setLoading] = useState(false);
    let [listStaff, setListStaff] = useState([]);
    let [maxSizePage, setMaxSizePage] = useState(20);
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);
    let [activePage, setActive] = useState(0);

    useEffect(() => {
        setLoading(true);
        GetListStaff(props.token)
            .then((res) => {
                setListStaff(res.data);
                handleLayDanhSach();
            })
            .catch((err) => {
                props.alert("Không lấy được danh sách nhân viên");
            });
    }, []);

    const HuyHoaDon = (mMaHoaDon, loaiHD, cb) => {
        if (loaiHD == 0) {
            HuyThanhToan(props.token, mMaHoaDon)
                .then((res) => {
                    props.alert("Hủy hóa đơn " + mMaHoaDon + " đã thành công: ");
                    if (cb) {
                        cb();
                    }
                })
                .catch((err) => {
                    props.alert("Lỗi hủy hóa đơn " + mMaHoaDon);
                    if (cb) {
                        cb();
                    }
                });
        }
        if (loaiHD == 1) {
            HuyThanhToanLe(props.token, mMaHoaDon)
                .then((res) => {
                    props.alert("Hủy hóa đơn " + mMaHoaDon + " đã thành công: ");
                    if (cb) {
                        cb();
                    }
                })
                .catch((err) => {
                    props.alert("Lỗi hủy hóa đơn " + mMaHoaDon);
                    if (cb) {
                        cb();
                    }
                });
        }
    };

    const handleLayDanhSach = () => {
        setLoading(true);
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        GetBillTheoNgay(props.token, start, end)
            .then((res) => {
                tachList(res.data, maxSizePage, activePage);
                setBillCurrents([...res.data]);
            })
            .catch((err) => {
                props.alert("Có lỗi không thể lấy danh sách");
            })
            .finally(() => {
                setLoading(false);
            });
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

    const handleChangeSoHang = (e) => {
        setMaxSizePage(parseInt(e));
        tachList(mBillCurrents, e, activePage);
    };

    const tachList = (list, size, tab) => {
        if (tab != 0) list = list.filter((x) => x && x.loaihoadon == tab - 1);
        if (searchBSX != "") {
            list = list.filter(
                (bill) =>
                    searchBSX == "" ||
                    (bill && bill.biensoxe && bill.biensoxe.toLowerCase().includes(searchBSX.toLowerCase())) ||
                    (bill && bill.mahoadon && bill.mahoadon.toLowerCase().includes(searchBSX.toLowerCase()))
            );
        }
        let tmp = _.chunk(list, size);
        setBills(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleExport = () => {
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        let url = `${HOST}/statistic/bill/export?start=${start}&end=${end}&trangthai=1`;
        window.open(
            url,
            "_blank" // <- This is what makes it open in a new window.
        );
    };
    const handleExportThongKe = () => {
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        window.open(`${HOST_SHEME}/exportthongke?start=${start}&end=${end}`, "_blank");
    };

    const handleExportEmployee = () => {
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        let url = `${HOST}/statistic/bill/employee/export?start=${start}&end=${end}&trangthai=1`;
        window.open(
            url,
            "_blank" // <- This is what makes it open in a new window.
        );
    };

    const handleSearchBienSoXe = () => {
        tachList(mBillCurrents, maxSizePage, activePage);
    };

    const _handleKeyPressBSX = (e) => {
        if (e.key === "Enter") {
            handleSearchBienSoXe();
        }
    };

    const showInfoHoaDon = (mhd, loai) => {
        let url = "";
        if (loai == 0) {
            url = `/services/showbill?mahoadon=${mhd}`;
        } else {
            url = `/banle/showbill?mahoadon=${mhd}`;
        }
        if (url) {
            props.history.push(url);
        }
    };

    const setTab = (tab) => {
        if (mBillCurrents) {
            setActive(tab);
            tachList(mBillCurrents, maxSizePage, tab);
        }
    };

    return (
        <div>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <h3>Danh sách bill.</h3>
                    <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                    <Input type="date" value={dateStart} style={{ marginLeft: 10 }} onChange={(e) => setDateStart(e.target.value)} />
                    <label style={{ marginLeft: 10 }}>Kết thúc</label>
                    <Input type="date" value={dateEnd} style={{ marginLeft: 10 }} onChange={(e) => setDateEnd(e.target.value)} />
                </DivFlexRow>
                <DivFlexRow>
                    <Button onClick={isLoading ? () => {} : handleExportEmployee}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Xuất khách hàng"}
                    </Button>
                    <Button onClick={isLoading ? () => {} : handleExport} style={{ marginLeft: 10 }}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Export"}
                    </Button>
                    <Button onClick={isLoading ? () => {} : handleExportThongKe} style={{ marginLeft: 10 }}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Export Thống kê"}
                    </Button>
                    <Button onClick={isLoading ? () => {} : handleLayDanhSach} style={{ marginLeft: 10 }}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Lấy danh sách"}
                    </Button>
                </DivFlexRow>
            </DivFlexRow>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}></DivFlexRow>
            <Tab>
                <button className={activePage === 0 ? "active" : ""} onClick={() => setTab(0)}>
                    Tất cả
                </button>
                <button className={activePage === 1 ? "active" : ""} onClick={() => setTab(1)}>
                    Sữa chữa
                </button>
                <button className={activePage === 2 ? "active" : ""} onClick={() => setTab(2)}>
                    Bán lẻ
                </button>
            </Tab>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <label style={{ marginLeft: 10 }}>Search MHD,BSX: </label>
                    <Input
                        type="text"
                        onKeyPress={_handleKeyPressBSX}
                        value={searchBSX}
                        style={{ marginLeft: 10 }}
                        onChange={(e) => setSearchBSX(e.target.value)}
                    />
                    <Button style={{ marginLeft: 10 }} onClick={handleSearchBienSoXe}>
                        Search{" "}
                    </Button>
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: " center", justifyContent: "flex-end", marginTop: 5, marginBottom: 10 }}>
                    <label>Số hàng </label>
                    <Select style={{ marginLeft: 10 }} width={100} value={maxSizePage} onChange={(e) => handleChangeSoHang(e.target.value)}>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                        <option value="500">500</option>
                        <option value="1000">1000</option>
                        <option value="2000">2000</option>
                    </Select>
                    <Button style={{ marginLeft: 35 }} onClick={handlePrevPage}>
                        <i className="fas fa-angle-double-left"></i>
                    </Button>
                    <DivFlexRow style={{ alignItems: "center", justifyContent: "space-between", marginLeft: 10 }}>
                        <div>
                            {" "}
                            {page + 1}/{maxPage > 1 ? maxPage : 1}
                        </div>
                    </DivFlexRow>
                    <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                        <i className="fas fa-angle-double-right"></i>
                    </Button>
                </DivFlexRow>
            </DivFlexRow>

            <Table style={{ marginTop: 15 }}>
                <tbody>
                    <tr>
                        <th>Mã hóa đơn</th>
                        <th>Mã KH</th>
                        <th>Tên KH</th>
                        <th>Biển số xe</th>
                        <th>Tổng tiền</th>
                        <th>Ngày thanh toán</th>
                        <th>Loại hóa đơn</th>
                        <th>
                            <i className="fas fa-info"></i>
                        </th>
                    </tr>

                    {mBills[page] &&
                        mBills[page].map((item, index) => (
                            <tr key={index} style={{ backgroundColor: item.lydo ? "#ff0000" : "#ffffff" }}>
                                <td>
                                    <Link
                                        onClick={() => {
                                            setMaHoaDon(item.mahoadon);
                                            setShowing(true);
                                            setLoaiHoaDon(item.loaihoadon);
                                        }}
                                    >
                                        {item.mahoadon}
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        onClick={() => {
                                            setMaKHHistoryCustomer(item.makh);
                                            setShowHistoryCustomer(true);
                                        }}
                                    >
                                        {item.makh}
                                    </Link>
                                </td>
                                <td>{item.tenkh}</td>
                                <td>{item.biensoxe}</td>
                                <td>{item.tongtien.toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                                <td>{moment(item.ngaythanhtoan).format("hh:mm DD/MM/YYYY")}</td>
                                <td>{item.loaihoadon === 0 ? "Sửa chữa" : "Bán lẻ"}</td>
                                {moment().valueOf() - moment(item.ngaythanhtoan).valueOf() <= oneDay ? (
                                    <td>
                                        <Button
                                            style={{ marginLeft: 15 }}
                                            onClick={() => {
                                                showInfoHoaDon(item.mahoadon, item.loaihoadon);
                                            }}
                                        >
                                            Show
                                        </Button>
                                        <Button
                                            style={{ marginLeft: 15 }}
                                            onClick={() => {
                                                setMaHoaDon(item.mahoadon);
                                                setShowingConfirm(true);
                                                setLoaiHoaDon(item.loaihoadon);
                                            }}
                                        >
                                            Thay đổi
                                        </Button>

                                        <DelButton
                                            style={{ marginLeft: 15 }}
                                            onClick={() => {
                                                props.confirmError("Bạn muốn hủy hóa đơn " + item.mahoadon, 2, () => {
                                                    HuyHoaDon(item.mahoadon, item.loaihoadon, () => {
                                                        handleLayDanhSach();
                                                    });
                                                });
                                            }}
                                        >
                                            {" "}
                                            Hủy
                                        </DelButton>
                                    </td>
                                ) : (
                                    <td>
                                        <Button
                                            style={{ marginLeft: 15 }}
                                            onClick={() => {
                                                showInfoHoaDon(item.mahoadon, item.loaihoadon);
                                            }}
                                        >
                                            Show
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                </tbody>
            </Table>
            <DivFlexRow style={{ alignItems: " center", justifyContent: "flex-end", marginTop: 15 }}>
                <Button onClick={handlePrevPage}>
                    <i className="fas fa-angle-double-left"></i>
                </Button>
                <DivFlexRow style={{ alignItems: "center", justifyContent: "space-between", marginLeft: 10 }}>
                    <div>
                        {" "}
                        {page + 1}/{maxPage > 1 ? maxPage : 1}
                    </div>
                </DivFlexRow>
                <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                    <i className="fas fa-angle-double-right"></i>
                </Button>
            </DivFlexRow>
            <ConfirmHoaDon
                history={props.history}
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

            <HistoryCustomer
                alert={props.alert}
                error={props.error}
                confirm={props.confirm}
                isShowing={isShowHistoryCustomer}
                onCloseClick={() => {
                    setShowHistoryCustomer(false);
                    setMaKHHistoryCustomer(null);
                }}
                ma={maKHHistoryCustomer}
            />
        </div>
    );
};

const mapState = (state) => ({
    token: state.Authenticate.token,
    isLoading: state.App.isLoading,
});

const mapDispatch = (dispatch) => ({
    alert: (mess) => {
        dispatch(alert(mess));
    },
    success: (mess) => {
        dispatch(success(mess));
    },
    error: (mess) => {
        dispatch(error(mess));
    },
    confirm: (mess, callback) => {
        dispatch(confirm(mess, callback));
    },
    setLoading: (isLoad) => {
        dispatch(setLoading(isLoad));
    },
});

export default withRouter(connect(mapState, mapDispatch)(ThongKe));
