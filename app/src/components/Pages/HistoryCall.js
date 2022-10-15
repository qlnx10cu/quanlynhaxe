import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import DataTable from "../Warrper/DataTable";
import utils from "../../lib/utils";
import lib from "../../lib";
import { ButtonCall, ButtonChatZalo, ButtonUpload, ButtonView, IconCircle, LabelOverflow, TabPage } from "../Styles";
import HistoryCallApi from "../../API/HistoryCallApi";
import { DivFlexRow, Input } from "../../styles";

const HistoryCall = (props) => {
    const [tab, setTab] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [historycalls, setHistoryCalls] = useState([]);
    const mDateStart = lib.handleInputDate("YYYY-MM-DD");
    const mDateEnd = lib.handleInputDate("YYYY-MM-DD");

    useEffect(() => {
        handleLayDanhSach();
    }, []);

    const handleLayDanhSach = () => {
        setLoading(true);
        HistoryCallApi.getListByDate(mDateStart.value, mDateEnd.value)
            .then((data) => {
                setHistoryCalls(data);
            })
            .catch((err) => {
                props.alert("Có lỗi không thể lấy danh sách");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const convertDirection = (direction) => {
        switch (direction) {
            case "agent2user":
                return 1;
            case "user2pbx":
            case "user2agent":
                return 2;
        }
        return 0;
    };

    return (
        <React.Fragment>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <h3>Danh sách Cuộc gọi.</h3>
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
                <TabPage.Tab title="Gọi ra" />
                <TabPage.Tab title="Gọi vào" />
            </TabPage>
            <DataTable
                isLoading={isLoading}
                data={historycalls.filter((x) => tab == 0 || convertDirection(x.direction) == tab)}
                searchData={(search, call) =>
                    utils.searchName(call.callid, search) ||
                    utils.searchName(call.tenkh, search) ||
                    utils.searchName(call.sodienthoai, search) ||
                    utils.searchName(call.biensoxe, search)
                }
            >
                <DataTable.Header>
                    <th style={{ width: 100 }}>CallId</th>
                    <th style={{ width: 100 }}>Nhánh</th>
                    <th>Tên NV</th>
                    <th style={{ width: 100 }}>Chiều gọi</th>
                    <th>Tên KH</th>
                    <th>SDT /ZaloId</th>
                    <th>BSX</th>
                    <th style={{ width: 160 }}>Kết quả</th>
                    <th style={{ width: 180 }}>Thời gian</th>
                    <th style={{ width: 120 }}>Thời gian gọi</th>
                    <th style={{ width: 120 }}>Ghi Chú</th>
                    <th style={{ width: 120 }}>Xem | Chat | Gọi</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <LabelOverflow text={item.callid} />
                                </td>
                                <td>{item.breachsip}</td>
                                <td>{item.tennv}</td>
                                <td style={{ color: item.status == 1 ? "green" : item.status == 2 ? "red" : "#00ffd0" }}>
                                    {item.direction == "agent2user" ? <i className="fa fa-arrow-right"></i> : <i className="fa fa-arrow-left"></i>}
                                </td>
                                <td>{item.tenkh}</td>
                                <td>{item.sodienthoai || item.zaloid || (item.direction == "agent2user" ? item.tosip : item.fromsip)}</td>
                                <td>{item.biensoxe}</td>
                                <td>
                                    <IconCircle status={item.status} style={{ marginRight: "10px" }} />
                                </td>
                                <td>{item.starttime}</td>
                                <td>{utils.parseInt(item.durationms / 1000)}</td>
                                <td>
                                    <LabelOverflow text={item.note || ""} />
                                </td>
                                <td>
                                    <ButtonView onClick={() => {}} />
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

export default connect(null, null)(HistoryCall);
