import React, { useState, useEffect } from "react";
import { DivFlexRow, Button, Input, Table, Select, Tab } from "../../styles";
import moment from "moment";
import { GetCuocGoiTheoNgay } from "../../API/CuocGoi";
// import ChiTietThongKe from './ChiTietThongKe'
import { connect } from "react-redux";
import { alert, success } from "../../actions/App";
import _ from "lodash";

const IconCircle = (props) => {
    return <i className="fa fa-circle" style={props.style}></i>;
};

const CuocGoi = (props) => {
    let [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
    let [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));
    let [searchName, setSearchName] = useState("");
    let [mHistoryCalls, setHistoryCalls] = useState([]);
    let [mHistoryCallCurrents, setHistoryCallCurrents] = useState([]);
    let [isLoading, setLoading] = useState(false);

    let [maxSizePage, setMaxSizePage] = useState(20);
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);
    let [activePage, setActive] = useState(0);

    useEffect(() => {
        setLoading(true);
        handleLayDanhSach();
    }, []);

    const handleLayDanhSach = () => {
        setLoading(true);
        let start = moment(dateStart).format("YYYY/MM/DD");
        let end = moment(dateEnd).format("YYYY/MM/DD");
        GetCuocGoiTheoNgay(props.token, start, end)
            .then((res) => {
                tachList(res.data, maxSizePage, activePage);
                setHistoryCallCurrents([...res.data]);
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
        tachList(mHistoryCallCurrents, e, activePage);
    };

    const convertDirection = (tab) => {
        if (tab == 1) {
            return "agent2user";
        }
        if (tab == 2) {
            return "user2agent";
        }
        return "";
    };

    const tachList = (list, size, tab) => {
        if (tab != 0) list = list.filter((x) => x && x.direction == convertDirection(tab));
        if (searchName != "") {
            list = list.filter(
                (bill) =>
                    searchName == "" ||
                    (bill && bill.callid && bill.callid.toLowerCase().includes(searchName.toLowerCase())) ||
                    (bill && bill.tenkh && bill.tenkh.toLowerCase().includes(searchName.toLowerCase())) ||
                    (bill && bill.sodienthoai && bill.sodienthoai.toLowerCase().includes(searchName.toLowerCase())) ||
                    (bill && bill.biensoxe && bill.biensoxe.toLowerCase().includes(searchName.toLowerCase()))
            );
        }
        let tmp = _.chunk(list, size);
        setHistoryCalls(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleSearchName = () => {
        tachList(mHistoryCallCurrents, maxSizePage, activePage);
    };

    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchName();
        }
    };

    const setTab = (tab) => {
        if (mHistoryCallCurrents) {
            setActive(tab);
            tachList(mHistoryCallCurrents, maxSizePage, tab);
        }
    };

    const copyCallId = (callid) => {
        try {
            navigator.clipboard.writeText(callid);
        } catch (ex) {}
    };

    const goiKhachHang = (e) => {
        if (!e) {
            props.error("Không thể gọi");
            return;
        }
        let url = `microsip://callto:${e}`;
        window.open(url);
    };

    return (
        <div>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <h3>Danh sách Cuộc gọi.</h3>
                    <label style={{ marginLeft: 10 }}>Bắt đầu từ </label>
                    <Input type="date" value={dateStart} style={{ marginLeft: 10 }} onChange={(e) => setDateStart(e.target.value)} />
                    <label style={{ marginLeft: 10 }}>Kết thúc</label>
                    <Input type="date" value={dateEnd} style={{ marginLeft: 10 }} onChange={(e) => setDateEnd(e.target.value)} />
                </DivFlexRow>
                <DivFlexRow>
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
                    Gọi ra
                </button>
                <button className={activePage === 2 ? "active" : ""} onClick={() => setTab(2)}>
                    Gọi vào
                </button>
            </Tab>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <label style={{ marginLeft: 10 }}>Search SDT,Tên,BSX,ZaloID: </label>
                    <Input
                        type="text"
                        onKeyPress={_handleKeyPress}
                        value={searchName}
                        style={{ marginLeft: 10 }}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <Button style={{ marginLeft: 10 }} onClick={handleSearchName}>
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
                    </tr>

                    {mHistoryCalls[page] &&
                        mHistoryCalls[page].map((item, index) => (
                            <tr key={index}>
                                <td
                                    title={item.callid}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100px",
                                    }}
                                    onClick={copyCallId(item.callid)}
                                >
                                    {item.callid}
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
                                    <IconCircle
                                        style={{ marginRight: "10px", color: item.status == 1 ? "green" : item.status == 2 ? "red" : "#00ffd0" }}
                                    />
                                    {item.status == 1 ? "Thành công" : item.status == 2 ? "Gọi nhỡ" : "Đang gọi"}
                                </td>
                                <td>{item.starttime}</td>
                                <td>{parseInt(item.durationms / 1000)}</td>
                                <td
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100px",
                                    }}
                                >
                                    {item.note || ""}
                                </td>
                                <td>
                                    <Button
                                        onClick={() => {}}
                                        style={{
                                            marginLeft: 5,
                                            height: 30,
                                            width: 30,
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        title="Xem chi tiết"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (!item.zaloid) {
                                                props.alert("Chưa có thông tin zalo từ khách hàng này");
                                            } else {
                                                window.open(`https://oa.zalo.me/chatv2?uid=${item.zaloid}&oaid=2867735993958514567`, "_blank");
                                            }
                                        }}
                                        style={{
                                            marginLeft: 5,
                                            height: 30,
                                            width: 30,
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        title="Nhắn tin với khách hàng"
                                    >
                                        <i className="fas fa-comment"></i>
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            props.confirm(
                                                `Bạn muốn gọi ${item.tenkh || ""} (${
                                                    item.sodienthoai || item.zaloid || (item.direction == "agent2user" ? item.tosip : item.fromsip)
                                                }) `,
                                                () => {
                                                    goiKhachHang(
                                                        item.sodienthoai ||
                                                            item.zaloid ||
                                                            (item.direction == "agent2user" ? item.tosip : item.fromsip)
                                                    );
                                                }
                                            );
                                        }}
                                        style={{
                                            marginLeft: 5,
                                            height: 30,
                                            width: 30,
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        title="Gọi khách hàng"
                                    >
                                        <i className="fas fa-phone"></i>
                                    </Button>
                                </td>
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

        </div>
    );
};

const mapState = (state) => ({
    token: state.Authenticate.token,
});

const mapDispatch = (dispatch) => ({
    alert: (mess) => {
        dispatch(alert(mess));
    },
    success: (mess) => {
        dispatch(success(mess));
    },
});

export default connect(mapState, mapDispatch)(CuocGoi);
