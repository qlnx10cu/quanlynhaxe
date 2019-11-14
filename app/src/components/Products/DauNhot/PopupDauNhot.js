import React, { useEffect} from 'react';
import { Modal, ModalContent, DivFlexRow, DivFlexColumn, Input, Button, DelButton } from '../../../styles'
import lib from '../../../lib'
import { UpdateDauNhot,AddDauNhot } from '../../../API/DauNhotAPI'
import { connect } from 'react-redux'

const PopupDauNhot = (props) => {
    let item = props.item;
    let mMaPhuTung = lib.handleInput("");
    let mNameEng = lib.handleInput("");
    let mNameVie = lib.handleInput("");
    let mGiaBanHead = lib.handleInput(0);
    let mGiaBanLe = lib.handleInput(0);
    let mViTri = lib.handleInput("");
    let mNote = lib.handleInput("");
    let mSoLuongTonKho = lib.handleInput(0);
    let loai = item ? true : false;
    let chucvu = props.chucvu;

    useEffect(() => {
        if(item&&item.maphutung){
            mMaPhuTung.setValue(item.maphutung);
            mNameEng.setValue(item.tentienganh);
            mNameVie.setValue(item.tentiengviet);
            mGiaBanHead.setValue(item.giaban_head);
            mGiaBanLe.setValue(item.giaban_le);
            mViTri.setValue(item.vitri);
            mSoLuongTonKho.setValue(item.soluongtonkho);
            mNote.setValue(item.ghichu);
        }else
        {
            mMaPhuTung.setValue('');
            mNameEng.setValue('');
            mNameVie.setValue('');
            mGiaBanHead.setValue(0);
            mGiaBanLe.setValue(0);
            mViTri.setValue('');
            mSoLuongTonKho.setValue(0);
            mNote.setValue('');
        }
    }, [item])
    
    
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
        item.maphutung=data.maphutung;
        item.tentienganh=data.tentienganh;
        item.tentiengviet=data.tentiengviet;
        item.giaban_head=data.giaban_head;
        item.giaban_le=data.giaban_le;
        item.soluongtonkho=data.soluongtonkho;
        item.vitri=data.vitri;
        item.ghichu=data.ghichu;

        UpdateDauNhot(props.token, data).then(res => {
            alert("Update thành công.");
            props.getList();
            props.onCloseClick();
        }).catch(err => {
            alert("Lỗi update phụ tùng \n\n Error: "+err.response.data.error.message);
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
            loaiphutung: "dầu nhớt",
            giaban_head: _gia_head,
            giaban_le: _gia_le,
            vitri: mViTri.value,
            soluongtonkho: _soluong,
            ghichu: mNote.value,
        }

        AddDauNhot(props.token, data).then(res => {
            alert("Thêm thành công.");
            props.getList();
            props.onCloseClick();
        }).catch(err => {
            alert("Lỗi thêm phụ tùng");
        })
    }
    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <h2 style={{ textAlign: 'center' }}>Dầu nhớt</h2>
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
                        <label>Vị Trí</label>
                        <Input  {...mViTri} />
                    </DivFlexColumn>

                </DivFlexRow>

                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Số lượng tồn kho </label>
                        <Input type="number" min={0} {...mSoLuongTonKho}   disabled={!chucvu || chucvu != "Admin"}/>
                    </DivFlexColumn>

                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Ghi chú</label>
                        <Input  {...mNote} />
                    </DivFlexColumn>

                </DivFlexRow>

                <DivFlexRow style={{ justifyContent: 'flex-end', marginTop: 15 }}>
                    {loai && <Button onClick={handleUpdate}>Lưu</Button>}
                    {loai === false && <Button isShowing={loai === false} style={{marginLeft: 15}} onClick={handleAdd}>Thêm Vào</Button>}
                    <DelButton onClick={() => props.onCloseClick()} style={{ marginLeft: 15 }}>Hủy bỏ</DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    );
}
const mapState = (state) => ({
    token: state.Authenticate.token,
})



export default connect(mapState, null)(PopupDauNhot);
// export default PopupDauNhot;