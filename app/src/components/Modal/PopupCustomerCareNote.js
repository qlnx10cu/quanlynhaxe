import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DivFlexColumn, DivFlexRow, Input, Select, Textarea } from "../../styles";
import lib from "../../lib";
import utils from "../../lib/utils";
import ModalWrapper from "../Warrper/ModalWrapper";
import CustomerCareApi from "../../API/CustomerCareApi";

const PopupCustomerCareNote = (props) => {
    const mTrangThai = lib.handleInput(0);
    const mNote = lib.handleInput("");
    const item = props.item;

    useEffect(() => {
        if (!item) return;
        mTrangThai.setValue(item.trangthai);
        mNote.setValue(item.ghichu);
    }, []);

    const handleSubmit = () => {
        if (!item || !item.ma) {
            return Promise.reject({ error: -1, message: "Not found data" });
        }
        var data = {
            ma: item.ma,
            ghichu: mNote.value,
            trangthai: mTrangThai.value || 0,
        };
        return CustomerCareApi.update(data.ma, data).then(() => {
            props.alert("Update thành công");
        });
    };

    return (
        <ModalWrapper open={props.open} title={""} callback={props.callback} onClose={props.onClose} submit={handleSubmit}>
            <DivFlexRow style={{ marginTop: 10, width: "100%" }}>
                <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                    Tên Khách Hàng
                    <Input readOnly width="auto" value={item.tenkh || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                    Số Điện Thoại
                    <Input readOnly width="auto" value={item.sodienthoai || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                    Hóa đơn
                    <Input readOnly width="auto" value={item.mahoadon || ""} />
                </DivFlexColumn>
                <DivFlexColumn style={{ fontSize: 20, marginLeft: 20, marginBottom: 2 }}>
                    Trạng thái
                    <Select width="auto" {...mTrangThai}>
                        <option value="0">{utils.getTrangThaiChamSoc(0)}</option>
                        <option value="1">{utils.getTrangThaiChamSoc(1)}</option>
                        <option value="2">{utils.getTrangThaiChamSoc(2)}</option>
                        <option value="3">{utils.getTrangThaiChamSoc(3)}</option>
                    </Select>
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 10, width: "100%" }}>
                <DivFlexColumn style={{ fontSize: 20, marginBottom: 2 }}>
                    Ghi chú
                    <Textarea width="100%" {...mNote} />
                </DivFlexColumn>
            </DivFlexRow>
        </ModalWrapper>
    );
};

export default connect(null, null)(PopupCustomerCareNote);
