import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, DivFlexColumn, Input, DivFlexRow, Button, DelButton } from '../../styles'
import lib from '../../lib'
import { GetListSalary } from '../../API/Salary'
import { connect } from 'react-redux'
import { getAllProduct,addBillProduct } from '../../actions/Product';

const PopupAccessory = (props) => {

    let mTenCongViec = lib.handleInput("");
    let [mMaPhuTung, setMaPhuTung] = useState("");
    let mDonGia = lib.handleInput("");
    let mSoLuong = lib.handleInput(1);
    let mTonKho=lib.handleInput(0);
    let mTienCong = lib.handleInput(0);
    let [listGiaDichVu, setListGiaDichVu] = useState([]);
    let [mDataList, setDataList] = useState([]);

    const searchMaPhuTung = (values) => {
        setMaPhuTung(values);
        if(values === "") {
            SliceTop20(props.listProduct);
            return;
        }
        let product = props.listProduct.filter(function (item) {
            return ((item.maphutung.toLowerCase()).includes(values.toLowerCase()) ||
                ((item.tentiengviet.toLowerCase()).includes(values.toLowerCase()))
            );
        });
        if (product.length !== 0) {
            if(product.length === 1&&product[0].maphutung===values) {
                setMaPhuTung(product[0].maphutung);
                mTenCongViec.setValue(product[0].tentiengviet);
                mDonGia.setValue(product[0].giaban_le);
                mTonKho.setValue(product[0].soluongtonkho);
                mSoLuong.setValue(1);
            }
            else {
                SliceTop20(product);
                mTenCongViec.setValue("");
                mTonKho.setValue("");
            }
        }
    };

    useEffect(() => {
        if(props.isShowing && props.listProduct) {
            SliceTop20(props.listProduct);
        }
    },[props.isShowing, props.listProduct]);

    const SliceTop20 = (list) => {
        setDataList(list.slice(0,20));
    };
   
    const handleAdd = () => {
        if (!mMaPhuTung|| mMaPhuTung === "") {
            alert("Chưa nhập mã phụ tùng");
            return;
        }

        if (!props.listProduct.find(e => e.maphutung == mMaPhuTung)) {
            alert("Không tìm thấy mã phụ tùng");
            return;
        }

        if(!mTenCongViec||mTenCongViec.value === "" ||!mDonGia || !mDonGia.value || mDonGia.value<0){
            alert("phụ tùng không hợp lệ");
            return;
        }

        if (!mSoLuong.value || mSoLuong.value < 0) {
            alert("Phải nhập số lượng");
            return;
        }
        if(mSoLuong.value>mTonKho.value){
            alert("Số lượng lón hơn tồn kho hiện tai");
            return;
        }


        var data={
            key:props.listBillProduct.length+1,
            tenphutungvacongviec:mTenCongViec.value,
            maphutung:mMaPhuTung,
            dongia:parseInt(mDonGia.value)||0,
            soluongphutung:parseInt(mSoLuong.value)||0,
            tiencong:parseInt(mTienCong.value)||0,
            tongtien:(parseInt(mDonGia.value) || 0)*(parseInt(mSoLuong.value)||0)+(parseInt(mTienCong.value)||0),
            nhacungcap:"Trung Trang"
        }
        props.addBillProduct(data);
        mTenCongViec.setValue("");
        setMaPhuTung("");
        mDonGia.setValue("");
        mSoLuong.setValue("");
        mTienCong.setValue("");
        mTonKho.setValue("");
        mDonGia.setValue("");
        props.onCloseClick()
    }
    useEffect(() => {
        props.getAllProduct(props.token);
        GetListSalary(props.token).then(respose=>{
            setListGiaDichVu(respose.data);
        })
    }, []);
    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <h2 style={{ textAlign: 'center' }}>Bảng giá (STT: {props.STT})</h2>
                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Tên phụ tùng và công việc: </label>
                        <Input {...mTenCongViec} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Mã phụ tùng: </label>
                        <Input list="browsers" name="browser" value={mMaPhuTung} onChange={(e) => {
                            mDonGia.setValue("");
                            mTenCongViec.setValue("");
                            mTonKho.setValue(0);
                            mSoLuong.setValue(0);
                            searchMaPhuTung(e.target.value);
                        }} />
                        <datalist id="browsers">
                            {mDataList.map((item, index) => (
                                <option disabled={item.soluongtonkho === 0} key={index}
                                        value={item.maphutung}>{item.tentiengviet} ({item.soluongtonkho})</option>
                            ))}
                        </datalist>
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow >
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Đơn giá: </label>
                        <Input readOnly {...mDonGia} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Số lượng: </label>
                        <Input type="Number" max={mTonKho.value} min={0} {...mSoLuong} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Tiền công: </label>
                        <Input list="tien_cong" name="tien_cong" type="number" {...mTienCong} />
                        <datalist id="tien_cong">
                        {listGiaDichVu.map((item, index) => (
                                <option key={index} value={item.tien} >{item.ten}</option>
                            ))}
                        </datalist>
                    </DivFlexColumn>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: 'flex-end' }}>
                    <label>Tổng tiền: <span style={{ fontWeight: 'bold' }}>{((parseInt(mDonGia.value)||0)*(parseInt(mSoLuong.value)||0)+(parseInt(mTienCong.value)||0)).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</span></label>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: 'flex-end' }}>
                    <Button onClick={handleAdd}>Thêm</Button>
                    <DelButton style={{ marginLeft: 10 }} onClick={() => props.onCloseClick()}>Hủy</DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    )
}
const mapState = (state) => ({
    token: state.Authenticate.token,
    listProduct: state.Product.listProduct,
    listBillProduct:state.Product.listBillProduct
});
const mapDispatch = (dispatch) => ({
    getAllProduct: (token) => { dispatch(getAllProduct(token)) },
    addBillProduct: (data) => { dispatch(addBillProduct(data)) },
});

export default connect(mapState, mapDispatch)(PopupAccessory);
