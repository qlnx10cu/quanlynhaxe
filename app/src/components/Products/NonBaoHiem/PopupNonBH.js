import React, { useEffect } from 'react';
import { Modal, ModalContent, DivFlexRow, DivFlexColumn, Input, Button, DelButton } from '../../../styles'
import lib from '../../../lib'
import { AddNonBaoHiem, UpdateNonBaoHiem } from '../../../API/NonBaoHiemAPI'
import { connect } from 'react-redux'

const PopupNonBH = (props) => {
    let mMaPhuTung = lib.handleInput("");
    let mNameEng = lib.handleInput("");
    let mNameVie = lib.handleInput("");
    let mGiaBanHead = lib.handleInput(0);
    let mGiaBanLe = lib.handleInput(0);
    let mViTri = lib.handleInput("");
    let mNote = lib.handleInput("");
    let mSoLuongTonKho = lib.handleInput(0);
    let loai = (props && props.item) ? true : false;
    let chucvu = props.chucvu;

    // useEffect(() => {
    //     if(item){
    //         mMaPhuTung.setValue(item.maphutung);
    //         mNameEng.setValue(item.tentienganh);
    //         mNameVie.setValue(item.tentiengviet);
    //         mGiaBanHead.setValue(item.giaban_head);
    //         mGiaBanLe.setValue(item.giaban_le);
    //         mViTri.setValue(item.vitri);
    //         mSoLuongTonKho.setValue(item.soluongtonkho);
    //         mNote.setValue(item.ghichu);
    //     }else
    //     {
    //         mMaPhuTung.setValue('');
    //         mNameEng.setValue('');
    //         mNameVie.setValue('');
    //         mGiaBanHead.setValue(0);
    //         mGiaBanLe.setValue(0);
    //         mViTri.setValue('');
    //         mSoLuongTonKho.setValue(0);
    //         mNote.setValue('');
    //     }
    // }, [item])

    const handleUpdate = () => {
        let _gia_head = parseInt(mGiaBanHead.value)
        let _gia_le = parseInt(mGiaBanLe.value)

        let _soluong = parseInt(mSoLuongTonKho.value)
        let data = {
            maphutung: mMaPhuTung.value,
            tentienganh: mNameEng.value,
            tentiengviet: mNameVie.value,
            giaban_head: _gia_head,
            giaban_le: _gia_le,
            vitri: mViTri.value,
            soluongtonkho: _soluong,
            ghichu: mNote.value,
        }
        props.itemEdit.maphutung=data.maphutung;
        props.itemEdit.tentienganh=data.tentienganh;
        props.itemEdit.tentiengviet=data.tentiengviet;
        props.itemEdit.giaban_head=data.giaban_head;
        props.itemEdit.giaban_le=data.giaban_le;
        props.itemEdit.soluongtonkho=data.soluongtonkho;
        props.itemEdit.vitri=data.vitri;
        props.itemEdit.ghichu=data.ghichu;

        UpdateNonBaoHiem(props.token, data, data.maphutung).then(res => {
            alert("Thêm thành công.");
            props.getList();
            props.onCloseClick()
        }).catch(err => {
            alert("Lỗi thêm phụ tùng")
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
            loaiphutung: "mũ bảo hiểm",
            giaban_head: _gia_head,
            giaban_le: _gia_le,
            vitri: mViTri.value,
            soluongtonkho: _soluong,
            ghichu: mNote.value,
        }

        if (props.itemEdit) {
            UpdateNonBaoHiem(props.token, data, props.itemEdit.maphutung).then(res => {
                alert("Update thành công")
                props.onCloseClick();
            }).catch(err => {
                alert("Lỗi khi update")
                console.log(err.response.data)
                props.onCloseClick();
            })
        } else {
            AddNonBaoHiem(props.token, data).then(res => {
                alert("Thêm thành công.");
                props.onCloseClick()
            }).catch(err => {
                alert("Lỗi thêm phụ tùng")
            })
        }

    }

    useEffect(() => {
        if (props.itemEdit && props.itemEdit.maphutung) {
            mMaPhuTung.setValue(props.itemEdit.maphutung)
            mNameEng.setValue(props.itemEdit.tentienganh)
            mNameVie.setValue(props.itemEdit.tentiengviet)
            mGiaBanHead.setValue(props.itemEdit.giaban_head)
            mGiaBanLe.setValue(props.itemEdit.giaban_le)
            mViTri.setValue(props.itemEdit.vitri)
            mNote.setValue(props.itemEdit.ghichu)
            mSoLuongTonKho.setValue(props.itemEdit.soluongtonkho)
        } else {
            mMaPhuTung.setValue("")
            mNameEng.setValue("")
            mNameVie.setValue("")
            mGiaBanHead.setValue("")
            mGiaBanLe.setValue("")
            mViTri.setValue("")
            mNote.setValue("")
            mSoLuongTonKho.setValue("")
        }

    }, [props.itemEdit])

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <h2 style={{ textAlign: 'center' }}>Nón bảo hiểm</h2>
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
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Giá nhập </label>
                        <Input type="number" min={0} {...mGiaBanHead} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Giá bán lẻ</label>
                        <Input type="number" min={0} {...mGiaBanLe} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Vị trí</label>
                        <Input {...mViTri} />
                    </DivFlexColumn>

                </DivFlexRow>

                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Số lượng tồn kho </label>
                        <Input type="number" min={0} {...mSoLuongTonKho} disabled={!chucvu || chucvu != "Admin"}/>
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Ghi chú </label>
                        <Input {...mNote} />
                    </DivFlexColumn>



                </DivFlexRow>

                <DivFlexRow style={{ justifyContent: 'flex-end', marginTop: 15 }}>
                    {loai && <Button onClick={handleUpdate}>Lưu</Button>}
                    {loai === false && <Button isShowing={loai === false} style={{ marginLeft: 15 }} onClick={handleAdd}>Thêm Vào</Button>}
                    <DelButton onClick={() => props.onCloseClick()} style={{ marginLeft: 15 }}>Hủy bỏ</DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    );
}
const mapState = (state) => ({
    token: state.Authenticate.token,
})



export default connect(mapState, null)(PopupNonBH);
