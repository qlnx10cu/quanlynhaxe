import React, { } from 'react';
import { DivFlexRow, DivFlexColumn, Table, Input,Button } from '../../styles'
import moment from 'moment';
import { HOST } from '../../Config'

const RenderTableBill = ({ list }) => {

    return (
        <React.Fragment>
            <Table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Tên phụ tùng <br /> và công việc</th>
                        <th>Mã phụ tùng</th>
                        <th>Đơn giá</th>
                        <th>SL</th>
                        <th>Tiền phụ tùng</th>
                        <th>Tiền công</th>
                        <th>Tổng tiền công <br />+ phụ tùng</th>
                    </tr>

                    {list && list.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.tenphutungvacongviec}</td>
                            <td>{item.maphutung}</td>
                            <td>{item.dongia.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>{item.soluongphutung}</td>
                            <td>{(item.dongia * item.soluongphutung).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>{item.tiencong && item.tiencong.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>{item.tongtien && item.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                        </tr>

                    ))}

                </tbody>
            </Table>
        </React.Fragment>
    )
}

const RenderBillChan = ({
    data
}) => {
    const exportBill = () => {
        window.open(
            `${HOST}/billsuachua/mahoadon/${data.mahoadon}/export`,
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
                    <Button onClick={exportBill} style={{ marginLeft: 20 ,marginTop:10}}>
                        Export
                </Button>
                </DivFlexRow>
                <DivFlexRow>
                    <DivFlexColumn>
                        <label>Yêu Cầu khách hàng: </label>
                        <Input readOnly autocomplete="off" value={data.yeucaukhachhang} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ marginLeft: 20 }}>
                        <label>Tư vấn sửa chữa: </label>
                        <Input readOnly value={data.tuvansuachua} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexColumn style={{ marginTop: 10 }}>
                    <label>Tổng tiền: </label>
                    <Input readOnly value={data.tongtien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })} />
                </DivFlexColumn>
                <RenderTableBill list={data.chitiet} />
            </React.Fragment>}
        </div>
    );
}

export default RenderBillChan;