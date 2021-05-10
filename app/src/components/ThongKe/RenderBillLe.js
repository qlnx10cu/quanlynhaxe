import React, { } from 'react';
import { DivFlexRow, DivFlexColumn, Table, Input, Button, Textarea } from '../../styles'
import moment from 'moment';
import { HOST } from '../../Config'

const RenderTableBill = ({ list }) => {
    return (
        <React.Fragment>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Tên phụ tùng</th>
                        <th>Mã phụ tùng</th>
                        <th>Đơn giá</th>
                        <th>SL</th>
                        <th>Chiết Khấu</th>
                        <th>Nhà Cung Cấp</th>
                        <th>Tổng tiền</th>
                    </tr>

                    {list && list.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ textAlign: "left" }}>{item.tenphutung}</td>
                            <td>{item.maphutung}</td>
                            <td style={{ textAlign: "right" }}>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td style={{ textAlign: "right" }}>{item.soluong}</td>
                            <td style={{ textAlign: "right" }}>{item.chietkhau}%</td>
                            <td style={{ textAlign: "right" }}>{item.nhacungcap ? item.nhacungcap : "Trung Trang"}</td>
                            <td style={{ textAlign: "right" }}>{(item.soluong * (item.dongia - item.dongia * item.chietkhau / 100)).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                        </tr>

                    ))}

                </tbody>
            </Table>
        </React.Fragment>
    )
}

const RenderBillLe = ({
    data
}) => {

    const exportBill = () => {
        window.print();
    }
    const exportBillNew = () => {
        window.open(
            `${HOST}/billle/mahoadon/${data.mahoadon}/export`,
            '_blank' // <- This is what makes it open in a new window.
        );
    }

    return (
        <div>
            {data && <React.Fragment>
                <DivFlexRow>
                    <DivFlexColumn>
                        <label>Tên khách hàng: </label>
                        <Input readOnly autocomplete="off" value={data.tenkh} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 10 }}>
                        <label>Số điện thoại: </label>
                        <Input readOnly autocomplete="off" value={data.sodienthoai} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 10 }}>
                        <label>Địa chỉ: </label>
                        <Input readOnly autocomplete="off" value={data.diachi} />
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
                        <label>Mã Hóa Đơn: </label>
                        <Input readOnly value={data.mahoadon} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        <Button onClick={exportBill} style={{ marginLeft: 20, marginTop: 10 }}>
                            Print
                            </Button>
                        <Button onClick={exportBillNew} style={{ marginLeft: 20, marginTop: 10 }}>
                            Print New
                            </Button>
                    </DivFlexColumn>
                </DivFlexRow>
                {data.lydo && <DivFlexRow>
                    <DivFlexColumn>
                        <label>Ngày thay đổi: </label>
                        <Input readOnly value={data.ngaysuachua} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Lý do thay đổi: </label>
                        <Textarea readOnly autocomplete="off" value={data.lydo} cols={53} />
                    </DivFlexColumn>
                </DivFlexRow>}
                <RenderTableBill list={data.chitiet} />
                <DivFlexColumn style={{ marginTop: 10, alignItems: 'right' }}>
                    <label>Tổng tiền:
                    <font size="4" ><b> {data.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</b></font>
                    </label>
                </DivFlexColumn>
                <DivFlexColumn style={{ marginTop: 10, alignItems: 'right' }}>
                    <label><i> *Quý khách vui lỏng đổi trả trong 24h, kể từ khi mua hàng</i></label>
                </DivFlexColumn>
            </React.Fragment>}
        </div>
    );
}

export default RenderBillLe;