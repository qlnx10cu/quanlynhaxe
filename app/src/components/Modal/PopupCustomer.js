import React, { useEffect } from "react";
import { DivFlexRow, DivFlexColumn, Input } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import * as actions from "../../actions";
import lib from "../../lib";
import { ButtonCall, ButtonChatZalo, InputCity, InputGioiTinh } from "../Styles";

const PopupCustomer = (props) => {
    const mCustomerName = lib.handleInput("");
    const mSDT = lib.handleInput("");
    const mAddress = lib.handleInput("");
    const mSoXe = lib.handleInput("");
    const mLoaiXe = lib.handleInput("");
    const mSoKhung = lib.handleInput("");
    const mSoMay = lib.handleInput("");
    const mGioiTinh = lib.handleInput(0);
    const mThanhPho = lib.handleInput("An Giang");
    const mZaloId = lib.handleInput("");

    const item = props.item;
    const isUpdate = item ? 1 : 0;

    useEffect(() => {
        if (!item) return;
        mCustomerName.setValue(item.ten);
        mSDT.setValue(item.sodienthoai);
        mAddress.setValue(item.diachi);
        mSoXe.setValue(item.biensoxe);
        mLoaiXe.setValue(item.loaixe);
        mSoKhung.setValue(item.sokhung);
        mSoMay.setValue(item.somay);
        mGioiTinh.setValue(item.gioitinh || 0);
        mThanhPho.setValue(item.thanhpho);
        mZaloId.setValue(item.zaloid);
    }, []);

    const check = () => {
        if (!mCustomerName.value || mCustomerName.value.length == 0) return "Tên khách hàng không được để trống";
        return "";
    };
    const getData = () => {
        const data = {
            ten: mCustomerName.value,
            sodienthoai: mSDT.value,
            diachi: mAddress.value,
            biensoxe: mSoXe.value,
            loaixe: mLoaiXe.value,
            sokhung: mSoKhung.value,
            somay: mSoMay.value,
            zaloid: mZaloId.value,
            gioitinh: mGioiTinh.value || 0,
            thanhpho: mThanhPho.value || "An Giang",
        };

        return data;
    };

    const handleButtonSave = () => {
        const kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        const data = getData();
        return props.addCustomer(data).then((res) => {
            props.alert("Thêm thành công.");
        });
    };

    const handleButtonUpdate = () => {
        const kt = check();
        if (kt != "") {
            return Promise.reject({ error: -1, message: kt });
        }
        const data = getData();

        return props.updateCustomer(item.ma, data).then((res) => {
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
            title={"Khách hàng"}
            callback={props.callback}
            onClose={props.onClose}
            submit={() => handleButton()}
            titleSubmit={isUpdate ? "Cập nhật" : "Thêm"}
        >
            <DivFlexColumn style={{ width: "100%" }}>
                <DivFlexRow style={{ justifyContent: "space-between", width: "100%", fontSize: 14, marginBottom: 2 }}>
                    <DivFlexColumn>
                        Tên Khách Hàng
                        <Input {...mCustomerName} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Số Điện Thoại
                        <Input {...mSDT} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Zalo Id
                        <Input {...mZaloId} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Giói tính
                        <InputGioiTinh {...mGioiTinh} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Thành phố
                        <InputCity {...mThanhPho} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ justifyContent: "space-between", width: "100%", fontSize: 14, marginBottom: 2 }}>
                    <DivFlexColumn>
                        Biển Số Xe
                        <Input {...mSoXe} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Loại Xe
                        <Input {...mLoaiXe} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Số Khung
                        <Input {...mSoKhung} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Số Máy
                        <Input {...mSoMay} />
                    </DivFlexColumn>
                    <DivFlexColumn>
                        Địa Chỉ
                        <Input {...mAddress} />
                    </DivFlexColumn>
                </DivFlexRow>
            </DivFlexColumn>
        </ModalWrapper>
    );
};

const mapDispatch = {
    addCustomer: (data) => actions.CustomerAction.addCustomer(data),
    updateCustomer: (ma, data) => actions.CustomerAction.updateCustomer(ma, data),
};
export default connect(null, mapDispatch)(PopupCustomer);
