import React, { useState, useEffect } from "react";
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import * as actions from "../../actions";
import lib from "../../lib";

const PopupStoreOutside = (props) => {
    const mName = lib.handleInput("");
    const mSupplier = lib.handleInput("");
    const mPrice = lib.handleInput(0);
    const mNote = lib.handleInput("");

    const item = props.item;
    const isUpdate = item ? 1 : 0;

    useEffect(() => {
        if (!item) return;
        mName.setValue(item.tenphutung);
        mSupplier.setValue(item.nhacungcap);
        mPrice.setValue(item.dongia);
        mNote.setValue(item.ghichu);
    }, []);

    const check = () => {
        if (!mName.value || mName.value.length == 0) return "Tên không được để trống";
        if (!mSupplier.value || mSupplier.value.length == 0) return "Nhà cung cấp không được để trống";
        if (mPrice.value <= 0) return "Tiền công phải lớn hơn 0";
        return "";
    };

    const handleButtonSave = () => {
        const kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        const data = {
            tenphutung: mName.value,
            nhacungcap: mSupplier.value,
            dongia: mPrice.value,
            ghichu: mNote.value,
        };

        return props.addStoreOutside(data).then((res) => {
            props.alert("Thêm thành công.");
        });
    };

    const handleButtonUpdate = () => {
        const kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        const data = {
            dongia: mPrice.value,
            ghichu: mNote.value,
        };

        return props.updateStoreOutside(item.tenphutung, item.nhacungcap, data).then((res) => {
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
                    <DivFlexRow style={{ width: "100%" }}>
                        <DivFlexColumn style={{ flex: 1 }}>
                            <label>Tên phụ tùng</label>
                            <Input {...mName} readOnly={isUpdate} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                            <label>Nhà cung cấp</label>
                            <Input {...mSupplier} readOnly={isUpdate} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                            <label>Đơn giá</label>
                            <Input type={"number"} {...mPrice} />
                        </DivFlexColumn>
                    </DivFlexRow>

                    <DivFlexRow style={{ width: "100%" }}>
                        <DivFlexColumn style={{ flex: 1 }}>
                            <label>Ghi chú</label>
                            <Input {...mNote} />
                        </DivFlexColumn>
                    </DivFlexRow>
                </DivFlexColumn>
            </DivFlexRow>
        </ModalWrapper>
    );
};

const mapDispatch = {
    addStoreOutside: (data) => actions.StoreOutsideAction.addStoreOutside(data),
    updateStoreOutside: (tenphutung, nhacungcap, data) => actions.StoreOutsideAction.updateStoreOutside(tenphutung, nhacungcap, data),
};
export default connect(null, mapDispatch)(PopupStoreOutside);
