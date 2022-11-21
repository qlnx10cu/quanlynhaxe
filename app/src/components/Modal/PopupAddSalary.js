import React, { useEffect } from "react";
import { DivFlexRow, DivFlexColumn } from "../../styles";
import { connect } from "react-redux";
import ModalWrapper from "../Warrper/ModalWrapper";
import lib from "../../lib";
import utils from "../../lib/utils";
import InputList from "../Styles/InputList";
import { InputNumber, InputValue } from "../Styles";

const PopupAddSalary = (props) => {
    const mTenPhuTung = lib.handleInput("");
    const mDonGia = lib.handleInput(0);

    const searchTenPhuTung = (values) => {
        mTenPhuTung.setValue(values);
        const sot = props.salaries.find(function (e) {
            return utils.comrapeName(e.ten, values);
        });

        if (sot) {
            mDonGia.setValue(sot.tien);
        } else {
            mDonGia.setValue(0);
        }
    };

    const handleSubmit = () => {
        if (!mTenPhuTung.value || mTenPhuTung.value.length == 0) {
            return Promise.reject({ error: -1, message: "Phải có tên phụ tùng." });
        }

        if (!mDonGia.value || mDonGia.value < 0) {
            return Promise.reject({ error: -1, message: "Đơn giá phải >= 0" });
        }

        const newData = {
            loaiphutung: "tiencong",
            maphutung: "",
            tenphutung: mTenPhuTung.value,
            nhacungcap: "Trung Trang",
            dongia: mDonGia.value,
            soluong: 1,
            chietkhau: 0,
            tiencong: mDonGia.value,
            thanhtiencong: mDonGia.value,
            tienpt: 0,
            thanhtienpt: 0,
            tongtien: mDonGia.value,
        };

        return newData;
    };

    return (
        <ModalWrapper
            open={props.open}
            title={"Tiền công"}
            callback={props.callback}
            onClose={props.onClose}
            submit={() => handleSubmit()}
            titleSubmit={"Thêm"}
        >
            <DivFlexRow>
                <DivFlexColumn style={{ flex: 1 }}>
                    <label>Đơn giá:  </label>
                    <InputNumber min={0} {...mDonGia} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Tên phụ tùng: </label>
                    <InputList
                        value={mTenPhuTung.value}
                        data={props.salaries}
                        onChange={(e) => searchTenPhuTung(e.target.value)}
                        render={(item, index) => {
                            return (
                                <option key={index} value={item.ten}>
                                    {item.tien}
                                </option>
                            );
                        }}
                    />
                </DivFlexColumn>
            </DivFlexRow>
        </ModalWrapper>
    );
};

const mapState = (state) => ({
    salaries: state.Salary.data,
});
export default connect(mapState, null)(PopupAddSalary);
