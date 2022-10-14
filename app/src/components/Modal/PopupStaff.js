import React, { useState, useEffect } from "react";
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input, Select } from "../../styles";
import { AddStaff, UpdateStaff } from "../../API/Staffs";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import { addStaff, deleteStaff, getListStaff, updateStaff } from "../../actions/Staffs";
import utils from "../../lib/utils";
import lib from "../../lib";

const PopupStaff = (props) => {
    let mStaffName = lib.handleInput("");
    let mCMND = lib.handleInput("");
    let mSDT = lib.handleInput("");
    let mEmail = lib.handleInput("");
    let mUserName = lib.handleInput("");
    let mPassword = lib.handleInput("");
    let mAccountSip = lib.handleInput("");
    let mRole = lib.handleInput("Dịch Vụ");

    let item = props.item;
    const loai = item ? 1 : 0;

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
        if (loai) return "";
        if (!mUserName.value || mUserName.value.length == 0) return "Tài khoản không được để trống";
        if (!mPassword.value || mPassword.value.length < 6) return "Mật khẩu phải có độ dài 6 kí tự";
        return "";
    };
    const handleButtonSave = (done, fail) => {
        var kt = check();
        if (kt != "") {
            fail(kt);
            return;
        }
        var data = {
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
        props
            .addStaff(data)
            .then(() => {
                done();
            })
            .catch((err) => {
                fail("Tạo nhân viên thất bại \n\n Error:" + err.message);
            });
    };

    const handleButtonUpdate = (done, fail) => {
        var kt = check();
        if (kt != "") {
            props.alert(kt);
            return;
        }
        var data = {
            ten: mStaffName.value,
            cmnd: mCMND.value,
            sdt: mSDT.value,
            gmail: mEmail.value,
            accountsip: mAccountSip.value,
            chucvu: mRole.value,
        };

        props
            .updateStaff(data, item.ma)
            .then(() => {
                done();
            })
            .catch((err) => {
                fail("Tạo nhân viên thất bại \n\n Error:" + err.message);
            });
    };

    const handleButton = (done, fail) => {
        if (item && loai == 1) {
            handleButtonUpdate(done, fail);
        } else {
            handleButtonSave(done, fail);
        }
    };

    return (
        <ModalWrapper
            open={props.open}
            title={"Nhân viên"}
            callback={props.callback}
            onClose={props.onCloseClick}
            submit={(done, fail) => handleButton(done, fail)}
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
                    <If condition={loai == 0}>
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
    addStaff: (data) => addStaff(data),
    updateStaff: (data, ma) => updateStaff(data, ma),
};
export default connect(null, mapDispatch)(PopupStaff);
