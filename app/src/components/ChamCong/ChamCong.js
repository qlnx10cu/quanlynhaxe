import React, { useState } from "react";
import { Table, Button, DivFlexRow, Input } from "../../styles";
import axios from "axios";
import { HOST, HOST_SHEME } from "../../Config";
import moment from "moment";
import styled from "styled-components";

const NewInput = styled(Input)`
    background-color: transparent;
    outline: none;
    border: none;
    text-align: center;
`;

export default (props) => {
    let [arr, setArr] = useState([]);
    let [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
    let [isLoading, setLoading] = useState(false);
    document.title = "Chấm công";
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
                <tbody>
                    <tr>
                        <th>Nhân viên</th>
                        <th>Tiền công</th>
                        {/* <th>VSKP</th>
                        <th>VSBĐ</th> */}
                        <th>Ghi chú</th>
                    </tr>
                    {arr.map((nv, index) => (
                        <tr key={index}>
                            <td>{nv.ten || ""}</td>
                            <td>{(nv.tiencong || 0).toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
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
