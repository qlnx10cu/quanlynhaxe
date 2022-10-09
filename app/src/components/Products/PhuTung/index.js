import React, { useState, useEffect } from "react";
import DataTable from "../../Warrper/DataTable";
import { ProductContainer, DivFlexRow, Button, Table, DelButton, Input, Select } from "../../../styles";
import PopupPhuTung from "./PopupPhuTung";
import { DelPhuTung, DelAllPhuTung } from "../../../API/PhuTungAPI";
import { alert, error, confirm } from "../../../actions/App";

import { connect } from "react-redux";
import _ from "lodash";

const PhuTungItem = ({ index, item, token, getList = () => {}, confirmErrorProps, alertProps, alertError, setShowing, setItemEdit }) => {
    const handleDelClick = () => {
        confirmErrorProps("Bạn chắc muốn hủy", 2, () => {
            DelPhuTung(token, item.maphutung)
                .then((res) => {
                    alertProps("Xóa thành công.");
                    getList();
                })
                .catch((err) => {
                    alertError("Không xóa được phụ tùng " + item.maphutung);
                });
        });
    };

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{item.maphutung}</td>
            <td>{item.tentiengviet}</td>
            <td>{(item.giaban_le || "").toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
            <td>{item.vitri}</td>
            <td>{item.soluongtonkho}</td>
            <td>
                <DivFlexRow>
                    <Button
                        onClick={() => {
                            setShowing(true);
                            setItemEdit(item);
                        }}
                    >
                        <i className="fas fa-cog" />
                    </Button>
                    <DelButton onClick={handleDelClick} style={{ marginLeft: 5 }}>
                        <i className="far fa-trash-alt" />
                    </DelButton>
                </DivFlexRow>
            </td>
        </tr>
    );
};

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

    const handleXoaHetPhutung = () => {
        props.confirm("Bạn chắc muốn hủy", () => {
            DelAllPhuTung(props.token)
                .then((res) => {
                    props.alert("Xóa thành công.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((err) => {
                    props.error("Không xóa được. @@");
                });
        });
    };

    return (
        <ProductContainer className="active">
            <DivFlexRow style={{ justifyContent: "space-between" }}>
                <h3>Danh sách phụ tùng</h3>
                <Button
                    onClick={() => {
                        handleXoaHetPhutung();
                    }}
                >
                    Xóa hết phụ tùng
                </Button>
                <div></div>
            </DivFlexRow>

            <DataTable data={mArrPhuTung} searchData={(search, e) => search == "" || e.maphutung.toLowerCase().includes(search.toLowerCase())}>
                <DataTable.Header>
                    <th>STT</th>
                    <th>Mã phụ tùng</th>
                    <th>Tên tiếng việt</th>
                    <th>Giá bán lẻ</th>
                    <th>Vị trí</th>
                    <th>Số lượng</th>
                    <th>Sửa/Xóa</th>
                </DataTable.Header>
                <DataTable.Body>
                    <PhuTungItem
                        token={props.token}
                        getList={() => {}}
                        alertProps={props.alert}
                        alertError={props.parent.error}
                        confirmErrorProps={props.parent.confirmError}
                        setShowing={setShowing}
                        setItemEdit={setItemEdit}
                    />
                </DataTable.Body>
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
