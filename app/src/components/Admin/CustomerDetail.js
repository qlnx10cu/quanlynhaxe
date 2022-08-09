import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input, Select } from '../../styles'
// import { showNoti } from '../../../Actions/Notification';
import { AddCustomer, UpdateCustomer } from '../../API/Customer'
import { connect } from 'react-redux'

const ListThanhPho = ['An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hồ Chí Minh', 'Hoà Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'];

const CustomerDetail = (props) => {

    let [isUpload, setUpload] = useState(false);
    let [mCustomerName, setCustomerName] = useState("");
    let [mSDT, setSDT] = useState("");
    let [mAddress, setAddress] = useState("");
    let [mSoXe, setSoXe] = useState("");
    let [mLoaiXe, setLoaiXe] = useState("");
    let [mSoKhung, setSoKhung] = useState("");
    let [mSoMay, setSoMay] = useState("");
    let [mGioiTinh, setGioiTinh] = useState("");
    let [mThanhPho, setThanhPho] = useState("An Giang");

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
            setGioiTinh(item.gioitinh || 'Nam');
            setThanhPho(item.thanhpho);
        }
        else {
            setCustomerName('');
            setSDT('');
            setAddress('');
            setSoXe('');
            setLoaiXe('');
            setSoKhung('');
            setSoMay('');
            setGioiTinh('Nam');
            setThanhPho('An Giang');
        }
    }, [item])

    const handleButtonSave = () => {
        if (mSoXe == "") {
            props.alert("Không thể để biển số xe trống");
            return;
        }
        var data = {
            ten: mCustomerName,
            sodienthoai: mSDT,
            diachi: mAddress,
            biensoxe: mSoXe,
            loaixe: mLoaiXe,
            sokhung: mSoKhung,
            somay: mSoMay,
            gioitinh: mGioiTinh || 'Nam',
            thanhpho: mThanhPho || 'An Giang',
        }
        setUpload(true);
        AddCustomer(props.token, data).then(Response => {
            setUpload(false);
            props.onCloseClick(true);
        }).catch(err => {
            setUpload(false);
            props.alert("Tạo thông tin khách hàng thất bại \n Error:" + err.response.data.error.message);
        });
    };
    const handleButtonUpdate = () => {
        if (mSoXe == "") {
            props.alert("Không thể để biển số xe trống");
            return;
        }
        var data = {
            ten: mCustomerName,
            sodienthoai: mSDT,
            diachi: mAddress,
            biensoxe: mSoXe,
            loaixe: mLoaiXe,
            sokhung: mSoKhung,
            somay: mSoMay,
            gioitinh: mGioiTinh || 'Nam',
            thanhpho: mThanhPho
        }
        setUpload(true);
        UpdateCustomer(props.token, data, item.ma).then(Response => {
            setUpload(false);
            props.onCloseClick(true);
        }).catch(err => {
            setUpload(false);
            props.alert("Cập nhập tài khoản thất bại \n Error:" + err.response.data.error.message);
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
                    <DivFlexColumn style={{ marginLeft: 25, width: "100%" }}>
                        <DivFlexRow style={{ justifyContent: 'space-between' }}>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, width: "100%" }}>
                                Tên Khách Hàng
                                <Input width='auto' value={mCustomerName} onChange={(e) => setCustomerName(e.target.value)} />
                            </DivFlexColumn>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, marginLeft: 50, width: "100%" }}>
                                Số Điện Thoại
                                <Input width='auto' type="Number" value={mSDT} onChange={(e) => setSDT(e.target.value)} />
                            </DivFlexColumn>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, marginLeft: 50, width: "100%" }}>
                                Giói tính
                                <Select width='auto' value={mGioiTinh} onChange={(e) => setGioiTinh(e.target.value)}>
                                    <option value='0'>Nam</option>
                                    <option value='1'>Nữ</option>
                                </Select>
                            </DivFlexColumn>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, marginLeft: 50, width: "100%" }}>
                                Thành phố
                            <Select autocomplete="off" width='100%' value={mThanhPho} onChange={(e) => setThanhPho(e.target.value)}>
                                    {ListThanhPho.map((item, index) => (
                                        <option key={index} value={item} >{item}</option>
                                    ))}
                                </Select>
                            </DivFlexColumn>
                        </DivFlexRow>

                        <DivFlexRow style={{ justifyContent: 'space-between' }}>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 5, width: "100%" }}>
                                Địa Chỉ
                                <Input width='auto' value={mAddress} onChange={(e) => setAddress(e.target.value)} />
                            </DivFlexColumn>
                        </DivFlexRow>
                        <DivFlexRow style={{ justifyContent: 'space-between' }}>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, width: "100%" }}>
                                Biển Số Xe
                                <Input width='auto' value={mSoXe} onChange={(e) => setSoXe(e.target.value)} />
                            </DivFlexColumn>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, marginLeft: 50, width: "100%" }}>
                                Loại Xe
                                <Input width='auto' value={mLoaiXe} onChange={(e) => setLoaiXe(e.target.value)} />
                            </DivFlexColumn>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, marginLeft: 50, width: "100%" }}>
                                Số  Khung
                                <Input width='auto' value={mSoKhung} onChange={(e) => setSoKhung(e.target.value)} />
                            </DivFlexColumn>
                            <DivFlexColumn style={{ fontSize: 20, marginBottom: 2, marginLeft: 50, width: "100%" }}>
                                Số  Máy
                                <Input width='auto' value={mSoMay} onChange={(e) => setSoMay(e.target.value)} />
                            </DivFlexColumn>
                        </DivFlexRow>
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                    {
                        (!item || !item.ma) && <Button width='200px' onClick={() => handleButtonSave()}>
                            {isUpload ? "" : "Tạo khách hàng"}
                            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus"></i>}
                        </Button>
                    }
                    {
                        item && item.ma && <Button width='150px' onClick={() => handleButtonUpdate()}>
                            {isUpload ? "" : "Cập nhật"}
                            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-edit"></i>}
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