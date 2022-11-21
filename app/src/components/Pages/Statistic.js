import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonDelete, ButtonEdit, ButtonShow, ButtonUpload, TabPage } from "../Styles";
import { DivFlexRow, Input, Link } from "../../styles";
import lib from "../../lib";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";
import StatisticApi from "../../API/StatisticApi";
import BillLeApi from "../../API/BillLeApi";
import BillSuaChuaAPI from "../../API/BillSuaChuaAPI";

const twoDay = 2 * 1000 * 3600 * 24;

const Statistic = (props) => {
    const [tab, setTab] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [billes, setBilles] = useState([]);
    const mDateStart = lib.handleInputDate("YYYY-MM-DD");
    const mDateEnd = lib.handleInputDate("YYYY-MM-DD");
    const useIsMounted = lib.useIsMounted();

    useEffect(() => {
        handleLayDanhSach();
    }, []);

    const handleLayDanhSach = () => {
        setLoading(true);
        StatisticApi.getBillByDate(mDateStart.value, mDateEnd.value)
            .then((data) => {
                if (!useIsMounted()) return;
                setBilles([...data]);
            })
            .catch((err) => {
                props.alert("Có lỗi không thể lấy danh sách");
            })
            .finally(() => {
                if (!useIsMounted()) return;
                setLoading(false);
            });
    };

    const handleExportBill = () => {
        StatisticApi.exportBill(mDateStart.value, mDateEnd.value);
    };

    const handleExportThongKe = () => {
        StatisticApi.exportThongKe(mDateStart.value, mDateEnd.value);
    };

    const handleExportEmployee = () => {
        StatisticApi.exportBillEmployee(mDateStart.value, mDateEnd.value);
    };

    const HuyHoaDon = (mhd, loaiHD) => {
        if (loaiHD == 0) {
            return BillSuaChuaAPI.delete(mhd);
        } else if (loaiHD == 1) {
            return BillLeApi.delete(mhd);
        }

        return Promise.resolve();
    };

    const handleViewBill = (item) => {
        props.openModal(POPUP_NAME.POPUP_BILL, item);
    };
    const handleViewCustomer = (item) => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_HISTORY, { ma: item.makh });
    };

    const handleShowBill = (item) => {
        let url = "";
        if (item.loaihoadon == 0) {
            url = `/showrepaired?mahoadon=${item.mahoadon}`;
        } else {
            url = `/showretail?mahoadon=${item.mahoadon}`;
        }
        if (url) {
            props.history.push(url);
        }
    };

    const handleEditItem = (item) => {
        if (item.loaihoadon == 1) {
            props.confirm("Xác nhận", () => {
                props.history.push(`/updateretail?mahoadon=${item.mahoadon}`);
            });
            return;
        }
        props.openModal(POPUP_NAME.POPUP_COMFIRM_BILL, item);
    };

    const handleDeleteItem = (item) => {
        props.confirmError("Bạn muốn hủy hóa đơn " + item.mahoadon, 2, () => {
            HuyHoaDon(item.mahoadon, item.loaihoadon)
                .then(() => {
                    props.alert("Hủy hóa đơn " + item.mahoadon + " đã thành công: ");
                })
                .catch(() => {
                    props.alert("Lỗi hủy hóa đơn " + item.mahoadon);
                })
                .finally(() => {
                    handleLayDanhSach();
                });
        });
    };

    return (
        <React.Fragment>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <h3>Danh sách bill.</h3>
                    <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                    <Input type="date" style={{ marginLeft: 10 }} {...mDateStart} />
                    <label style={{ marginLeft: 10 }}>Kết thúc</label>
                    <Input type="date" style={{ marginLeft: 10 }} {...mDateEnd} />
                </DivFlexRow>
                <DivFlexRow>
                    <ButtonUpload isUpload={isLoading} onClick={handleExportEmployee}>
                        Xuất khách hàng
                    </ButtonUpload>
                    <ButtonUpload isUpload={isLoading} onClick={handleExportBill} style={{ marginLeft: 10 }}>
                        Export
                    </ButtonUpload>
                    <ButtonUpload isUpload={isLoading} onClick={handleExportThongKe} style={{ marginLeft: 10 }}>
                        Export Thống kê
                    </ButtonUpload>
                    <ButtonUpload isUpload={isLoading} onClick={handleLayDanhSach} style={{ marginLeft: 10 }}>
                        Lấy danh sách
                    </ButtonUpload>
                </DivFlexRow>
            </DivFlexRow>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}></DivFlexRow>
            <TabPage onChange={setTab}>
                <TabPage.Tab title="Tất cả" />
                <TabPage.Tab title="Sữa chữa" />
                <TabPage.Tab title="Bán lẻ" />
            </TabPage>

            <DataTable
                title="Danh sách hóa đơn"
                data={billes.filter((x) => tab == 0 || x.loaihoadon == tab - 1)}
                searchData={(search, bill) => utils.searchName(bill.biensoxe, search) || utils.searchName(bill.mahoadon, search)}
            >
                <DataTable.Header>
                    <th>Mã hóa đơn</th>
                    <th>Mã KH</th>
                    <th>Tên KH</th>
                    <th>Biển số xe</th>
                    <th>Tổng tiền</th>
                    <th>Ngày thanh toán</th>
                    <th>Loại hóa đơn</th>
                    <th>Xem | Cập nhập | Xóa</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index} style={{ backgroundColor: item.lydo ? "#ff0000" : "#ffffff" }}>
                                <td>
                                    <Link onClick={() => handleViewBill(item)}>{item.mahoadon}</Link>
                                </td>
                                <td>
                                    <Link onClick={() => handleViewCustomer(item)}>{item.makh}</Link>
                                </td>
                                <td>{item.tenkh}</td>
                                <td>{item.biensoxe}</td>
                                <td>{utils.formatVND(item.tongtien)}</td>
                                <td>{utils.formatNgayGio(item.ngaythanhtoan)}</td>
                                <td>{item.loaihoadon === 0 ? "Sửa chữa" : "Bán lẻ"}</td>
                                <td>
                                    <ButtonShow isUpload={isLoading} onClick={() => handleShowBill(item)} />
                                    <If condition={moment().valueOf() - moment(item.ngaythanhtoan).valueOf() <= twoDay}>
                                        <ButtonEdit style={{ marginLeft: 5 }} isUpload={isLoading} onClick={() => handleEditItem(item)} />
                                        <ButtonDelete style={{ marginLeft: 5 }} isUpload={isLoading} onClick={() => handleDeleteItem(item)} />
                                    </If>
                                </td>
                            </tr>
                        );
                    }}
                ></DataTable.Body>
            </DataTable>
        </React.Fragment>
    );
};

export default withRouter(connect(null, null)(Statistic));
