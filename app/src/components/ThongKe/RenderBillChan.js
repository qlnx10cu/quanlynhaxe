import React from "react";
import { DivFlexRow, DivFlexColumn, Table, Input, Button, Textarea, Select } from "../../styles";
import moment from "moment";
import { HOST, HOST_SHEME } from "../../Config";
import utils from "../../lib/utils";

const RenderTableBill = ({ list }) => {
    return (
        <React.Fragment>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>
                            Tên phụ tùng <br /> và công việc
                        </th>
                        <th>Mã phụ tùng</th>
                        <th>Đơn giá</th>
                        <th>SL</th>
                        <th>Chiết khấu</th>
                        <th>Tiền phụ tùng</th>
                        <th>Tiền công</th>
                        <th>
                            Tổng tiền công <br />+ phụ tùng
                        </th>
                    </tr>

                    {list &&
                        list.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: "left" }}>{item.tenphutungvacongviec}</td>
                                <td>{item.maphutung}</td>
                                <td style={{ textAlign: "right" }}>{utils.formatVND(item.dongia)}</td>
                                <td style={{ textAlign: "right" }}>{item.soluongphutung}</td>
                                <td style={{ textAlign: "right" }}>{item.chietkhau}%</td>
                                <td style={{ textAlign: "right" }}>{utils.formatVND(item.tienpt)}</td>
                                <td style={{ textAlign: "right" }}>{utils.formatVND(item.tiencong)}</td>
                                <td style={{ textAlign: "right" }}>{utils.formatVND(item.tongtien)}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </React.Fragment>
    );
};

const RenderBillChan = ({ data }) => {
    const exportBill = () => {
        window.open(
            `${HOST}/billsuachua/mahoadon/${data.mahoadon}/export`,
            "_blank" // <- This is what makes it open in a new window.
        );
    };
    const exportBillExcel = () => {
        window.open(
            `${HOST_SHEME}/exportsuachua?mahoadon=${data.mahoadon}`,
            "_blank" // <- This is what makes it open in a new window.
        );
    };

    return (
        <React.Fragment>
            <DivFlexRow>
                <DivFlexColumn>
                    <label>Nhân Viên Sữa Chữa: </label>
                    <Input readOnly autocomplete="off" value={data.tennvsuachua} />
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow>
                <DivFlexColumn>
                    <label>Tên khách hàng: </label>
                    <Input readOnly autocomplete="off" value={data.tenkh} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Biển số xe: </label>
                    <Input readOnly value={data.biensoxe} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Số KM </label>
                    <Input readOnly value={data.sokm} />
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 10 }}>
                <DivFlexColumn>
                    <label>Ngày bán: </label>
                    <Input readOnly autocomplete="off" value={moment(data.ngayban).format("hh:mm DD/MM/YYYY")} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Ngày thanh toán: </label>
                    <Input readOnly value={moment(data.ngayban).format("hh:mm DD/MM/YYYY")} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Kiểm tra định kỳ: </label>
                    <Select disabled readOnly value={data.kiemtradinhky}>
                        <option value="0">Không có</option>
                        <option value="1">Lần 1</option>
                        <option value="2">Lần 2</option>
                        <option value="3">Lần 3</option>
                        <option value="4">Lần 4</option>
                        <option value="5">Lần 5</option>
                        <option value="6">Lần 6</option>
                    </Select>
                </DivFlexColumn>
                <Button onClick={exportBill} style={{ marginLeft: 20, marginTop: 10 }}>
                    Export
                </Button>
                <Button onClick={exportBillExcel} style={{ marginLeft: 20, marginTop: 10 }}>
                    Export Excel
                </Button>
            </DivFlexRow>
            <DivFlexRow>
                <DivFlexColumn>
                    <label>Yêu Cầu khách hàng: </label>
                    <Textarea readOnly autocomplete="off" value={data.yeucaukhachhang || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Tư vấn sửa chữa: </label>
                    <Textarea readOnly value={data.tuvansuachua || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Kiểm tra lần tới: </label>
                    <Textarea readOnly value={data.kiemtralantoi || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 20 }}>
                    <label>Ngày Hẹn: </label>
                    <Input readOnly value={data.ngayhen ? moment(data.ngayhen).format("DD/MM/YYYY") : "Không có"} />
                </DivFlexColumn>
            </DivFlexRow>
            <If condition={data.lydo}>
                <DivFlexRow>
                    <DivFlexColumn>
                        <label>Ngày thay đổi: </label>
                        <Input readOnly value={data.ngaysuachua} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Lý do thay đổi: </label>
                        <Textarea readOnly autocomplete="off" value={data.lydo || ""} cols={53} />
                    </DivFlexColumn>
                </DivFlexRow>
            </If>
            <DivFlexRow>
                <DivFlexColumn style={{ marginTop: 10 }}>
                    <label>Tiền PT: </label>
                    <Input readOnly value={utils.formatVND(data.tienpt)} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 15, marginTop: 10 }}>
                    <label>Tiền Công: </label>
                    <Input readOnly value={utils.formatVND(data.tiencong)} />
                </DivFlexColumn>
                <DivFlexColumn style={{ marginLeft: 15, marginTop: 10 }}>
                    <label>Tổng tiền: </label>
                    <Input readOnly value={utils.formatVND(data.tongtien)} />
                </DivFlexColumn>
            </DivFlexRow>

            <RenderTableBill list={data.chitiet || []} />
        </React.Fragment>
    );
};

export default RenderBillChan;
