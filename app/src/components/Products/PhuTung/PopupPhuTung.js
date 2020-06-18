import React, { useEffect } from 'react';
import { Modal, ModalContent, DivFlexRow, DivFlexColumn, Input, Button, DelButton } from '../../../styles'
import lib from '../../../lib'
import { AddPhuTung, UpdatePhuTung, GetDetailPhuTung } from '../../../API/PhuTungAPI'

const PopupPhuTung = (props) => {

    let mMaPhuTung = lib.handleInput("");
    let mNameEng = lib.handleInput("");
    let mNameVie = lib.handleInput("");
    let mGiaBanHead = lib.handleInput(0);
    let mGiaBanLe = lib.handleInput(0);
    let mViTri = lib.handleInput("");
    let mSoLuongTonKho = lib.handleInput(0);
    let mNote = lib.handleInput("");
    let mModel = lib.handleInput("");
    let mColor = lib.handleInput("#FFFFFF");
    let item = props.item;

    useEffect(() => {
        if (item && item.maphutung) {
            console.log(props);
            GetDetailPhuTung(props.token, item.maphutung).then(res => {
                let _item = res.data;
                mMaPhuTung.setValue(_item.maphutung);
                mNameEng.setValue(_item.tentienganh);
                mNameVie.setValue(_item.tentiengviet);
                mGiaBanHead.setValue(_item.giaban_head);
                mGiaBanLe.setValue(_item.giaban_le);
                mViTri.setValue(_item.vitri);
                mSoLuongTonKho.setValue(_item.soluongtonkho)
                mModel.setValue(_item.model);
                mColor.setValue(_item.mamau);
                mNote.setValue(_item.ghichu);
            })
                .catch(err => {
                    alert("Không lấy được chi tiết: ");
                })
        } else {
            mMaPhuTung.setValue('');
            mNameEng.setValue('');
            mNameVie.setValue('');
            mGiaBanHead.setValue('');
            mGiaBanLe.setValue('');
            mViTri.setValue('');
            mSoLuongTonKho.setValue('')
            mModel.setValue('');
            mColor.setValue('');
            mNote.setValue('');
        }

    }, [item])

    const handleUpdate = () => {
        let _gia_head = parseInt(mGiaBanHead.value)
        let _gia_le = parseInt(mGiaBanLe.value)
        let _soluong = parseInt(mSoLuongTonKho.value)


        let data = {
            ma: item.ma,
            maphutung: mMaPhuTung.value,
            tentienganh: mNameEng.value,
            tentiengviet: mNameVie.value,
            loaiphutung: "phụ tùng",
            giaban_head: _gia_head,
            giaban_le: _gia_le,
            soluongtonkho: _soluong,
            ghichu: mNote.value,
            vitri: mViTri.value,
            model: mModel.value,
            mamau: mColor.value,

        }

        props.item.maphutung = data.maphutung;
        props.item.tentienganh = data.tentienganh;
        props.item.tentiengviet = data.tentiengviet;
        props.item.giaban_head = data.giaban_head;
        props.item.giaban_le = data.giaban_le;
        props.item.soluongtonkho = data.soluongtonkho;
        props.item.vitri = data.vitri;
        props.item.ghichu = data.ghichu;
        props.item.loaixe = data.loaixe;
        props.item.model = data.model;
        props.item.mamau = data.mamau

        UpdatePhuTung(props.token, data).then(res => {
            alert("Update thành công.");
            props.getList();
            props.onCloseClick();
        })
            .catch(err => {
                console.log(err);
                alert("Lỗi Update phụ tùng")
            })
    }
    const handleAdd = () => {

        let _gia_head = parseInt(mGiaBanHead.value)
        let _gia_le = parseInt(mGiaBanLe.value)
        let _soluong = parseInt(mSoLuongTonKho.value)


        let data = {
            maphutung: mMaPhuTung.value,
            tentienganh: mNameEng.value,
            tentiengviet: mNameVie.value,
            loaiphutung: "phụ tùng",
            giaban_head: _gia_head,
            giaban_le: _gia_le,
            soluongtonkho: _soluong,
            ghichu: mNote.value,
            vitri: mViTri.value,
            model: mModel.value,
            mamau: mColor.value,

        }

        AddPhuTung(props.token, data).then(res => {
            alert("Thêm thành công.");
            props.getList();
            props.onCloseClick();
        })
            .catch(err => {
                console.log(err);
                alert("Lỗi thêm phụ tùng")
            })
    }

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <h2 style={{ textAlign: 'center' }}>Phụ tùng</h2>
                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Mã phụ tùng </label>
                        <Input {...mMaPhuTung} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Tên phụ tùng (Anh) </label>
                        <Input {...mNameEng} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Tên phụ tùng (Việt)</label>
                        <Input {...mNameVie} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow >
                {(!item || !item.maphutung) &&<DivFlexColumn style={{ flex: 1 }}>
                        <label>Giá nhập</label>
                        <Input type="number" min={0} {...mGiaBanHead} />
                    </DivFlexColumn>}
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Giá bán lẻ</label>
                        <Input type="number" min={0} {...mGiaBanLe} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Vị trí</label>
                        <Input  {...mViTri} />
                    </DivFlexColumn>
                </DivFlexRow>


                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Số lượng tồn kho </label>
                        <Input type="number" min={0} {...mSoLuongTonKho}/>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Model</label>
                        <Input {...mModel} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Ghi chú</label>
                        <Input {...mNote} />
                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexColumn >
                    <label>Màu</label>
                    <Input type="color" width={"45px"} {...mColor} />
                </DivFlexColumn>

                <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                    {(!item || !item.maphutung) && <Button onClick={handleAdd}>Lưu</Button>}
                    {item && item.maphutung && <Button onClick={handleUpdate}>Cập nhật</Button>}
                    <DelButton onClick={() => props.onCloseClick()} style={{ marginLeft: 15 }}>Hủy bỏ</DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    );
}

export default PopupPhuTung;