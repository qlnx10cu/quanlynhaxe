import React, { useState } from "react";
import styled from "styled-components";
import { TabPage } from "../Styles";
import { Table, Button, DivFlexRow, Input } from "../../styles";
import axios from "axios";
import { HOST, HOST_SHEME } from "../../Config";
import moment from "moment";
import utils from "../../lib/utils";

const NewInput = styled(Input)`
    background-color: transparent;
    outline: none;
    border: none;
    text-align: center;
`;

const handleDateInput = function () {
    let [value, setValue] = useState(moment().format("YYYY-MM-DD"));
    const onChange = async function (e) {
        await setValue(moment(e.target.value).format("YYYY-MM-DD"));
    };

    return {
        value,
        onChange,
    };
};

const TabChamCong = (props) => {
    let [arr, setArr] = useState([]);
    let [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
    let [isLoading, setLoading] = useState(false);
    const fetchData = async () => {
        let tmp = moment(dateStart).format("YYYY-MM-DD");

        setLoading(true);
        try {
            let res = await axios.get(`${HOST}/chamcong/theongay/ngay/${tmp}`);
            setLoading(false);
            await setArr(res.data);
        } catch (error) {}
    };
    const uploadData = async () => {
        if (arr.length) {
            try {
                let ngay = moment(dateStart).format("YYYY-MM-DD");
                let tmp = arr.map((e) => {
                    let _tmp = { ...e };
                    delete _tmp["ten"];
                    delete _tmp["ma"];
                    return _tmp;
                });
                await axios.post(`${HOST}/chamcong/theongay/ngay/${ngay}`, {
                    chitiet: tmp,
                });
                props.alert("Thành công!");
            } catch (error) {
                console.log(error);
                props.alert("Chấm công không thành công!");
            }
        }
    };
    const exportData = async () => {
        let ngay = moment(dateStart).format("YYYY-MM-DD");
        let url = `${HOST_SHEME}/exportchamcong?start=${ngay}`;
        window.open(
            url,
            "_blank" // <- This is what makes it open in a new window.
        );
    };
    const handleTextInput = (index, name, value) => {
        let newArr = [...arr];
        if (name === "ghichu") newArr[index][name] = value;
        else newArr[index][name] = Number.parseInt(value || 0);
        setArr(newArr);
    };
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Chấm công</h1>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <label style={{ marginLeft: 10 }}>Ngày: </label>
                    <Input
                        type="date"
                        data-date=""
                        data-date-format="DD MMMM YYYY"
                        max={new Date()}
                        value={dateStart}
                        style={{ marginLeft: 10 }}
                        onChange={(e) => setDateStart(e.target.value)}
                    />
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <Button onClick={isLoading ? null : () => exportData()}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Export"}
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={isLoading ? null : () => fetchData()}>
                        {isLoading ? <i className="fas fa-spinner fa-pulse"></i> : "Lấy danh sách"}
                    </Button>
                </DivFlexRow>
            </DivFlexRow>
            <Table style={{ marginTop: 15 }}>
                <thead>
                    <tr>
                        <th>Nhân viên</th>
                        <th>Tiền công</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {arr.map((nv, index) => (
                        <tr key={index}>
                            <td>{nv.ten || ""}</td>
                            <td>{utils.formatVND(nv.tiencong)}</td>
                            <td>
                                <NewInput
                                    value={arr[index].ghichu ? arr[index].ghichu : ""}
                                    onChange={(e) => handleTextInput(index, "ghichu", e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                    {
                        <tr>
                            <td>Tổng</td>
                            <td>{arr.reduce((a, b) => a + (b.tiencong || 0), 0).toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                            <td></td>
                        </tr>
                    }
                </tbody>
            </Table>
            <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: "space-between" }}>
                <label></label>
                <Button onClick={() => uploadData()}>Lưu</Button>
            </DivFlexRow>
        </div>
    );
};

const TheoDoi = (props) => {
    let start = handleDateInput();
    let end = handleDateInput();
    let [data, setData] = useState([]);
    let [nv, setNV] = useState([]);
    let [sum, setSum] = useState({});
    const fetchData = async () => {
        let url = `${HOST}/statistic/chamcong/employee?start=${start.value}&end=${end.value}`;
        try {
            let res = await axios.get(url);
            let arr = res.data;
            if (arr[0]) {
                let tmp = arr[0].data.map((e) => e.ten).sort((a, b) => a < b);
                let tmp2 = [];
                arr.forEach((element) => {
                    tmp2 = tmp2.concat(element.data);
                });
                let tmp3 = tmp2.reduce((prev, cur) => {
                    if (prev[cur.ten]) {
                        prev[cur.ten] += cur.tiencong + cur.vskp + cur.vsbd;
                    } else prev[cur.ten] = cur.tiencong + cur.vskp + cur.vsbd;
                    return prev;
                }, {});
                setSum(tmp3);

                setNV([...new Set(tmp)]);
            }

            setData(arr);
        } catch (error) {
            console.log(error);
            props.alert("Lay danh sach khong thanh cong!");
        }
    };
    const exportData = async () => {
        let url = `${HOST_SHEME}/exporttheodoi?start=${start.value}&end=${end.value}`;
        window.open(
            url,
            "_blank" // <- This is what makes it open in a new window.
        );
    };
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Theo dõi</h1>
            <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexRow style={{ alignItems: "center" }}>
                    <label style={{ marginLeft: 10 }}>Ngày bắt đầu: </label>
                    <Input type="date" {...start} />
                    <label style={{ marginLeft: 10 }}>Ngày kết thúc: </label>
                    <Input type="date" {...end} />
                </DivFlexRow>
                <Button onClick={exportData} style={{ marginLeft: 10 }}>
                    Export
                </Button>
                <Button onClick={fetchData}>Lấy danh sách</Button>
            </DivFlexRow>
            <Table style={{ marginTop: 15 }}>
                {nv.length > 0 && (
                    <tbody>
                        <tr>
                            {nv.length > 0 && <th>Ngay</th>}
                            {nv.map((e, i) => (
                                <th key={i}>{e}</th>
                            ))}
                        </tr>
                        {data.map((e, index) => (
                            <tr key={index}>
                                <td>{e.ngay}</td>
                                {e.data.map((el, i) => (
                                    <td key={i}>
                                        {(el.tiencong + el.vsbd + el.vskp || 0).toLocaleString("vi-VI", { style: "currency", currency: "VND" })}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            {nv.length > 0 && <td>Tổng tiền</td>}
                            {nv.map((e, i) => (
                                <td key={i}>{sum[e].toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                            ))}
                        </tr>
                    </tbody>
                )}
            </Table>
        </div>
    );
};

const ChamCong = (props) => {
    return (
        <React.Fragment>
            <TabPage>
                <TabPage.Tab title={"Chấm công"}>
                    <TabChamCong {...props} />
                </TabPage.Tab>
                <TabPage.Tab title={"Theo dỗi"}>
                    <TheoDoi {...props} />
                </TabPage.Tab>
            </TabPage>
        </React.Fragment>
    );
};

export default ChamCong;
