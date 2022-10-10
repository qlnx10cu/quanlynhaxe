import React, { useState, useEffect } from "react";
import { Modal, ModalContent, DivFlexColumn, Input, DivFlexRow, Button, DelButton } from "../../styles";
import lib from "../../lib";
import { connect } from "react-redux";
import { addBillProduct } from "../../actions/Product";
import utils from "../../lib/utils";
import ButtonClose from "../Warrper/ButtonClose";

const PopupAccessory = (props) => {
    let mTenCongViec = lib.handleInput("");
    let mMaPhuTung = lib.handleInput("");
    let mDonGia = lib.handleInput(0);
    let mSoLuong = lib.handleInput(1);
    let mTonKho = lib.handleInput(0);
    let [mDataList, setDataList] = useState([]);

    const searchMaPhuTung = (values) => {
        if (values === "") {
            SliceTop20(props.listProduct);
            return;
        }
        let product = props.listProduct.filter(function (item) {
            return item.maphutung.toLowerCase().includes(values.toLowerCase()) || item.tentiengviet.toLowerCase().includes(values.toLowerCase());
        });
        if (product.length !== 0) {
            if (product.length === 1 && product[0].maphutung === values) {
                mMaPhuTung.setValue(product[0].maphutung);
                mTenCongViec.setValue(product[0].tentiengviet);
                mDonGia.setValue(product[0].giaban_le);
                mTonKho.setValue(product[0].soluongtonkho);
                mSoLuong.setValue(1);
            } else {
                SliceTop20(product);
                mTenCongViec.setValue("");
                mTonKho.setValue("");
            }
        }
    };

    useEffect(() => {
        if (props.isShowing && props.listProduct) {
            SliceTop20(props.listProduct);
        }
    }, [props.isShowing, props.listProduct]);

    const SliceTop20 = (list) => {
        setDataList(list.slice(0, 20));
    };

    const handleAdd = () => {
        if (!mMaPhuTung.value || mMaPhuTung.value === "") {
            props.alert("Chưa nhập mã phụ tùng");
            return;
        }

        if (!props.listProduct.find((e) => e.maphutung == mMaPhuTung.value)) {
            props.alert("Không tìm thấy mã phụ tùng");
            return;
        }

        if (!mTenCongViec || mTenCongViec.value === "" || !mDonGia || !mDonGia.value || mDonGia.value < 0) {
            props.alert("phụ tùng không hợp lệ");
            return;
        }

        if (!mSoLuong.value || mSoLuong.value <= 0) {
            props.alert("Phải nhập số lượng");
            return;
        }
        if (mSoLuong.value > mTonKho.value) {
            props.alert("Số lượng lón hơn tồn kho hiện tai");
            return;
        }

        var data = {
            key: props.listBillProduct.length + 1,
            loaiphutung: "phutung",
            tenphutungvacongviec: mTenCongViec.value,
            maphutung: mMaPhuTung.value,
            chietkhau: 0,
            tienpt: utils.tinhTongTien(mDonGia.value, mSoLuong.value),
            dongia: utils.parseInt(mDonGia.value),
            soluongphutung: utils.parseInt(mSoLuong.value),
            tiencong: 0,
            thanhtiencong: 0,
            thanhtienpt: utils.tinhTongTien(mDonGia.value, mSoLuong.value),
            tongtien: utils.tinhTongTien(mDonGia.value, mSoLuong.value),
            nhacungcap: "Trung Trang",
        };
        props.addItemToProduct(data, true);
        mTenCongViec.setValue("");
        mMaPhuTung.setValue("");
        mDonGia.setValue("");
        mSoLuong.setValue("");
        mTonKho.setValue("");
        mDonGia.setValue("");
        props.onCloseClick();
    };

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <h2 style={{ textAlign: "center" }}>Bảng giá (STT: {props.STT})</h2>
                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Tên phụ tùng và công việc: </label>
                        <Input {...mTenCongViec} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Mã phụ tùng: </label>
                        <Input
                            list="browsers"
                            name="browser"
                            value={mMaPhuTung.value}
                            onChange={(e) => {
                                mDonGia.setValue("");
                                mTenCongViec.setValue("");
                                mTonKho.setValue(0);
                                mSoLuong.setValue(1);
                                mMaPhuTung.setValue(e.target.value);
                                searchMaPhuTung(e.target.value);
                            }}
                        />
                        <datalist id="browsers">
                            {mDataList.map((item, index) => (
                                <option disabled={item.soluongtonkho === 0} key={index} value={item.maphutung}>
                                    {item.tentiengviet} ({item.soluongtonkho})
                                </option>
                            ))}
                        </datalist>
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Đơn giá: </label>
                        <Input readOnly {...mDonGia} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Số lượng: </label>
                        <Input type="Number" max={mTonKho.value} min={1} {...mSoLuong} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: "flex-end" }}>
                    <label>
                        Tổng tiền: <span style={{ fontWeight: "bold" }}>{utils.formatVND(utils.tinhTongTien(mDonGia.value, mSoLuong.value))}</span>
                    </label>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: "flex-end" }}>
                    <ButtonClose onClick={props.onCloseClick}></ButtonClose>
                    <Button style={{ marginLeft: 10 }} onClick={handleAdd}>
                        Thêm
                    </Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};
const mapState = (state) => ({
    token: state.Authenticate.token,
    listBillProduct: state.Product.listBillProduct,
});
const mapDispatch = (dispatch) => ({
    addBillProduct: (data) => {
        dispatch(addBillProduct(data));
    },
});

export default connect(mapState, mapDispatch)(PopupAccessory);
