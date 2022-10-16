import React, { useState, useEffect } from "react";
import { Modal, ModalContent, DivFlexColumn, Input, DivFlexRow, Button, DelButton } from "../../styles";
import { connect } from "react-redux";
import InputList from "../Styles/InputList";

const PopupNewCuaHangNgoai = (props) => {
    let [nhacungcap, setNhaCungCap] = useState("");
    let [tenphutung, setTenPhuTung] = useState("");
    let [dongia, setDonGia] = useState(0);
    let [soluong, setSoLuong] = useState(1);
    let [chietkhau, setChietkhau] = useState(0);

    const searchTenPhuTung = (values) => {
        setTenPhuTung(values);
        let item = null;
        item = props.storeOutsides.find(function (e) {
            return e.tenphutung.toLowerCase() === values.toLowerCase();
        });

        if (item) {
            setNhaCungCap(item.nhacungcap);
            setDonGia(item.dongia);
        } else {
            setNhaCungCap("");
            setDonGia(0);
        }
    };

    const handleAdd = () => {
        if (!chietkhau) chietkhau = 0;

        if (tenphutung === "") {
            props.alert("Phải có tên phụ tùng.");
            return;
        }

        if (!soluong || soluong <= 0) {
            props.alert("số lượng phải >= 0");
            return;
        }

        if (!dongia || dongia < 0) {
            props.alert("Đợn gía phải > 0");
            return;
        }

        if (chietkhau < 0 || chietkhau > 100) {
            props.alert("Chiết khấu không hợp lệ");
            return;
        }

        let newData = {
            tencongviec: tenphutung,
            maphutung: "",
            dongia: parseInt(dongia),
            soluong: parseInt(soluong),
            chietkhau: chietkhau,
            tongtien: parseInt(dongia) * parseInt(soluong) * ((100 - parseInt(chietkhau)) / 100),
            nhacungcap: nhacungcap,
        };
        props.addItemToHangNgoai(newData);
        clearData();
        props.onCloseClick();
    };

    const clearData = () => {
        setNhaCungCap("");
        setTenPhuTung("");
        setDonGia("");
        setSoLuong(1);
        setChietkhau(0);
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
                            value={tenphutung}
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
                        <Input type={"Number"} value={dongia} onChange={(e) => setDonGia(e.target.value)} min={0} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Chiết khấu: </label>
                        <Input
                            type="Number"
                            min={0}
                            max={100}
                            value={chietkhau}
                            onChange={(e) => {
                                setChietkhau(e.target.value);
                            }}
                        />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Số lượng: </label>
                        <Input value={soluong} onChange={(e) => setSoLuong(e.target.value)} type={"Number"} min={1} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: "flex-end" }}>
                    <label>
                        Tổng tiền:{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {(((parseInt(dongia) || 0) * (100 - (parseInt(chietkhau) || 0))) / 100) * (parseInt(soluong) || 0)} VND
                        </span>
                    </label>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: "flex-end" }}>
                    <Button onClick={handleAdd}>Thêm</Button>
                    <DelButton style={{ marginLeft: 10 }} onClick={() => props.onCloseClick()}>
                        Hủy
                    </DelButton>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};

const mapState = (state) => ({
    storeOutsides: state.StoreOutside.data,
});

export default connect(mapState, null)(PopupNewCuaHangNgoai);
