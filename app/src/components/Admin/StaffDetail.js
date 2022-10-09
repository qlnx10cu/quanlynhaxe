import React, { useState, useEffect } from "react";
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input, Select } from "../../styles";
// import { showNoti } from '../../../Actions/Notification';
import { AddStaff, UpdateStaff } from "../../API/Staffs";
import { connect } from "react-redux";

const StaffDetail = (props) => {
    let [isUpload, setUpload] = useState(false);
    let [mStaffName, setStaffName] = useState("");
    let [mCMND, setCMND] = useState("");
    let [mSDT, setSDT] = useState("");
    let [mEmail, setEmail] = useState("");
    let [mUserName, setUserName] = useState("");
    let [mPassword, setPassword] = useState("");
    let [mAccountSip, setAccountSip] = useState("");
    let [mRole, setRole] = useState("Dịch Vụ");
    let item = props.editItem;
    useEffect(() => {
        setStaffName("");
        setCMND("");
        setSDT("");
        setEmail("");
        setRole("Dịch Vụ");
        setAccountSip("");
        setUserName("");

        if (item) {
            setStaffName(item.ten);
            setCMND(item.cmnd);
            setSDT(item.sdt);
            setEmail(item.gmail);
            setRole(item.chucvu);
            setAccountSip(item.accountsip);
            setUserName(item.username);
        }
    }, [item]);
    const check = (loai) => {
        if (!mStaffName || mStaffName.length == 0) return "Tên nhân viên không được để trống";
        if (loai) return "";
        if (!mUserName || mUserName.length == 0) return "Tài khoản không được để trống";
        if (!mPassword || mPassword.length == 0) return "Mật khẩu không được để trống";
        if (mPassword.length < 6) return "Mật khẩu phải có độ dài 6 kí tự";
        return "";
    };
    const handleButtonSave = () => {
        var kt = check(0);
        if (kt != "") {
            props.alert(kt);
            return;
        }
        var data = {
            ma: mUserName,
            ten: mStaffName,
            cmnd: mCMND,
            sdt: mSDT,
            gmail: mEmail,
            username: mUserName,
            password: mPassword,
            accountsip: mAccountSip,
            chucvu: mRole,
        };
        setUpload(true);
        AddStaff(props.token, data)
            .then((Response) => {
                setUpload(false);
                props.onCloseClick();
            })
            .catch((err) => {
                setUpload(false);
                props.alert("Tạo nhân viên thất bại \n\n Error:" + err.response.data.error.message);
            });
    };

    const handleButtonUpdate = () => {
        var kt = check(1);
        if (kt != "") {
            props.alert(kt);
            return;
        }
        var data = {
            ten: mStaffName,
            cmnd: mCMND,
            sdt: mSDT,
            gmail: mEmail,
            accountsip: mAccountSip,
            chucvu: mRole,
        };
        setUpload(true);
        UpdateStaff(props.token, data, item.ma)
            .then((Response) => {
                setUpload(false);
                props.onCloseClick();
            })
            .catch((err) => {
                setUpload(false);
                props.alert("Cập nhập nhân viên thất bại \n\n Error:" + err.response.data.error.message);
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
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Tên Nhân Viên
                            <Input width="auto" value={mStaffName} onChange={(e) => setStaffName(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Số CMND
                            <Input width="auto" type="Number" value={mCMND} onChange={(e) => setCMND(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 5 }}>
                            Số Điên Thoại
                            <Input width="auto" type="Number" value={mSDT} onChange={(e) => setSDT(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Email
                            <Input type="Email" width="auto" value={mEmail} onChange={(e) => setEmail(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 5 }}>
                            Account Sip
                            <Input width="auto" type="" value={mAccountSip} onChange={(e) => setAccountSip(e.target.value)} />
                        </DivFlexColumn>
                        {!item && (
                            <React.Fragment>
                                <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                                    Tên Đăng Nhập
                                    <Input width="auto" value={mUserName} onChange={(e) => setUserName(e.target.value)} />
                                </DivFlexColumn>
                                <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                                    Mật khẩu
                                    <Input type="Password" width="auto" value={mPassword} onChange={(e) => setPassword(e.target.value)} />
                                </DivFlexColumn>
                            </React.Fragment>
                        )}
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Chức Vụ
                            <Select value={mRole} onChange={(e) => setRole(e.target.value)}>
                                <option value="Dịch Vụ">Dịch Vụ</option>
                                <option value="Phụ Tùng">Phụ Tùng</option>
                                <option value="Sửa Chữa">Sửa Chữa</option>
                                <option value="Văn Phòng">Văn Phòng</option>
                                <option value="CSKH">CSKH</option>
                            </Select>
                        </DivFlexColumn>
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ justifyContent: "flex-end" }}>
                    {!item && (
                        <Button width="100px" onClick={() => handleButtonSave()}>
                            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : "Lưu"}
                        </Button>
                    )}
                    {item && (
                        <Button width="100px" onClick={() => handleButtonUpdate()}>
                            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : "Cập nhật"}
                        </Button>
                    )}
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};

const mapState = (state) => ({
    token: state.Authenticate.token,
});

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, null)(StaffDetail);
