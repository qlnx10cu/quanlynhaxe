import React, { } from 'react';
import { DivFlexRow, DivFlexColumn, Table, Input } from '../../styles'
import moment from 'moment';

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
                            <td>{item.tenphutung}</td>
                            <td>{item.maphutung}</td>
                            <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>{item.soluong}</td>
                            <td>{item.chietkhau}</td>
                            <td>{item.nhacungcap ? item.nhacungcap : "Trung Trang"}</td>
                            <td>{(item.soluong * (item.dongia - item.dongia * item.chietkhau / 100)).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
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
    return (
        <div>
            {data && <React.Fragment>
                <DivFlexColumn>
                    <label>Tên khách hàng: </label>
                    <Input readOnly autocomplete="off" value={data.tenkh} />
                </DivFlexColumn>
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
                </DivFlexRow>
                <RenderTableBill list={data.chitiet} />
                <DivFlexColumn style={{ marginTop: 10 ,alignItems: 'right'}}>
                    <label>Tổng tiền:
                    <font size="4" ><b> {data.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</b></font>
                    </label>
                </DivFlexColumn>
                <DivFlexColumn style={{ marginTop: 10 }}>
                    <label><i> *Quý khách vui lỏng đổi trả trong 24h, kể từ khi mua hàng</i></label>
                </DivFlexColumn>
            </React.Fragment>}
        </div>
    );
}

export default RenderBillLe;