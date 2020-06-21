import React, { useState, useEffect } from 'react';
import { ProductContainer, DivFlexRow, Button, Table, DelButton, Input } from '../../../styles'
import PopupPhuTung from './PopupPhuTung'
import { DelPhuTung, DelAllPhuTung } from '../../../API/PhuTungAPI'
import { alert, error } from "../../../actions/App";

import { connect } from 'react-redux'
import _ from 'lodash'

const PhuTungItem = ({
    stt,
    item,
    token,
    getList = () => {
    },
    alertProps,
    alertError,
    setShowing,
    setItemEdit,
}) => {

    const handleDelClick = () => {
        if (window.confirm("Bạn chắc muốn hủy") == true) {
            DelPhuTung(token, item.maphutung).then(res => {
                alertProps("Xóa thành công.");
                getList();
            })
                .catch(err => {
                    alertError("Không xóa được phụ tùng " + item.maphutung)
                })
        }
    };

    return (
        <tr>
            <td>{stt}</td>
            <td>{item.maphutung}</td>
            <td>{item.tentiengviet}</td>
            {/* <td>{item.giaban_head.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td> */}
            <td>{item.giaban_le.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
            <td>{item.vitri}</td>
            <td>{item.soluongtonkho}</td>
            <td>
                <DivFlexRow>
                    <Button onClick={() => {
                        setShowing(true)
                        setItemEdit(item)
                    }
                    }>
                        <i className="fas fa-cog" />
                    </Button>
                    <DelButton onClick={handleDelClick} style={{ marginLeft: 5 }}>
                        <i className="far fa-trash-alt" />
                    </DelButton>
                </DivFlexRow>
            </td>
        </tr>
    )
};

const PhuTung = (props) => {

    let [isShowing, setShowing] = useState(false);
    let [itemEdit, setItemEdit] = useState({});

    let [mArrPhuTung, setArrPhuTung] = useState([]);
    let [searchValue, setSearchValue] = useState("");
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);
    let chucvu = null;
    const maxSizePage = 150;

    if (props.info && props.info.chucvu) {
        chucvu = props.info.chucvu
    }

    const handleButtonSearch = () => {
        let search = "";
        if (searchValue === "") {
            search = "ALL"
        }
        else {
            search = searchValue;
        }
        let list = props.listPhuTung.filter(function (item) {
            return (checkHasRender(search, item));
        });
        tachList(list);
    };

    const _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };

    useEffect(() => {
        if (props.listPhuTung) {
            tachList(props.listPhuTung);
        }
    }, [props.listPhuTung.length]);

    const tachList = (list) => {
        let tmp = _.chunk(list, maxSizePage);
        setArrPhuTung(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleXoaHetPhutung = () => {
        if (window.confirm("Bạn chắc muốn hủy") == true) {
            DelAllPhuTung(props.token).then(res => {
                props.alert("Xóa thành công.");
                window.location.reload();
            }).catch(err => {
                props.error("Không xóa được. @@")
            })
        }

    }

    const handleNextPage = () => {
        let newPage = page + 1;
        if (newPage >= maxPage) {
            return;
        }
        setPage(newPage);
    };

    const handlePrevPage = () => {
        let newPage = page - 1;
        if (newPage < 0) {
            return;
        }
        setPage(newPage);
    };

    const checkHasRender = (Search, item) => {
        let strSearch = Search.toLowerCase();
        return (Search === "ALL" || item.tentiengviet.toLowerCase().includes(strSearch) || item.maphutung.toLowerCase().includes(strSearch));
    };

    return (

        <ProductContainer className={props.isActive ? "active" : ""}>
            <DivFlexRow style={{ justifyContent: 'space-between' }}>
                <h3>Danh sách phụ tùng</h3>
                <Button onClick={() => { handleXoaHetPhutung(); }}>Xóa hết phụ tùng</Button>
                <Button onClick={() => { setShowing(true); setItemEdit(null) }}>Thêm mới</Button>
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
                        <i className="fas fa-angle-double-left"></i>
                    </Button>
                    <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                        <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                    </DivFlexRow>
                    <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                        <i className="fas fa-angle-double-right"></i>
                    </Button>
                </DivFlexRow>

            </DivFlexRow>
            <Table style={{ marginTop: 15 }}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã phụ tùng</th>
                        <th>Tên tiếng việt</th>
                        {/* <th>Giá nhập</th> */}
                        <th>Giá bán lẻ</th>
                        <th>Vị trí</th>
                        <th>Số lượng <br /> tồn kho</th>
                        <th>Sửa/Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        mArrPhuTung[page] && mArrPhuTung[page].map((item, index) => (
                            <PhuTungItem
                                key={index}
                                stt={index + page * maxSizePage + 1}
                                item={item}
                                token={props.token}
                                getList={() => {
                                }}
                                alertProps={props.alert}
                                setShowing={setShowing}
                                setItemEdit={
                                    setItemEdit
                                }
                            />
                        ))
                    }

                </tbody>
            </Table>
            <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 5, marginBottom: 15 }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                </DivFlexRow>
                <DivFlexRow>
                    <Button onClick={handlePrevPage}>
                        <i className="fas fa-angle-double-left"></i>
                    </Button>
                    <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                        <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                    </DivFlexRow>
                    <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                        <i className="fas fa-angle-double-right"></i>
                    </Button>
                </DivFlexRow>
            </DivFlexRow>
            <PopupPhuTung
                chucvu={chucvu}
                item={itemEdit}
                isShowing={isShowing}
                listPhuTung={props.listPhuTung}
                alert={props.alert}
                error={props.error}
                onCloseClick={() => { setShowing(false); setItemEdit(null) }}
                getList={() => {
                }}
            />
        </ProductContainer>
    );
};

const mapState = (state) => ({
    listPhuTung: state.Product.listPhuTung,
    info: state.Authenticate.info
});

const mapDispatch = (dispatch) => ({
    alert: (mess) => { dispatch(alert(mess)) },
    error: (mess) => { dispatch(error(mess)) },
})


export default connect(mapState, mapDispatch)(PhuTung);