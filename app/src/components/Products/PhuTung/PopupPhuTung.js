import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, DivFlexRow, DivFlexColumn, Input, Button, DelButton, Tab, Table, CloseButton } from '../../../styles'
import { AddPhuTung, UpdatePhuTung, GetDetailPhuTung } from '../../../API/PhuTungAPI';
import DataTable from '../../Warrper/DataTable';
import lib from '../../../lib'
import moment from 'moment';

const RenderTableDetail = ({ lichsu }) => {

    const ItemTable = ({ item, index }) => {
        return (<tr>
            <td>{index + 1}</td>
            <td>{moment(item.ngaycapnhat || new Date()).format('DD/MM/YYYY')}</td>
            <td>{item.giaban_le}</td>
            <td>{item.giaban_cu}</td>
            <td>{item.soluongtonkho}</td>
            <td>{item.soluongtruocdo}</td>
            <td>{item.soluongtonkho + item.soluongtruocdo}</td>
        </tr>)
    }

    return (
        <React.Fragment>
            <DataTable data={lichsu} >
                <DataTable.Header>
                    <th>STT</th>
                    <th>Ngày</th>
                    <th>Giá mới</th>
                    <th>Giá cũ</th>
                    <th>Số lượng trươc khi nhập</th>
                    <th>Số lượng nhập vào</th>
                    <th>Số lượng sau khi nhập</th>
                </DataTable.Header>
                <DataTable.Body>
                    <ItemTable />
                </DataTable.Body>
            </DataTable>
        </React.Fragment>
    )
}

const RenderTableDetailHoaDon = ({ chitiet }) => {

    const ItemTable = ({ item, index }) => {
        return (<tr>
            <td>{index + 1}</td>
            <td>{moment(item.ngaythanhtoan).format('DD/MM/YYYY')}</td>
            <td>{item.mahoadon}</td>
            <td>{item.soluong || item.soluongphutung}</td>
        </tr>)
    }

    return (
        <React.Fragment>
            <DataTable data={chitiet} >
                <DataTable.Header>
                    <th>STT</th>
                    <th>Ngày</th>
                    <th>Mã Hóa Đơn</th>
                    <th>Số lượng</th>
                </DataTable.Header>
                <DataTable.Body>
                    <ItemTable />
                </DataTable.Body>
            </DataTable>
        </React.Fragment>
    )
}


const PopupPhuTung = (props) => {

    let [activePage, setActive] = useState(0);
    let mChiTiet = lib.handleInput([]);
    let mLichSu = lib.handleInput([]);
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
        setActive(0);
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
        mChiTiet.setValue([]);
        mLichSu.setValue([]);
        if (item && item.maphutung) {
            GetDetailPhuTung(props.token, item.maphutung).then(res => {
                let _item = res.data;
                mMaPhuTung.setValue(_item.maphutung);
                mNameEng.setValue(_item.tentienganh);
                mNameVie.setValue(_item.tentiengviet);
                mGiaBanHead.setValue(_item.giaban_head || 0);
                mGiaBanLe.setValue(_item.giaban_le || 0);
                mViTri.setValue(_item.vitri);
                mSoLuongTonKho.setValue(_item.soluongtonkho || 0)
                mModel.setValue(_item.model);
                mColor.setValue(_item.mamau);
                mNote.setValue(_item.ghichu);
                mChiTiet.setValue(_item.chitiet);
                mLichSu.setValue(_item.lichsu);
            })
                .catch(err => {
                    alert("Không lấy được chi tiết: ");
                })
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
                alert("Lỗi thêm phụ tùng")
            })
    }

    useEffect(() => {
        function handleEscapeKey(event) {
            if (event.code === 'Escape') {
                props.onCloseClick();
            }
        }
        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
    }, [])


    const isUpdate = item && item.maphutung;

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => props.onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
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
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Giá nhập</label>
                        <Input type="number" min={0} {...mGiaBanHead} readOnly={isUpdate} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Giá bán lẻ</label>
                        <Input type="number" min={0} {...mGiaBanLe} readOnly={isUpdate} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Số lượng tồn kho </label>
                        <Input type="number" min={0} {...mSoLuongTonKho} readOnly={isUpdate} />
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Vị trí</label>
                        <Input  {...mViTri} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Model</label>
                        <Input {...mModel} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Ghi chú</label>
                        <Input {...mNote} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }} >
                        <label>Màu</label>
                        <Input type="color" style={{ height: "35px", margin: "8px 0", padding: "1px 2px", maxWidth: "150px" }} {...mColor} />
                    </DivFlexColumn>
                </DivFlexRow>

                {isUpdate &&
                    <div>
                        <Tab>
                            <button className={activePage === 0 ? "active" : ""} onClick={() => setActive(0)}>Lịch sử nhập hàng</button>
                            <button className={activePage === 1 ? "active" : ""} onClick={() => setActive(1)}>Lịch sử hóa đơn</button>
                        </Tab>
                        {activePage === 0 &&
                            <RenderTableDetail lichsu={mLichSu.value} {...props} />
                        }
                        {activePage === 1 &&
                            <RenderTableDetailHoaDon chitiet={mChiTiet.value} {...props} />
                        }

                    </div>
                }

                <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                    {!isUpdate && <Button onClick={handleAdd}>Lưu</Button>}
                    {isUpdate && <Button onClick={handleUpdate}>Cập nhật</Button>}
                    <DelButton onClick={() => props.onCloseClick()} style={{ marginLeft: 15 }}>Hủy bỏ</DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    );
}

export default PopupPhuTung;