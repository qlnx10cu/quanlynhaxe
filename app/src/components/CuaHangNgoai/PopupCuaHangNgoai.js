import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, Input, DivFlexColumn, DivFlexRow, Button, DelButton } from '../../styles'
import { SaveItemCuaHangNgoai, UpdateItemCuaHangNgoai } from '../../API/CuaHangNgoai'

const PopupCuaHangNgoai = (props) => {

    let [tenphutung, setTenphutung] = useState("");
    let [nhacungcap, setNhacungcap] = useState("");
    let [dongia, setDonGia] = useState(0);
    let [ghichu, setGhiChu] = useState("");

    const handleLuu = () => {
        if (tenphutung === "" || nhacungcap === "" || !dongia || dongia === 0) {
            props.parent.alert("Chưa nhập đủ thông tin.");
        }
        else {
            let data = {
                tenphutung: tenphutung,
                nhacungcap: nhacungcap,
                dongia: dongia,
                ghichu: ghichu,
            };
            if (!props.item) {
                SaveItemCuaHangNgoai(props.token, data).then(res => {
                    clearData();
                    props.getList();
                    props.onCloseClick();
                })
                    .catch(err => {
                        props.parent.alert("Không thể thêm phụ tùng này");
                    });
            }
            else {
                //    Update
                UpdateItemCuaHangNgoai(props.token, data, props.item.tenphutung, props.item.nhacungcap).then(res => {
                    clearData();
                    props.getList();
                    props.onCloseClick();
                })
                    .catch(err => {
                        props.parent.alert("Lỗi update dữ liệu");
                    });
            }
        }
    };

    const clearData = () => {
        setTenphutung("");
        setNhacungcap("");
        setDonGia("");
        setGhiChu("");
    };


    useEffect(() => {
        clearData();
        if (props.item) {
            setTenphutung(props.item.tenphutung);
            setNhacungcap(props.item.nhacungcap);
            setDonGia(props.item.dongia);
            setGhiChu(props.item.ghichu);
        }
    }, [props.item]);

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <h2 style={{ textAlign: 'center' }}>Thêm mới</h2>

                <DivFlexRow style={{ width: '100%' }}>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Tên phụ tùng</label>
                        <Input value={tenphutung} onChange={(e) => setTenphutung(e.target.value)} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ width: '100%' }}>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Nhà cung cấp</label>
                        <Input value={nhacungcap} onChange={(e) => setNhacungcap(e.target.value)} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Đơn giá</label>
                        <Input type={"number"} value={dongia} onChange={(e) => setDonGia(e.target.value)} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ width: '100%' }}>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Ghi chú</label>
                        <Input value={ghichu} onChange={(e) => setGhiChu(e.target.value)} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={handleLuu}>
                        Lưu
                    </Button>
                    <DelButton style={{ marginLeft: 15 }} onClick={() => props.onCloseClick()}>
                        Hủy
                    </DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    )
}

export default PopupCuaHangNgoai;
