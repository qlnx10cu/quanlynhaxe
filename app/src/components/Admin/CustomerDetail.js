import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input } from '../../styles'
// import { showNoti } from '../../../Actions/Notification';
import { AddCustomer, UpdateCustomer } from '../../API/Customer'
import { connect } from 'react-redux'



const CustomerDetail = (props) => {

    let [isUpload, setUpload] = useState(false);
    let [mCustomerName, setCustomerName] = useState("");
    let [mSDT, setSDT] = useState("");
    let [mAddress, setAddress] = useState("");
    let [mSoXe, setSoXe] = useState("");
    let [mLoaiXe, setLoaiXe] = useState("");
    let [mSoKhung, setSoKhung] = useState("");
    let [mSoMay, setSoMay] = useState("");


    let item = props.editItem;
    useEffect(() => {
        if (item && item.ma) {
            setCustomerName(item.ten);
            setSDT(item.sodienthoai);
            setAddress(item.diachi);
            setSoXe(item.biensoxe);
            setLoaiXe(item.loaixe);
            setSoKhung(item.sokhung);
            setSoMay(item.somay);
        }
        else {
            setCustomerName('');
            setSDT('');
            setAddress('');
            setSoXe('');
            setLoaiXe('');
            setSoKhung('');
            setSoMay('');
        }
    }, [item])

    const handleButtonSave = () => {
        var data = {
            ten: mCustomerName,
            sodienthoai: mSDT,
            diachi: mAddress,
            biensoxe: mSoXe,
            loaixe: mLoaiXe,
            sokhung: mSoKhung,
            somay: mSoMay,
        }
        setUpload(true);
        AddCustomer(props.token, data).then(Response => {
            setUpload(false);
            props.onCloseClick();
        }).catch(err => {
            setUpload(false);
            alert("Tạo tài khoản thất bại \n\n Error:" + err.response.data.error.message);
        });
    };
    const handleButtonUpdate = () => {
        var data = {
            ten: mCustomerName,
            sodienthoai: mSDT,
            diachi: mAddress,
            biensoxe: mSoXe,
            loaixe: mLoaiXe,
            sokhung: mSoKhung,
            somay: mSoMay,
        }
        setUpload(true);
        UpdateCustomer(props.token, data, item.ma).then(Response => {
            setUpload(false);
            props.onCloseClick();
        }).catch(err => {
            setUpload(false);
            alert("Cập nhập tài khoản thất bại \n\n Error:" + err.response.data.error.message);
            console.log(err.response.data);
        });
    };

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={props.onCloseClick}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <DivFlexRow style={{ marginTop: 10 }}>
                    <DivFlexColumn style={{ marginLeft: 25, width: '100%' }}>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Tên Khách Hàng
                                <Input width='auto' value={mCustomerName} onChange={(e) => setCustomerName(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Số Điện Thoại
                                <Input width='auto' type="Number" value={mSDT} onChange={(e) => setSDT(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 5 }}>
                            Địa Chỉ
                                <Input width='auto' value={mAddress} onChange={(e) => setAddress(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Biển Số Xe
                                <Input width='auto' value={mSoXe} onChange={(e) => setSoXe(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Loại Xe
                                <Input width='auto' value={mLoaiXe} onChange={(e) => setLoaiXe(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Số  Khung
                                <Input width='auto' value={mSoKhung} onChange={(e) => setSoKhung(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Số  Máy
                                <Input width='auto' value={mSoMay} onChange={(e) => setSoMay(e.target.value)} />
                        </DivFlexColumn>
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                    {
                        (!item || !item.ma) && <Button width='100px' onClick={() => handleButtonSave()}>
                            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : "Lưu"}
                        </Button>
                    }
                    {
                        item && item.ma && <Button width='100px' onClick={() => handleButtonUpdate()}>
                            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : "Cập nhật"}
                        </Button>
                    }
                </DivFlexRow>
            </ModalContent>
        </Modal>
    )
}

const mapState = (state) => ({
    token: state.Authenticate.token,
})

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, null)(CustomerDetail);