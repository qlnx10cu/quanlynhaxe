import React, { useEffect, useState } from "react";
import { DivFlexRow, DivFlexColumn, Input, Table, Link, Button } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import * as actions from "../../actions";
import lib from "../../lib";
import { ButtonCall, ButtonChatZalo, ButtonView, TabPage } from "../Styles";
import { GetCustomerDetail } from "../../API/Customer";
import moment from "moment/moment";
import ChiTietThongKe from "../ThongKe/ChiTietThongKe";
import { POPUP_NAME } from "../../actions/Modal";
import DataTable from "../Warrper/DataTable";
import utils from "../../lib/utils";

const IconCircle = (props) => {
    return <i className="fa fa-circle" style={props.style}></i>;
};

const RenderTableDetail = ({ onViewBill, list }) => {
    list = (list || []).sort(function (a, b) {
        var x = a.ngaythanhtoan.toLowerCase();
        var y = b.ngaythanhtoan.toLowerCase();
        return x > y ? -1 : x < y ? 1 : 0;
    });

    return (
        <React.Fragment>
            <DataTable data={list}>
                <DataTable.Header>
                    <th>STT</th>
                    <th>Ngày</th>
                    <th>Mã Hóa Đơn</th>
                    <th>Nhân viên sữa chữa</th>
                    <th>Yêu cầu khách hàng</th>
                    <th>Tư vấn sữa chữa</th>
                    <th>KTDK</th>
                    <th>Xem chi tiết</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index} style={{ fontSize: 14 }}>
                                <td>{index + 1}</td>
                                <td>{moment(item.ngaythanhtoan).format("DD/MM/YYYY")}</td>
                                <td>
                                    <Link onClick={() => onViewBill(item)}>{item.mahoadon}</Link>
                                </td>
                                <td>{item.tennvsuachua}</td>
                                <td
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "200px",
                                    }}
                                >
                                    {item.yeucaukhachhang}
                                </td>
                                <td
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "200px",
                                    }}
                                >
                                    {item.tuvansuachua}
                                </td>
                                <td>{!item.kiemtradinhky || item.kiemtradinhky == "0" ? "Không" : "Lần " + (item.kiemtradinhky || "")}</td>
                                <td>
                                    <ButtonView onClick={() => onViewBill(item)} />
                                </td>
                            </tr>
                        );
                    }}
                ></DataTable.Body>
            </DataTable>
        </React.Fragment>
    );
};

const RenderTableCSKH = ({ onViewBill, list }) => {
    list = (list || []).sort(function (a, b) {
        var x = a.ngayhen.toLowerCase();
        var y = b.ngayhen.toLowerCase();
        return x > y ? -1 : x < y ? 1 : 0;
    });

    return (
        <React.Fragment>
            <DataTable data={list}>
                <DataTable.Header>
                    <th>STT</th>
                    <th>Ngày Hẹn</th>
                    <th>Hóa đơn</th>
                    <th style={{ width: 200 }}>Kiểm tra lần tới</th>
                    <th>Số lần gọi</th>
                    <th>Trạng thái</th>
                    <th style={{ width: 200 }}>Ghi Chú</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index} style={{ fontSize: 14 }}>
                                <td>{index + 1}</td>
                                <td>{moment(item.ngayhen).format("DD/MM/YYYY")}</td>

                                <td>
                                    <Link
                                        style={{
                                            borderBottom: "1px solid blue",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => onViewBill(item)}
                                    >
                                        {item.mahoadon}
                                    </Link>
                                </td>
                                <td
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100px",
                                    }}
                                >
                                    {item.kiemtralantoi || ""}
                                </td>
                                <td>{item.solangoi}</td>
                                <td>{utils.getTrangThaiChamSoc(item.trangthai)}</td>
                                <td
                                    title={item.ghichu || ""}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100px",
                                    }}
                                >
                                    {item.ghichu || ""}
                                </td>
                            </tr>
                        );
                    }}
                ></DataTable.Body>
            </DataTable>
        </React.Fragment>
    );
};

const RenderTableCall = ({ list }) => {
    const copyCallId = (callid) => {
        try {
            navigator.clipboard.writeText(callid);
        } catch (ex) {}
    };

    list = (list || []).sort(function (a, b) {
        var x = a.starttime.toLowerCase();
        var y = b.starttime.toLowerCase();
        return x > y ? -1 : x < y ? 1 : 0;
    });

    return (
        <React.Fragment>
            <DataTable data={list}>
                <DataTable.Header>
                    <th>STT</th>
                    <th>Ngày</th>
                    <th>CallId</th>
                    <th>Nhánh</th>
                    <th>Nhân Viên</th>
                    <th>Chiều gọi</th>
                    <th>Kết quả</th>
                    <th>Thời gian gọi</th>
                    <th>Note</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index} style={{ fontSize: 14 }}>
                                <td>{index + 1}</td>
                                <td>{moment(item.starttime).format("HH:mm DD/MM/YYYY")}</td>
                                <td
                                    title={item.callid}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100px",
                                    }}
                                    onClick={utils.copyText(item.callid)}
                                >
                                    {item.callid}
                                </td>
                                <td>{item.breachsip}</td>
                                <td>{item.tennv}</td>
                                <td style={{ color: item.status == 1 ? "green" : item.status == 2 ? "red" : "#00ffd0" }}>
                                    {item.direction == "agent2user" ? <i className="fa fa-arrow-right"></i> : <i className="fa fa-arrow-left"></i>}
                                </td>
                                <td>
                                    <IconCircle
                                        style={{ marginRight: "10px", color: item.status == 1 ? "green" : item.status == 2 ? "red" : "#00ffd0" }}
                                    />
                                    {item.status == 1 ? "Thành công" : item.status == 2 ? "Gọi nhỡ" : "Đang gọi"}
                                </td>
                                <td>{parseInt(item.durationms / 1000)}</td>
                                <td
                                    onClick={() => {}}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {item.note || ""}
                                </td>
                            </tr>
                        );
                    }}
                ></DataTable.Body>
            </DataTable>
        </React.Fragment>
    );
};

const PopupCustomerHistory = (props) => {
    const useIsMounted = lib.useIsMounted();
    let [mData, setData] = useState("");
    const item = props.item;

    useEffect(() => {
        if (!item) return;
        GetCustomerDetail(props.token, item.ma)
            .then((res) => {
                if (!useIsMounted()) return;
                setData(res.data);
            })
            .catch((err) => {
                if (!useIsMounted()) return;
                props.alert("không thể xem được chi tiết");
            });
    }, []);

    const handleViewBill = (hoadon) => {
        props.openModal(POPUP_NAME.POPUP_BILL, { mahoadon: hoadon.mahoadon, loaihoadon: 0 });
    };

    return (
        <ModalWrapper open={props.open} isLoading={!mData} title={"Lịch sữ khách hàng"} callback={props.callback} onClose={props.onClose}>
            <DivFlexRow style={{ marginTop: 10, width: "100%", justifyContent: "space-between" }}>
                <DivFlexColumn style={{ fontSize: 14, marginBottom: 2 }}>
                    Tên Khách Hàng
                    <Input readOnly value={mData.ten || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                    Số Điện Thoại
                    <Input readOnly type="Number" value={mData.sodienthoai || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                    Zalo Id
                    <Input readOnly type="" value={mData.zaloid || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2, width: "100px" }}>
                    Giới Tính
                    <Input readOnly value={mData.gioitinh == "1" ? "Nữ" : mData.gioitinh == "0" ? "Nam" : ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2, width: "150px" }}>
                    Thành Phố
                    <Input readOnly value={mData.thanhpho || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2, width: "150px", justifyContent: "space-around" }}>
                    <DivFlexColumn style={{ display: "inline", width: "100%" }}>
                        <ButtonChatZalo style={{ width: "50px" }} data={mData} alert={props.alert}></ButtonChatZalo>
                        <ButtonCall style={{ width: "50px", marginLeft: "10px" }} data={mData} alert={props.alert}></ButtonCall>
                    </DivFlexColumn>
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 10, width: "100%", justifyContent: "space-between" }}>
                <DivFlexColumn style={{ fontSize: 14, marginBottom: 2 }}>
                    Biển Số Xe
                    <Input readOnly width="auto" value={mData.biensoxe || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                    Loại Xe
                    <Input readOnly width="auto" value={mData.loaixe || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                    Số Khung
                    <Input readOnly width="auto" value={mData.sokhung || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                    Số Máy
                    <Input readOnly width="auto" value={mData.somay || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 14, marginLeft: 10, marginBottom: 2 }}>
                    Địa Chỉ
                    <Input readOnly width="auto" value={mData.diachi || ""} />
                </DivFlexColumn>
            </DivFlexRow>
            <TabPage>
                <TabPage.Tab title="Sữa chữa">
                    <RenderTableDetail list={mData.chitiet} onViewBill={handleViewBill} {...props} />
                </TabPage.Tab>
                <TabPage.Tab title="Chăm sóc">
                    <RenderTableCSKH list={mData.historycskh} onViewBill={handleViewBill} {...props} />
                </TabPage.Tab>
                <TabPage.Tab title="Cuộc gọi">
                    <RenderTableCall list={mData.historycall} onViewBill={handleViewBill} {...props} />
                </TabPage.Tab>
            </TabPage>
        </ModalWrapper>
    );
};

export default connect(null, null)(PopupCustomerHistory);
