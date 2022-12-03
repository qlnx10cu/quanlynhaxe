import React from "react";
import { connect } from "react-redux";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonDelete, ButtonEdit } from "../Styles";
import * as actions from "../../actions";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";

const StoreOutside = (props) => {
    const addItem = () => {
        props.openModal(POPUP_NAME.POPUP_STORE_OUTSIDES, null, (data) => {
            props.alert("Thêm thành công");
        });
    };

    const updateItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_STORE_OUTSIDES, item, (data) => {
            props.alert("Update thành công");
        });
    };

    const deleteItem = (item) => {
        props.confirmError("Bạn chắc muốn hủy", 2, () => {
            return props
                .deleteStoreOutside(item.tenphutung, item.nhacungcap)
                .then(() => {
                    props.alert("Xóa thành công");
                })
                .catch((err) => {
                    props.alert("Xóa thất bại \n\n Error:" + err.message);
                });
        });
    };

    return (
        <DataTable
            title="Danh sách cửa hàng ngoài"
            data={props.storeOutsides}
            addItem={() => addItem()}
            searchData={(search, e) => utils.searchName(e.tenphutung, search)}
        >
            <DataTable.Header>
                <th>Tên phụ tùng</th>
                <th>Nhà cung cấp</th>
                <th>Đơn giá</th>
                <th>Ghi chú</th>
                <th></th>
            </DataTable.Header>
            <DataTable.Body
                render={(item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.tenphutung}</td>
                            <td>{item.nhacungcap}</td>
                            <td>{utils.formatVND(item.dongia)}</td>
                            <td>{item.ghichu}</td>
                            <td>
                                <ButtonEdit onClick={() => updateItem(item)} />
                                <ButtonDelete onClick={() => deleteItem(item)} style={{ marginLeft: 5 }} />
                            </td>
                        </tr>
                    );
                }}
            ></DataTable.Body>
        </DataTable>
    );
};

const mapState = (state) => ({
    storeOutsides: state.StoreOutside.data,
    isLoading: state.StoreOutside.isLoading,
});

const mapDispatch = {
    deleteStoreOutside: (tenphutung, nhacungcap) => actions.StoreOutsideAction.deleteStoreOutside(tenphutung, nhacungcap),
};

export default connect(mapState, mapDispatch)(StoreOutside);
