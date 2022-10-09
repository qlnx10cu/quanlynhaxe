import React, { useState, useEffect } from "react";
import DataTable from "../../Warrper/DataTable";
import { ProductContainer, DivFlexRow, Button, Table, DelButton, Input, Select } from "../../../styles";
import PopupPhuTung from "./PopupPhuTung";
import { DelPhuTung, DelAllPhuTung } from "../../../API/PhuTungAPI";
import { alert, error, confirm } from "../../../actions/App";

import { connect } from "react-redux";
import lodash from "lodash";

const PhuTung = (props) => {
    let chucvu = props.info && props.info.chucvu ? props.info.chucvu : null;
    let [isShowing, setShowing] = useState(false);
    let [itemEdit, setItemEdit] = useState({});
    let [mArrPhuTung, setArrPhuTung] = useState([]);

    useEffect(() => {
        if (props.listPhuTung) {
            setArrPhuTung(props.listPhuTung);
        }
    }, [props.listPhuTung.length]);

    const handleDelClick = (item) => {
        parent.confirmError("Bạn chắc muốn hủy", 2, () => {
            DelPhuTung(props.token, item.maphutung)
                .then((res) => {
                    parent.error("Xóa thành công.");
                    setTimeout(() => {
                        window.reload();
                    }, 1000);
                })
                .catch((err) => {
                    parent.error("Không xóa được phụ tùng " + item.maphutung);
                });
        });
    };

    return (
        <ProductContainer className="active">
            <DataTable
                title={"Danh sách phụ tùng"}
                data={mArrPhuTung}
                searchData={(search, e) => search == "" || e.maphutung.toLowerCase().includes(search.toLowerCase())}
            >
                <DataTable.Header>
                    <th>STT</th>
                    <th>Mã phụ tùng</th>
                    <th>Tên tiếng việt</th>
                    <th>Giá bán lẻ</th>
                    <th>Vị trí</th>
                    <th>Số lượng</th>
                    <th>Sửa/Xóa</th>
                </DataTable.Header>
                <DataTable.Body
                    render={(item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.maphutung}</td>
                                <td>{item.tentiengviet}</td>
                                <td>{(item.giaban_le || 0).toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                                <td>{item.vitri}</td>
                                <td>{item.soluongtonkho}</td>
                                <td>
                                    <Button
                                        onClick={() => {
                                            setShowing(true);
                                            setItemEdit(item);
                                        }}
                                    >
                                        <i className="fas fa-edit" />
                                    </Button>
                                    <DelButton onClick={() => handleDelClick(item)} style={{ marginLeft: 5 }}>
                                        <i className="far fa-trash-alt" />
                                    </DelButton>
                                </td>
                            </tr>
                        );
                    }}
                ></DataTable.Body>
            </DataTable>
            <PopupPhuTung
                chucvu={chucvu}
                item={itemEdit}
                isShowing={isShowing}
                listPhuTung={props.listPhuTung}
                alert={props.alert}
                error={props.error}
                onCloseClick={() => {
                    setShowing(false);
                    setItemEdit(null);
                }}
                getList={() => {}}
            />
        </ProductContainer>
    );
};

const mapState = (state) => ({
    listPhuTung: state.Product.listPhuTung,
    info: state.Authenticate.info,
});

const mapDispatch = (dispatch) => ({
    confirm: (mess, callback) => {
        dispatch(confirm(mess, callback));
    },
    alert: (mess) => {
        dispatch(alert(mess));
    },
    error: (mess) => {
        dispatch(error(mess));
    },
});

export default connect(mapState, mapDispatch)(PhuTung);
