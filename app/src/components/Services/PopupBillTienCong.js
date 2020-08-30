import React, { useState, useEffect } from 'react'
import lib from '../../lib'
import { Modal, ModalContent, DivFlexColumn, Input, DivFlexRow, Button, DelButton } from '../../styles'
import { connect } from 'react-redux'
import { GetListSalary } from '../../API/Salary'
import { getAllProduct, addBillProduct } from '../../actions/Product';


const PopupBillTienCong = (props) => {

    let [tentiencong, setTenTienCong] = useState("");
    let [dongia, setDonGia] = useState(0);
    let [listGiaDichVu, setListGiaDichVu] = useState([]);
    useEffect(() => {
        props.getAllProduct(props.token);
        GetListSalary(props.token).then(respose=>{
            setListGiaDichVu(respose.data);
        })
    }, []);

    const searchTenTienCong = (values) => {
        setTenTienCong(values);
        let item = null;
        item = listGiaDichVu.find(function (e) {
            return (e.ten.toLowerCase() === values.toLowerCase());
        });

        if (item) {
            setDonGia(item.tien);
        }else{
            setDonGia(0);
        }
    };

    const handleAdd = () => {
        if (tentiencong === "") {
            alert("Phải có tên phụ tùng");
            return;
        }

        if(!dongia || dongia<0)
        {
            alert("Đơn giá phải >= 0");
            return;
        }

    

        var data = {
            key: props.listBillProduct.length + 1,
            tenphutungvacongviec: tentiencong,
            maphutung: "",
            dongia: 0,
            chietkhau:0,
            soluongphutung: 0,
            tiencong: parseInt(dongia) || 0,
            tongtien: parseInt(dongia) || 0,
            nhacungcap:"Trung Trang"
        }
        props.addItemToProduct(data,true);
        // props.addBillProduct(data);
        clearData();
        props.onCloseClick();
    };

    const clearData = () => {
        setTenTienCong("");
        setDonGia("0");
    };

    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <DivFlexRow>
                    <DivFlexColumn style={{ flex: 1 }}>
                        <label>Đơn giá: </label>
                        <Input value={dongia} onChange={(e) => setDonGia(e.target.value)} />
                    </DivFlexColumn>
                    <DivFlexColumn style={{ flex: 1, marginLeft: 15 }}>
                        <label>Tiền công: </label>
                        <Input list="tien_cong_1" name="tien_cong_1" value={tentiencong} onChange={(e) => {
                            searchTenTienCong(e.target.value);
                        }} />
                        <datalist id="tien_cong_1">
                            {listGiaDichVu.map((item, index) => (
                                <option key={index} value={item.ten} >{item.ten} - {item.tien}</option>
                            ))}
                        </datalist>
                    </DivFlexColumn>
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
    listBillProduct: state.Product.listBillProduct
});

const mapDispatch = (dispatch) => ({
    getAllProduct: (token) => {
        dispatch(getAllProduct(token))
    },
    addBillProduct: (data) => { dispatch(addBillProduct(data)) },
});

export default connect(mapState, mapDispatch)(PopupBillTienCong);
