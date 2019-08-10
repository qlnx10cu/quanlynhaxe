import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, Table, CloseButton} from '../../styles'
import { GetBillBanLeByMaHoaDon, GetBillSuaChuaByMaHoaDon } from '../../API/Bill'
import RenderBillLe from './RenderBillLe'
import RenderBillChan from './RenderBillChan'

const RenderChiTietNhanVien = ({ staff }) => {
    return (
        <React.Fragment>
            <h3>Thông tin nhân viên xuất bill</h3>
            {staff ?
                <Table>
                    <tbody>
                        <tr>
                            <th>Mã Nhân Viên</th>
                            <th>Tên Nhân Viên</th>
                            <th>Số CMND</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Chức vụ</th>
                        </tr>

                        <tr>
                            <td>{staff.ma}</td>
                            <td>{staff.ten}</td>
                            <td>{staff.cmnd}</td>
                            <td>{staff.sdt}</td>
                            <td>{staff.gmail}</td>
                            <td>{staff.chucvu}</td>
                        </tr>
                    </tbody>
                </Table> :
                <h3 style={{ textAlign: 'center' }}>Không lấy được danh sách nhân viên</h3>
            }
        </React.Fragment>
    )
}

const ChiTietThongKe = (props) => {
    let [data, setData] = useState(null);
    let [staff, setStaff] = useState(null);

    useEffect(() => {
        if (props.isShowing) {
            if (props.loaihoadon === 1) {
                //Bill le
                GetBillBanLeByMaHoaDon(props.token, props.mahoadon).then(res => {
                    getStaff(res.data.manv);
                    setData(res.data);
                })
                    .catch(err => {
                        alert("Không lấy được chi tiết bill");
                    })
            }
            else if (props.loaihoadon === 0) {
                //Bill chan
                GetBillSuaChuaByMaHoaDon(props.token, props.mahoadon).then(res => {
                    getStaff(res.data.manv);
                    setData(res.data);
                    console.log(res);
                })
                    .catch(err => {
                        alert("Không lấy được chi tiết bill");
                    })
            }
        }
    }, [props.isShowing])

    const getStaff = (manv) => {
        let staff = null;
        staff = props.listStaff.find(function (item) {
            return item.ma === manv
        })
        setStaff(staff)
    }

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent style={{ width: '90%' }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => props.onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: 'center' }}>Chi tiết ({props.mahoadon})</h3>
                <RenderChiTietNhanVien staff={staff} />
                <h3 style={{ marginTop: 10 }}>Thông tin bill</h3>
                {
                    props.loaihoadon === 1 ? <RenderBillLe data={data} /> : props.loaihoadon === 0 ? <RenderBillChan data={data} /> :
                        <h3 style={{ textAlign: 'center' }}>Không lấy được chi tiết bill</h3>
                }
            </ModalContent>
        </Modal>
    );
}

export default ChiTietThongKe;