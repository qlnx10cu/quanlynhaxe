import React from "react";
import { DivFlexRow, Button } from "../../styles";
import { connect } from "react-redux";
import { InputValue } from "../Styles";
import { CheckUpdateBill } from "../../API/Bill";
import lib from "../../lib";
import ModalWrapper from "../Warrper/ModalWrapper";

const PopupConfirmBill = (props) => {
    const useIsMounted = lib.useIsMounted();
    const mBarCode = lib.handleInput("");
    const item = props.item || {};

    const UpdateHoaDon = (mahoadon, loai) => {
        var date = new Date();
        let url = "";
        if (loai == 0) {
            url = `/services/updatebill?mahoadon=${mahoadon}`;
        }
        if (loai == 1) {
            url = `/banle?mahoadon=${mahoadon}`;
        }
        props.history.push(url, { tokenTime: date.getTime(), mhdToken: mahoadon });
    };

    const handleSubmit = () => {
        if (!mBarCode.value || !item || !item.mahoadon) {
            props.alert("vui lòng nhập mã code");
            return;
        }

        return CheckUpdateBill(props.token, { ma: mBarCode.value, mahoadon: item.mahoadon }).then((res) => {
            if (!useIsMounted()) return;
            if (res && res.data && res.data.error && res.data.error >= 1) {
                mBarCode.setValue("");
                UpdateHoaDon(item.mahoadon, item.loaihoadon);
            } else {
                props.alert("Mã code không đúng, vui lòng nhập lại");
            }
        });
    };

    return (
        <ModalWrapper open={props.open} title={""} callback={props.callback} onClose={props.onClose} titleSubmit={"Thay đổi"}>
            <h3 style={{ textAlign: "center" }}>HEAD TRUNG TRANG</h3>
            <h4 style={{ textAlign: "center" }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
            <h5 style={{ textAlign: "center" }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
            <DivFlexRow style={{ alignItems: "center", textAlign: "center" }}>
                <label>Nhập barcode: </label>
                <InputValue type="password" autocomplete="off" onEnter={handleSubmit} style={{ marginLeft: 10 }} {...mBarCode} />
                <Button style={{ marginLeft: 10 }} onClick={handleSubmit}>
                    Thay đổi
                </Button>
            </DivFlexRow>
        </ModalWrapper>
    );
};

export default connect(null, null)(PopupConfirmBill);
