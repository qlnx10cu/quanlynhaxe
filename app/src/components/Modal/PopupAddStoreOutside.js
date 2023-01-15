import React, { useEffect } from "react";
import { DivFlexRow, DivFlexColumn } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import lib from "../../lib";
import utils from "../../lib/utils";
import InputList from "../Styles/InputList";
import { InputNumber, InputValue } from "../Styles";

const PopupAddStoreOutside = (props) => {
    const mNhaCungCap = lib.handleInput("");
    const mTenPhuTung = lib.handleInput("");
    const mDonGia = lib.handleInput(0);
    const mSoLuong = lib.handleInput(1);

    const searchTenPhuTung = (values) => {
        mTenPhuTung.setValue(values);
        const sot = props.storeOutsides.find(function (e) {
            return e.tenphutung.toLowerCase() === values.toLowerCase();
        });

        if (sot) {
            mNhaCungCap.setValue(sot.nhacungcap);
            mDonGia.setValue(sot.dongia);
        } else {
            mNhaCungCap.setValue("");
            mDonGia.setValue(0);
        }
    };

    const handleSubmit = () => {

        if (!mTenPhuTung.value || mTenPhuTung.value.length == 0) {
            return Promise.reject({ error: -1, message: "Phải có tên phụ tùng." });
        }

        if (!mSoLuong.value || mSoLuong.value <= 0) {
            return Promise.reject({ error: -1, message: "số lượng phải >= 0" });
        }

        if (!mDonGia.value || mDonGia.value < 0) {
            return Promise.reject({ error: -1, message: "Đợn gía phải > 0" });
        }

        const newData = {
            loaiphutung: "cuahangngoai",
            maphutung: "",
            tenphutung: mTenPhuTung.value,
            nhacungcap: mNhaCungCap.value,
            dongia: mDonGia.value,
            soluong: mSoLuong.value,
            chietkhau: 0,
            tienchietkhau: 0,
            tiencongchietkhau: 0,
            tiencong: 0,
            thanhtiencong: 0,
            tienpt: utils.tinhTongTien(mDonGia.value, mSoLuong.value),
            thanhtienpt: utils.tinhTongTien(mDonGia.value, mSoLuong.value),
            tongtien: utils.tinhTongTien(mDonGia.value, mSoLuong.value, 0),
        };

        return newData;
    };

    return (
        <ModalWrapper
            open={props.open}
            title={"Cửa hàng ngoài"}
            callback={props.callback}
            onClose={props.onClose}
            submit={() => handleSubmit()}
            titleSubmit={"Thêm"}
        >
            <DivFlexRow>
                <DivFlexColumn style={{ flex: 1 }}>
                    <label>Nhà Cung Cấp </label>
                    <InputValue {...mNhaCungCap} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Tên phụ tùng: </label>
                    <InputList
                        value={mTenPhuTung.value}
                        data={props.storeOutsides}
                        onChange={(e) => searchTenPhuTung(e.target.value)}
                        render={(item, index) => {
                            return (
                                <option key={index} value={item.tenphutung}>
                                    {item.dongia}
                                </option>
                            );
                        }}
                    />
                </DivFlexColumn>
            </DivFlexRow>

            <DivFlexRow>
                <DivFlexColumn style={{ flex: 1 }}>
                    <label>Đơn giá: </label>
                    <InputNumber min={0} {...mDonGia} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Số lượng: </label>
                    <InputNumber min={1} {...mSoLuong} />
                </DivFlexColumn>
            </DivFlexRow>

            <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: "flex-end" }}>
                <label>
                    Tổng tiền:
                    <span style={{ fontWeight: "bold" }}>{utils.formatTongTien(mDonGia.value, mSoLuong.value, 0)}</span>
                </label>
            </DivFlexRow>
        </ModalWrapper>
    );
};

const mapState = (state) => ({
    storeOutsides: state.StoreOutside.data,
});

export default connect(mapState, null)(PopupAddStoreOutside);
