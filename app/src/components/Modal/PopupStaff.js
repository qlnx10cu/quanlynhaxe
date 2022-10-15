import React, { useEffect } from "react";
import { DivFlexRow, DivFlexColumn, Input, Select } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import * as actions from "../../actions";
import lib from "../../lib";

const PopupStaff = (props) => {
    const mStaffName = lib.handleInput("");
    const mCMND = lib.handleInput("");
    const mSDT = lib.handleInput("");
    const mEmail = lib.handleInput("");
    const mUserName = lib.handleInput("");
    const mPassword = lib.handleInput("");
    const mAccountSip = lib.handleInput("");
    const mRole = lib.handleInput("Dịch Vụ");

    const item = props.item;
    const isUpdate = item ? 1 : 0;

    useEffect(() => {
        if (!item) return;
        mStaffName.setValue(item.ten);
        mCMND.setValue(item.cmnd);
        mSDT.setValue(item.sdt);
        mEmail.setValue(item.gmail);
        mUserName.setValue(item.username);
        mAccountSip.setValue(item.accountsip || "");
        mRole.setValue(item.chucvu);
    }, []);

    const check = () => {
        if (!mStaffName.value || mStaffName.value.length == 0) return "Tên nhân viên không được để trống";
        if (isUpdate) return "";
        if (!mUserName.value || mUserName.value.length == 0) return "Tài khoản không được để trống";
        if (!mPassword.value || mPassword.value.length < 6) return "Mật khẩu phải có độ dài 6 kí tự";
        return "";
    };
    const handleButtonSave = () => {
        const kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        const data = {
            ma: mUserName.value,
            ten: mStaffName.value,
            cmnd: mCMND.value,
            sdt: mSDT.value,
            gmail: mEmail.value,
            username: mUserName.value,
            password: mPassword.value,
            accountsip: mAccountSip.value,
            chucvu: mRole.value,
        };
        return props.addStaff(data).then((res) => {
            props.alert("Thêm nhân viên thành công.");
        });
    };

    const handleButtonUpdate = () => {
        const kt = check();

        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        const data = {
            ten: mStaffName.value,
            cmnd: mCMND.value,
            sdt: mSDT.value,
            gmail: mEmail.value,
            accountsip: mAccountSip.value,
            chucvu: mRole.value,
        };

        return props.updateStaff(item.ma, data).then((res) => {
            props.alert("Update nhân viên thành công.");
        });
    };

    const handleButton = () => {
        if (item && isUpdate == 1) {
            return handleButtonUpdate();
        }
        return handleButtonSave();
    };

    return (
        <ModalWrapper
            open={props.open}
            title={"Nhân viên"}
            callback={props.callback}
            onClose={props.onClose}
            submit={() => handleButton()}
            titleSubmit={isUpdate ? "Cập nhật" : "Thêm"}
        >
            <DivFlexRow style={{ marginTop: 10 }}>
                <DivFlexColumn style={{ marginLeft: 25, width: "100%" }}>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Tên Nhân Viên
                        <Input width="auto" {...mStaffName} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Số CMND
                        <Input width="auto" type="Number" {...mCMND} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 5 }}>
                        Số Điên Thoại
                        <Input width="auto" type="Number" {...mSDT} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Email
                        <Input type="Email" width="auto" {...mEmail} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 5 }}>
                        Account Sip
                        <Input width="auto" {...mAccountSip} />
                    </DivFlexColumn>
                    <If condition={isUpdate == 0}>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Tên Đăng Nhập
                            <Input width="auto" {...mUserName} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                            Mật khẩu
                            <Input type="Password" width="auto" {...mPassword} />
                        </DivFlexColumn>
                    </If>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                        Chức Vụ
                        <Select {...mRole}>
                            <option value="Dịch Vụ">Dịch Vụ</option>
                            <option value="Phụ Tùng">Phụ Tùng</option>
                            <option value="Sửa Chữa">Sửa Chữa</option>
                            <option value="Văn Phòng">Văn Phòng</option>
                            <option value="CSKH">CSKH</option>
                        </Select>
                    </DivFlexColumn>
                </DivFlexColumn>
            </DivFlexRow>
        </ModalWrapper>
    );
};

const mapDispatch = {
    addStaff: (data) => actions.StaffAction.addStaff(data),
    updateStaff: (ma, data) => actions.StaffAction.updateStaff(ma, data),
};
export default connect(null, mapDispatch)(PopupStaff);
