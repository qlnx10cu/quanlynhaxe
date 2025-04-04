import React, { useEffect } from "react";
import { DivFlexRow, DivFlexColumn } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import lib from "../../lib";
import utils from "../../lib/utils";
import InputList from "../Styles/InputList";
import { InputNumber, InputValue } from "../Styles";

const PopupAddProduct = (props) => {
    const mMaPhuTung = lib.handleInput("");
    const mTenPhuTung = lib.handleInput("");
    const mDonGia = lib.handleInput(0);
    const mSoLuong = lib.handleInput(1);
    const mTonKho = lib.handleInput(1);

    const searchMaPhuTung = (values) => {
        mMaPhuTung.setValue(values);

        const product = props.listPhuTung.find(function (item) {
            return item.maphutung.toLowerCase() == values.toLowerCase();
        });
        if (product && product.maphutung.toLowerCase() === values.toLowerCase()) {
            mMaPhuTung.setValue(product.maphutung);
            mTenPhuTung.setValue(product.tentiengviet);
            mDonGia.setValue(product.giaban_le);
            mTonKho.setValue(product.soluongtonkho);
            return;
        }

        mTenPhuTung.setValue("");
        mDonGia.setValue(0);
        mTonKho.setValue(0);
        mSoLuong.setValue(1);
    };

    const handleSubmit = () => {
        if (!mMaPhuTung.value || mMaPhuTung.value.length == 0) {
            return Promise.reject({ error: -1, message: "Chưa nhập mã phụ tùng." });
        }

        if (!props.listPhuTung.find((e) => e.maphutung == mMaPhuTung.value)) {
            return Promise.reject({ error: -1, message: "Không tìm thấy mã phụ tùng" });
        }

        if (!mTenPhuTung.value || mTenPhuTung.value.length == 0) {
            return Promise.reject({ error: -1, message: "Phải có tên phụ tùng." });
        }

        if (!mSoLuong.value || mSoLuong.value <= 0) {
            return Promise.reject({ error: -1, message: "số lượng phải > 0" });
        }

        if (!mDonGia.value || mDonGia.value < 0) {
            return Promise.reject({ error: -1, message: "Đợn gía phải >= 0" });
        }

        if (!mTonKho.value || mTonKho.value < mSoLuong.value) {
            return Promise.reject({ error: -1, message: "Số lượng tồn kho không đủ" });
        }

        const newData = {
            loaiphutung: "phutung",
            maphutung: mMaPhuTung.value,
            tenphutung: mTenPhuTung.value,
            nhacungcap: "Trung Trang",
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
                    <label>Tên phụ tùng </label>
                    <InputValue readOnly {...mTenPhuTung} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Mã phụ tùng: </label>
                    <InputList
                        value={mMaPhuTung.value}
                        limitList={20}
                        data={props.listPhuTung}
                        onChange={(e) => searchMaPhuTung(e.target.value)}
                        searchData={(search, item) => utils.searchName(item.maphutung, search) || utils.searchName(item.tentiengviet, search)}
                        render={(item, index) => {
                            return (
                                <option disabled={item.soluongtonkho == 0} key={index} value={item.maphutung}>
                                    {item.tentiengviet} ({item.soluongtonkho})
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
                    <InputNumber min={1} max={mTonKho.value} {...mSoLuong} />
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
    listPhuTung: state.Product.data,
    storeOutsides: state.StoreOutside.data,
});

export default connect(mapState, null)(PopupAddProduct);
