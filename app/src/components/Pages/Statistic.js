import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonDelete, ButtonEdit, ButtonShow, ButtonUpload, TabPage } from "../Styles";
import { DivFlexColumn, DivFlexRow, Input, Link } from "../../styles";
import lib from "../../lib";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";
import StatisticApi from "../../API/StatisticApi";
import BillLeApi from "../../API/BillLeApi";
import BillSuaChuaAPI from "../../API/BillSuaChuaAPI";
import InputLoaiKhachHang from "../Styles/InputLoaiKhachHang";
import InputTrangThaiBill from "../Styles/InputTrangThaiBill";

const twoDay = 2 * 1000 * 3600 * 24;

const Statistic = (props) => {
    const [tab, setTab] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [billes, setBilles] = useState([]);
    const mDateStart = lib.handleInputDate("YYYY-MM-DD");
    const mDateEnd = lib.handleInputDate("YYYY-MM-DD");
    const mTrangThaiBill = lib.handleInput(null);
    const useIsMounted = lib.useIsMounted();

    useEffect(() => {
        handleLayDanhSach();
    }, [mDateStart.value, mDateEnd.value, mTrangThaiBill.value]);

    const handleLayDanhSach = () => {
        setLoading(true);
        StatisticApi.getBillByDate(mDateStart.value, mDateEnd.value, mTrangThaiBill.value)
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

    const handleExportBillForTax = () => {
        StatisticApi.exportBillForTax(mDateStart.value, mDateEnd.value);
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
        if (item.loaihoadon === 1) {
            props.confirm(`Bạn muốn sửa hoá đơn ${item.mahoadon}?`, () => {
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

    const getTrangThaiBill = (item) => {
        switch (item.trangthai) {
            case 0:
                return <span style={{ color: "orange" }}>Chưa thanh toán</span>;
            case 1:
                return utils.formatNgayGio(item.ngaythanhtoan);
            case 2:
                return (
                    <DivFlexColumn>
                        <span style={{ color: "red" }}>Đã hủy</span>
                        {item.lydo && <span style={{ color: "red" }}>({item.lydo})</span>}
                    </DivFlexColumn>
                );
            default:
                return "--";
        }
    };

    return (
        <React.Fragment>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>Danh sách bill.</h3>
                    <DivFlexColumn>
                        <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                        <Input type="date" style={{ marginLeft: 10 }} {...mDateStart} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        <label style={{ marginLeft: 10 }}>Kết thúc</label>
                        <Input type="date" style={{ marginLeft: 10 }} {...mDateEnd} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        <label>Trạng thái: </label>
                        <InputTrangThaiBill {...mTrangThaiBill} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow>
                    <ButtonUpload isUpload={isLoading} onClick={handleExportEmployee}>
                        Xuất khách hàng
                    </ButtonUpload>
                    <ButtonUpload isUpload={isLoading} onClick={handleExportBill} style={{ marginLeft: 10 }}>
                        Export
                    </ButtonUpload>
                    <ButtonUpload isUpload={isLoading} onClick={handleExportBillForTax} style={{ marginLeft: 10 }}>
                        Export Bán lẻ
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
                <TabPage.Tab title="Sửa chữa" />
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
                    <th>Ngày tạo</th>
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
                                <td>{utils.formatNgayGio(item.ngayban)}</td>
                                <td>{getTrangThaiBill(item)}</td>
                                <td>{item.loaihoadon === 0 ? "Sửa chữa" : "Bán lẻ"}</td>
                                <td>
                                    <ButtonShow isUpload={isLoading} onClick={() => handleShowBill(item)} />
                                    <If condition={!item.ngaythanhtoan || moment().valueOf() - moment(item.ngaythanhtoan).valueOf() <= twoDay}>
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
