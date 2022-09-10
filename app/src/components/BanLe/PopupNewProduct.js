import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, DivFlexColumn, Input, DivFlexRow, Button, DelButton } from '../../styles'
import lib from '../../lib'
import { connect } from 'react-redux'
import { getAllProduct } from '../../actions/Product';

const PopupNewProduct = (props) => {

    let mTenCongViec = lib.handleInput("");
    let [mMaPhuTung, setMaPhuTung] = useState("");
    let mDonGia = lib.handleInput(0);
    let mSoLuong = lib.handleInput(1);
    let mTonKho = lib.handleInput(1);
    let [mDataList, setDataList] = useState([]);
    let [chietkhau, setChietkhau] = useState(0);

    const searchMaPhuTung = (values) => {
        setMaPhuTung(values);
        if (values === "") {
            SliceTop20(props.listProduct);
            return;
        }
        let product = props.listProduct.filter(function (item) {
            return ((item.maphutung.toLowerCase()).includes(values.toLowerCase()) ||
                ((item.tentiengviet.toLowerCase()).includes(values.toLowerCase()))
            );
        });
        if (product.length !== 0) {
            if (product.length === 1 && product[0].maphutung === values) {
                setMaPhuTung(product[0].maphutung);
                mTenCongViec.setValue(product[0].tentiengviet);
                mDonGia.setValue(product[0].giaban_le);
                mTonKho.setValue(product[0].soluongtonkho);
            } else {
                SliceTop20(product);
                mTenCongViec.setValue("");
                mDonGia.setValue(0);
                mTonKho.setValue(0);
            }
        }
        else {
            mTenCongViec.setValue("");
            mDonGia.setValue(0);
            mTonKho.setValue(0);
        }
    };

    const handleAdd = () => {

        if (!mMaPhuTung||mMaPhuTung === "") {
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

        if (!chietkhau)
            chietkhau = 0;

        if (!mSoLuong.value || mSoLuong.value <= 0) {
            alert("Phải nhập số lượng");
            return;
        }

        if (!mTonKho.value || mTonKho.value < mSoLuong.value) {
            alert("Số lượng tồn kho không đủ");
            return;
        }

        if (chietkhau < 0 || chietkhau>100) {
            alert("Chiết khấu không hợp lệ");
            return;
        }

        let newData = {
            tencongviec: mTenCongViec.value,
            maphutung: mMaPhuTung,
            dongia: mDonGia.value,
            soluong: mSoLuong.value,
            chietkhau: chietkhau,
            tongtien: mDonGia.value * mSoLuong.value * ((100 - chietkhau) / 100),
            nhacungcap: 'Trung Trang'
        };
        props.addItemToProduct(newData);
        props.onCloseClick();
    };

    useEffect(() => {
        if (props.isShowing) {
            props.getAllProduct(props.token);
            setMaPhuTung("");
            mTenCongViec.setValue("");
            mDonGia.setValue(0);
            mSoLuong.setValue(1);
            setChietkhau(0);
        }
    }, [props.isShowing]);

    useEffect(() => {
        if (props.isShowing && props.listProduct) {
            SliceTop20(props.listProduct);
        }
    }, [props.isShowing, props.listProduct]);

    const SliceTop20 = (list) => {
        var arr = list.filter(e => e.soluongtonkho > 0);
        setDataList(arr.slice(0, 20));
    };

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Tên phụ tùng </label>
                        <Input readOnly {...mTenCongViec} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Mã phụ tùng: </label>
                        <Input list="browsers" name="browser" value={mMaPhuTung} onChange={(e) => {
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

                <DivFlexColumn>
                    <label>Chiết khấu: </label>
                    <Input type="Number" min={0} max={100} value={chietkhau} onChange={(e) => { setChietkhau(e.target.value) }} />
                </DivFlexColumn>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: 'flex-end' }}>
                    <label>Tổng tiền: <span
                        style={{ fontWeight: 'bold' }}>{(parseInt(mDonGia.value) || 0) * (parseInt(mSoLuong.value) || 0) * (100 - (parseInt(chietkhau)||0))/100} VND</span></label>
                </DivFlexRow>

                <DivFlexRow style={{ marginTop: 10, fontSize: 20, justifyContent: 'flex-end' }}>
                    <Button onClick={handleAdd}>Thêm</Button>
                    <DelButton style={{ marginLeft: 10 }} onClick={() => props.onCloseClick()}>Hủy</DelButton>
                </DivFlexRow>

            </ModalContent>
        </Modal>
    )
};

const mapState = (state) => ({
    token: state.Authenticate.token,
    listProduct: state.Product.listProduct,
});

const mapDispatch = (dispatch) => ({
    getAllProduct: (token) => {
        dispatch(getAllProduct(token))
    },
});

export default connect(mapState, mapDispatch)(PopupNewProduct);
