import React, { useState, useEffect } from 'react';
import { ProductContainer, DivFlexRow, Button, Table, DelButton, Input } from '../../../styles'
import PopupDauNhot from './PopupDauNhot';
import { DelDauNhot } from '../../../API/DauNhotAPI'
import { connect } from 'react-redux'
import _ from "lodash";

const DauNhotItem = ({ item,
    token, cb,
    getList }) => {
    const handleDelClick = () => {
        if (window.confirm("Bạn chắc muốn hủy") == true) {
            DelDauNhot(token, item.maphutung).then(res => {
                alert("Xóa thành công.");
                getList();
            })
                .catch(err => {
                    alert("Không xóa được. @@")
                })
        }
    }
    const handleUpdateClick = () => {
        console.log(item);
        cb(item);
    }
    return (
        <tr>
            <td>{item.maphutung}</td>
            <td>{item.tentiengviet}</td>
            <td>{item.ghichu}</td>

            <td>{item.giaban_head.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' }).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
            <td>{item.giaban_le.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' }).toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
            <td>{item.vitri}</td>
            <td>{item.soluongtonkho}</td>
            <td>
                <Button onClick={handleUpdateClick} ><i className="fas fa-cog"></i></Button>
                <DelButton onClick={handleDelClick} style={{ marginLeft: 5 }}><i className="far fa-trash-alt"></i></DelButton>
            </td>
        </tr>
    )
}

const DauNhot = (props) => {

    let [isShowing, setShowing] = useState(false);

    let [mArrDauNhot, setArrDauNhot] = useState([]);
    let [searchValue, setSearchValue] = useState("");
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);
    let [itemData, setItem] = useState(null);
    let chucvu = null;

    if (props.info && props.info.chucvu) {
        chucvu = props.info.chucvu
    }


    useEffect(() => {
        if (props.listDauNhot) {
            tachList(props.listDauNhot);
        }
    }, [props.listDauNhot]);


    const handleButtonSearch = () => {
        let search = "";
        if (searchValue === "") {
            search = "ALL"
        }
        else {
            search = searchValue;
        }
        let list = props.listDauNhot.filter(function (item) {
            return (checkHasRender(search, item));
        });
        tachList(list);
    };
    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };

    const tachList = (list) => {
        let tmp = _.chunk(list, 150);
        setArrDauNhot(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleNextPage = () => {
        let newPage = page + 1;
        if (newPage >= maxPage) {
            newPage = 0;
        }
        setPage(newPage);
    };

    const handlePrevPage = () => {
        let newPage = page - 1;
        if (newPage < 0) {
            newPage = maxPage - 1;
        }
        setPage(newPage);
    };
    const handleUpdate = (itemData) => {
        console.log('data')
        setItem(itemData);
        setShowing(true);
    }
    const checkHasRender = (Search, item) => {
        let strSearch = Search.toLowerCase();
        return (Search === "ALL" || item.tentiengviet.toLowerCase().includes(strSearch) || item.maphutung.toLowerCase().includes(strSearch));
    };

    return (
        <ProductContainer className={props.isActive ? "active" : ""}>
            <DivFlexRow style={{ justifyContent: 'space-between' }}>
                <h3>Danh sách dầu nhớt</h3>
                <Button onClick={() => { setShowing(true); setItem(null) }}>Thêm mới</Button>
            </DivFlexRow>
            <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 5, marginBottom: 15 }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                    <Input onKeyPress={_handleKeyPress} style={{ width: 250, marginRight: 15 }}
                        onChange={(e) => setSearchValue(e.target.value)} />
                    <Button onClick={() => {
                        handleButtonSearch();
                    }}>
                        Tìm Kiếm
                        <i className="fas fa-search" />
                    </Button>
                </DivFlexRow>

                <DivFlexRow>
                    <Button onClick={handlePrevPage}>
                        Trang trước
                    </Button>
                    <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                        Trang Sau
                    </Button>
                </DivFlexRow>
            </DivFlexRow>

            <Table style={{ marginTop: 15 }}>
                <tbody>
                    <tr>
                        <th>Mã phụ tùng</th>
                        <th>Tên tiếng việt</th>
                        <th>Ghi chú</th>
                        <th>Giá nhập</th>
                        <th>Giá bán lẻ</th>
                        <th>Vị trí</th>
                        <th>Số lượng <br /> tồn kho</th>
                        <th>Sửa/Xóa</th>
                    </tr>
                    {
                        mArrDauNhot[page] && mArrDauNhot[page].map(item => (
                            <DauNhotItem
                                item={item}
                                key={item.ma}
                                cb={handleUpdate}
                                getList={() => { }}
                            />
                        ))
                    }
                </tbody>
            </Table>

            <PopupDauNhot
                isShowing={isShowing} item={itemData}
                onCloseClick={() => { setShowing(false); setItem(null) }}
                getList={() => { }}
            />

        </ProductContainer>
    );
}
const mapState = (state) => ({
    token: state.Authenticate.token,
    listDauNhot: state.Product.listDauNhot,
    info: state.Authenticate.info
});

export default connect(mapState, null)(DauNhot);