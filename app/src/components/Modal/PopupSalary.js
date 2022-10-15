import React, { useState, useEffect } from "react";
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import * as actions from "../../actions";
import lib from "../../lib";

const PopupSalary = (props) => {
    const mName = lib.handleInput("");
    const mPrice = lib.handleInput(0);

    const item = props.item;
    const isUpdate = item ? 1 : 0;

    useEffect(() => {
        if (!item) return;
        mName.setValue(item.ten);
        mPrice.setValue(item.tien);
    }, []);

    const check = () => {
        if (!mName.value || mName.value.length == 0) return "Tên không được để trống";
        if (mPrice.value <= 0) return "Tiền công phải lớn hơn 0";
        return "";
    };
    const handleButtonSave = () => {
        var kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        var data = {
            ten: mName.value,
            tien: mPrice.value,
        };
        return props.addSalary(data).then((res) => {
            props.alert("Thêm thành công.");
        });
    };

    const handleButtonUpdate = () => {
        var kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        var data = {
            ten: mName.value,
            tien: mPrice.value,
        };

        return props.updateSalary(item.ma, data).then((res) => {
            props.alert("Update thành công.");
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
            title={"Tiền công"}
            callback={props.callback}
            onClose={props.onClose}
            submit={() => handleButton()}
            titleSubmit={isUpdate ? "Cập nhật" : "Thêm"}
        >
            <DivFlexRow style={{ marginTop: 10 }}>
                <DivFlexColumn style={{ marginLeft: 25, width: "100%" }}>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 10 }}>
                        Tên Dịch Vụ
                        <Input width="auto" {...mName} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ fontSize: 20, marginBottom: 10 }}>
                        Giá Tiền
                        <Input type="Number" width="auto" {...mPrice} />
                    </DivFlexColumn>
                </DivFlexColumn>
            </DivFlexRow>
        </ModalWrapper>
    );
};

const mapDispatch = {
    addSalary: (data) => actions.SalaryAction.addSalary(data),
    updateSalary: (ma, data) => actions.SalaryAction.updateSalary(ma, data),
};
export default connect(null, mapDispatch)(PopupSalary);
