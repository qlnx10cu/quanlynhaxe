import React, {useState, useEffect} from 'react';
import {ProductContainer, DivFlexRow, Button, Table, DelButton, Input} from '../../../styles'
import PopupPhuTung from './PopupPhuTung'
import { DelPhuTung} from '../../../API/PhuTungAPI'

import {connect} from 'react-redux'
import _ from 'lodash'

const PhuTungItem = ({
                         item,
                         token,
                         getList = () => {
                         },
                         setShowing,
                         setItemEdit,
                     }) => {

    const handleDelClick = () => {
        DelPhuTung(token, item.maphutung).then(res => {
            alert("Xóa thành công.");
            getList();
        })
            .catch(err => {
                alert("Không xóa được. @@")
            })
    };

    return (
        <tr>
            <td>{item.maphutung}</td>
            <td>{item.tentiengviet}</td>
            <td>{item.giaban_head.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
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
                        <i className="fas fa-cog"/>
                    </Button>
                    <DelButton onClick={handleDelClick} style={{marginLeft: 5}}>
                        <i className="far fa-trash-alt"/>
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
    let chucvu=null;

    const handleButtonSearch = () => {
        let search = "";
        if(searchValue === "") {
            search = "ALL"
        }
        else {
            search= searchValue;
        }
        let list = props.listPhuTung.filter(function(item){
            return (checkHasRender(search,item));
        });
        tachList(list);
    };

    if(props.info&&props.info.chucvu){
        chucvu=props.info.chucvu
    }
    

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
        let tmp = _.chunk(list, 150);
        setArrPhuTung(tmp);
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

    const checkHasRender = (Search, item) => {
        let strSearch = Search.toLowerCase();
        return (Search === "ALL" || item.tentiengviet.toLowerCase().includes(strSearch) || item.maphutung.toLowerCase().includes(strSearch));
    };

    return (

        <ProductContainer className={props.isActive ? "active" : ""}>
            <DivFlexRow style={{justifyContent: 'space-between'}}>
                <h3>Danh sách phụ tùng</h3>
                <Button onClick={() => {setShowing(true);setItemEdit(null)}}>Thêm mới</Button>
            </DivFlexRow>
            <DivFlexRow style={{alignItems: 'center', justifyContent: 'space-between', marginTop: 5, marginBottom: 15}}>
                <DivFlexRow style={{alignItems: 'center'}}>
                    <Input onKeyPress={_handleKeyPress} style={{width: 250, marginRight: 15}}
                           onChange={(e) => setSearchValue(e.target.value)}/>
                    <Button onClick={() => {
                        handleButtonSearch();
                    }}>
                        Tìm Kiếm
                        <i className="fas fa-search"/>
                    </Button>
                </DivFlexRow>

                <DivFlexRow>
                    <Button onClick={handlePrevPage}>
                        Trang trước
                    </Button>
                    <Button style={{marginLeft: 15}} onClick={handleNextPage}>
                        Trang Sau
                    </Button>
                </DivFlexRow>

            </DivFlexRow>
            <Table style={{marginTop: 15}}>
                <tbody>

                <tr>
                    <th>Mã phụ tùng</th>

                    <th>Tên tiếng việt</th>
                    <th>Giá nhập</th>
                    <th>Giá bán lẻ</th>
                    <th>Vị trí</th>
                    <th>Số lượng <br/> tồn kho</th>
                    <th>Sửa/Xóa</th>
                </tr>

                {
                    mArrPhuTung[page] && mArrPhuTung[page].map(item => (
                        <PhuTungItem
                            item={item}
                            key={item.ma}
                            getList={() => {
                            }}
                            setShowing={setShowing}
                            setItemEdit={
                                setItemEdit
                            }
                        />
                    ))
                }

                </tbody>
            </Table>
            <PopupPhuTung
                chucvu={chucvu}
                item={itemEdit}
                isShowing={isShowing}
                listPhuTung={props.listPhuTung}
                onCloseClick={() => {setShowing(false);setItemEdit(null)}}
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

export default connect(mapState)(PhuTung);