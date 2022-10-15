import React, { useState, useEffect } from "react";
import { Modal, ModalContent, DivFlexColumn, Input, DivFlexRow, Button, DelButton } from "../../styles";
import { connect } from "react-redux";
import { addBillProduct } from "../../actions/Product";
import utils from "../../lib/utils";
import ButtonClose from "../Warrper/ButtonClose";
import InputList from "../Styles/InputList";

const PopupBillCHN = (props) => {
    let [nhacungcap, setNhaCungCap] = useState("");
    let [tenphutung, setTenPhuTung] = useState("");
    let [dongia, setDonGia] = useState(0);
    let [soluong, setSoLuong] = useState(1);

    const searchTenPhuTung = (values) => {
        setTenPhuTung(values);
        let item = null;
        item = props.storeOutsides.find(function (e) {
            return e.tenphutung.toLowerCase() === values.toLowerCase();
        });

        if (item) {
            setNhaCungCap(item.nhacungcap);
            setDonGia(item.dongia);
            setSoLuong(1);
        } else {
            setNhaCungCap("");
            setDonGia(0);
            setSoLuong(1);
        }
    };

    const handleAdd = () => {
        if (tenphutung === "") {
            props.alert("Phải có tên phụ tùng");
            return;
        }

        if (!dongia || dongia < 0) {
            props.alert("Đơn giá phải >= 0");
            return;
        }

        if (!soluong || soluong <= 0) {
            props.alert("Số  lượng phải > 0");
            return;
        }

        if (!nhacungcap || nhacungcap === "") {
            props.alert("Phải có nhà cung cấp");
            return;
        }

        var data = {
            key: props.listBillProduct.length + 1,
            loaiphutung: "cuahangngoai",
            tenphutungvacongviec: tenphutung,
            maphutung: "",
            dongia: utils.parseInt(dongia),
            chietkhau: 0,
            soluongphutung: utils.parseInt(soluong),
            tienpt: utils.tinhTongTien(dongia, soluong),
            tiencong: 0,
            thanhtiencong: 0,
            thanhtienpt: utils.tinhTongTien(dongia, soluong),
            tongtien: utils.tinhTongTien(dongia, soluong),
            nhacungcap: nhacungcap,
        };
        props.addItemToProduct(data, true);
        clearData();
        props.onCloseClick();
    };

    const clearData = () => {
        setNhaCungCap("");
        setTenPhuTung("");
        setDonGia("");
        setSoLuong(1);
    };

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Nhà Cung Cấp </label>
                        <Input value={nhacungcap} onChange={(e) => setNhaCungCap(e.target.value)} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Tên phụ tùng: </label>
                        <InputList
                            list="phu_tung"
                            name="phu_tung"
                            value={tenphutung}
                            onChange={(e) => searchTenPhuTung(e.target.value)}
                            listRender={props.storeOutsides.map((item, index) => (
                                <option key={index} value={item.tenphutung}>
                                    {item.dongia}
                                </option>
                            ))}
                        />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Đơn giá: </label>
                        <Input type={"Number"} value={dongia} onChange={(e) => setDonGia(e.target.value)} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Số lượng: </label>
                        <Input value={soluong} onChange={(e) => setSoLuong(e.target.value)} type={"Number"} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: "flex-end" }}>
                    <label>
                        Tổng tiền: <span style={{ fontWeight: "bold" }}>{(parseInt(dongia) || 0) * (parseInt(soluong) || 0)} VND</span>
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
    storeOutsides: state.StoreOutside.data,
    listBillProduct: state.Product.listBillProduct,
});

const mapDispatch = (dispatch) => ({
    addBillProduct: (data) => {
        dispatch(addBillProduct(data));
    },
});

export default connect(mapState, mapDispatch)(PopupBillCHN);
