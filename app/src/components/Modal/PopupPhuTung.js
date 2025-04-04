import React, { useEffect, useState } from "react";
import { DivFlexRow, DivFlexColumn, Input } from "../../styles";
import moment from "moment";
import DataTable from "../Warrper/DataTable";
import ModalWrapper from "../Warrper/ModalWrapper";
import ProductApi from "../../API/ProductApi";
import lib from "../../lib";
import utils from "../../lib/utils";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { InputNumber, TabPage } from "../Styles";

const RenderTableDetail = ({ lichsu }) => {
    return (
        <DataTable data={lichsu}>
            <DataTable.Header>
                <th>STT</th>
                <th>Ngày</th>
                <th>Loại</th>
                <th>Giá mới</th>
                <th>Giá cũ</th>
                <th>Số lượng trươc khi nhập</th>
                <th>Số lượng nhập vào</th>
                <th>Số lượng sau khi nhập</th>
            </DataTable.Header>
            <DataTable.Body
                render={(item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{moment(item.ngaycapnhat || new Date()).format("DD/MM/YYYY")}</td>
                            <td>{item.loai == 0 ? "Import" : "Edit"}</td>
                            <td>{item.giaban_le}</td>
                            <td>{item.giaban_cu}</td>
                            <If condition={item.loai == 0}>
                                <td>{item.soluongtruocdo}</td>
                                <td>{item.soluongtonkho}</td>
                                <td>{item.soluongtonkho + item.soluongtruocdo}</td>
                            </If>
                            <If condition={item.loai == 1}>
                                <td>{item.soluongtruocdo}</td>
                                <td>{item.soluongtonkho}</td>
                                <td>{item.soluongtonkho}</td>
                            </If>
                        </tr>
                    );
                }}
            />
        </DataTable>
    );
};

const RenderTableDetailHoaDon = ({ chitiet }) => {
    return (
        <DataTable data={chitiet} searchData={(search, e) => search == "" || e.mahoadon.toLowerCase().includes(search.toLowerCase())}>
            <DataTable.Header>
                <th>STT</th>
                <th>Ngày</th>
                <th>Mã Hóa Đơn</th>
                <th>Số lượng</th>
            </DataTable.Header>
            <DataTable.Body
                render={(item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{moment(item.ngaythanhtoan || item.timeindex).format("DD/MM/YYYY")}</td>
                            <td>{item.mahoadon}</td>
                            <td>{item.soluong || item.soluongphutung}</td>
                        </tr>
                    );
                }}
            />
        </DataTable>
    );
};

/* eslint-disable camelcase */

const PopupPhuTung = (props) => {
    const useIsMounted = lib.useIsMounted();
    let [isLoading, setLoading] = useState(false);
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
    const isUpdate = item && item.maphutung;

    useEffect(() => {
        if (!item || !item.maphutung) {
            return;
        }
        setLoading(true);
        ProductApi.get(item.maphutung)
            .then((data) => {
                if (!useIsMounted()) return;
                mMaPhuTung.setValue(data.maphutung);
                mNameEng.setValue(data.tentienganh);
                mNameVie.setValue(data.tentiengviet);
                mGiaBanHead.setValue(data.giaban_head || 0);
                mGiaBanLe.setValue(data.giaban_le || 0);
                mViTri.setValue(data.vitri);
                mModel.setValue(data.model);
                mColor.setValue(data.mamau);
                mNote.setValue(data.ghichu);
                mChiTiet.setValue(data.chitiet);
                mLichSu.setValue(data.lichsu);
                mSoLuongTonKho.setValue(data.soluongtonkho || 0);
                setLoading(false);
            })
            .catch(() => {
                if (!useIsMounted()) return;
                props.alert("Không lấy được chi tiết: ");
            });
    }, [item]);

    const handleUpdate = () => {
        let _gia_head = utils.parseInt(mGiaBanHead.value);
        let _gia_le = utils.parseInt(mGiaBanLe.value);
        let _soluong = utils.parseInt(mSoLuongTonKho.value);

        let data = {
            ma: item.maphutung,
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
        };

        return props.updateProduct(item.maphutung, data).then((res) => {
            props.alert("Update thành công.");
        });
    };
    const handleAdd = () => {
        let _gia_head = utils.parseInt(mGiaBanHead.value);
        let _gia_le = utils.parseInt(mGiaBanLe.value);
        let _soluong = utils.parseInt(mSoLuongTonKho.value);

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
        };

        return props.addProduct(data).then((res) => {
            props.alert("Thêm thành công.");
        });
    };

    const handleButton = () => {
        if (item && isUpdate) {
            return handleUpdate();
        }
        return handleAdd();
    };

    return (
        <ModalWrapper
            open={props.open}
            title={"Phụ tùng"}
            isLoading={isLoading}
            callback={props.callback}
            onClose={props.onClose}
            submit={handleButton}
        >
            <DivFlexRow>
                <DivFlexColumn style={{ flex: 1 }}>
                    <label>Mã phụ tùng </label>
                    <Input {...mMaPhuTung} readOnly={isUpdate} />
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

            <DivFlexRow>
                <DivFlexColumn style={{ flex: 1 }}>
                    <label>Giá nhập</label>
                    <InputNumber min={0} {...mGiaBanHead} readOnly={isUpdate} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Giá bán lẻ</label>
                    <InputNumber min={0} {...mGiaBanLe} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Số lượng tồn kho </label>
                    <InputNumber min={0} {...mSoLuongTonKho} />
                </DivFlexColumn>
            </DivFlexRow>

            <DivFlexRow>
                <DivFlexColumn style={{ flex: 1 }}>
                    <label>Vị trí</label>
                    <Input {...mViTri} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Model</label>
                    <Input {...mModel} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Ghi chú</label>
                    <Input {...mNote} />
                </DivFlexColumn>
                <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                    <label>Màu</label>
                    <Input type="color" style={{ height: "35px", margin: "8px 0", padding: "1px 2px", maxWidth: "150px" }} {...mColor} />
                </DivFlexColumn>
            </DivFlexRow>

            <If condition={isUpdate}>
                <TabPage>
                    <TabPage.Tab title={"Lịch sử nhập hàng"}>
                        <RenderTableDetail isLoading={isLoading} lichsu={mLichSu.value} {...props} />
                    </TabPage.Tab>
                    <TabPage.Tab title={"Lịch sử hóa đơn"}>
                        <RenderTableDetailHoaDon isLoading={isLoading} chitiet={mChiTiet.value} {...props} />
                    </TabPage.Tab>
                </TabPage>
            </If>
        </ModalWrapper>
    );
};

/* eslint-enable camelcase */

const mapDispatch = {
    addProduct: (data) => actions.ProductAction.addProduct(data),
    updateProduct: (maphutung, data) => actions.ProductAction.updateProduct(maphutung, data),
};
export default connect(null, mapDispatch)(PopupPhuTung);
