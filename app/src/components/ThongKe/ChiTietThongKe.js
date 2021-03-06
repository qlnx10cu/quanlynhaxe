import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, Table, CloseButton } from '../../styles'
import { GetBillBanLeByMaHoaDon, GetBillSuaChuaByMaHoaDon } from '../../API/Bill'
import RenderBillLe from './RenderBillLe'
import RenderBillChan from './RenderBillChan'
import { GetListStaff } from '../../API/Staffs'

const RenderChiTietNhanVien = ({ staff }) => {
    return (
        <React.Fragment>
            <h3> Nhân viên bán hàng : {staff ? staff.ten : <div></div>}</h3>
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
                })
                    .catch(err => {
                        alert("Không lấy được chi tiết bill");
                    })
            }
        }
    }, [props.isShowing])


    const CallApiGetListStaff = (manv) => {
        GetListStaff(props.token).then(res => {
            let staff = null;
            var listStaff=res.data
            staff = listStaff.find(function (item) {
                return item.ma === manv
            })
            setStaff(staff)
        }).catch(err => {
            })
    }

    const getStaff = (manv) => {
        if(props.listStaff==null){
            CallApiGetListStaff(manv)
        }else{
        let staff = null;
        staff = props.listStaff.find(function (item) {
            return item.ma === manv
        })
        setStaff(staff)
    }
    }

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent style={{ width: '90%' }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => props.onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: 'center' }}>HEAD TRUNG TRANG</h3>
                <h4 style={{ textAlign: 'center' }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
                <h5 style={{ textAlign: 'center' }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
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