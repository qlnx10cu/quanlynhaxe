import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { ButtonCall, ButtonChatZalo, ButtonEdit, ButtonUpload, ButtonView, LabelOverflow, TabPage } from "../Styles";
import { DivFlexRow, Input, Link } from "../../styles";
import { POPUP_NAME } from "../../actions/Modal";
import utils from "../../lib/utils";
import lib from "../../lib";
import DataTable from "../Warrper/DataTable";
import CustomerCareApi from "../../API/CustomerCareApi";

const CustomerCare = (props) => {
    const [tab, setTab] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [customerCares, setCustomerCares] = useState([]);
    const mDateStart = lib.handleInputDate("YYYY-MM-DD", moment().subtract(5, "days").format("YYYY-MM-DD"));
    const mDateEnd = lib.handleInputDate("YYYY-MM-DD", moment().add(5, "days").format("YYYY-MM-DD"));

    useEffect(() => {
        handleLayDanhSach();
    }, []);

    const handleLayDanhSach = () => {
        setLoading(true);
        CustomerCareApi.getListByDate(mDateStart.value, mDateEnd.value)
            .then((data) => {
                setCustomerCares(data);
            })
            .catch(() => {
                props.alert("Có lỗi không thể lấy danh sách");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleViewCustomer = (item) => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_HISTORY, { ma: item.makh });
    };

    const handleViewBill = (item) => {
        props.openModal(POPUP_NAME.POPUP_BILL, { mahoadon: item.mahoadon, loaihoadon: 0 });
    };

    const handleEditNote = (item) => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_CARE_NOTE, item, () => {
            handleLayDanhSach();
        });
    };

    return (
        <React.Fragment>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <h3>Danh sách khách hàng.</h3>
                    <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                    <Input type="date" style={{ marginLeft: 10 }} {...mDateStart} />
                    <label style={{ marginLeft: 10 }}>Kết thúc</label>
                    <Input type="date" style={{ marginLeft: 10 }} {...mDateEnd} />
                </DivFlexRow>
                <DivFlexRow>
                    <ButtonUpload isUpload={isLoading} onClick={handleLayDanhSach} style={{ marginLeft: 10 }}>
                        Lấy danh sách
                    </ButtonUpload>
                </DivFlexRow>
            </DivFlexRow>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}></DivFlexRow>
            <TabPage onChange={setTab}>
                <TabPage.Tab title="Tất cả" />
                <TabPage.Tab title="Chưa chăm sóc" />
                <TabPage.Tab title="Đang chăm sóc" />
                <TabPage.Tab title="Thành công" />
                <TabPage.Tab title="Thất bại" />
            </TabPage>
            <DataTable
                isLoading={isLoading}
                data={customerCares.filter((x) => tab == 0 || x.trangthai == tab - 1)}
                searchData={(search, customerCare) =>
                    utils.searchName(customerCare.tenkh, search) ||
                    utils.searchName(customerCare.sodienthoai, search) ||
                    utils.searchName(customerCare.biensoxe, search)
                }
            >
                <DataTable.Header>
                    <th>Mgày Hẹn</th>
                    <th>Mã KH</th>
                    <th>Tên KH</th>
                    <th>SDT /ZaloId</th>
                    <th>BSX</th>
                    <th>Hóa đơn</th>
                    <th style={{ width: 200 }}>Kiểm tra lần tới</th>
                    <th>Số lần gọi</th>
                    <th>Trạng thái</th>
                    <th style={{ width: 200 }}>Ghi Chú</th>
                    <th style={{ width: 120 }}>Cập nhập | Chat | Gọi</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index}>
                                <td>{moment(item.ngayhen).format("DD/MM/YYYY")}</td>
                                <td>
                                    <Link onClick={() => handleViewCustomer(item)}> {item.makh}</Link>
                                </td>
                                <td>{item.tenkh}</td>
                                <td>{item.sodienthoai || item.zaloid}</td>
                                <td>{item.biensoxe}</td>
                                <td>
                                    <Link onClick={() => handleViewBill(item)}>{item.mahoadon}</Link>
                                </td>
                                <td>
                                    <LabelOverflow text={item.kiemtralantoi} />
                                </td>
                                <td>{item.solangoi}</td>
                                <td>{utils.getTrangThaiChamSoc(item.trangthai)}</td>
                                <td>
                                    <LabelOverflow text={item.ghichu} />
                                </td>
                                <td>
                                    <ButtonEdit onClick={() => handleEditNote(item)} />
                                    <ButtonChatZalo data={item} alert={props.alert} />
                                    <ButtonCall data={item} alert={props.alert} confirm={props.confirm} />
                                </td>
                            </tr>
                        );
                    }}
                ></DataTable.Body>
            </DataTable>
        </React.Fragment>
    );
};

export default connect(null, null)(CustomerCare);
