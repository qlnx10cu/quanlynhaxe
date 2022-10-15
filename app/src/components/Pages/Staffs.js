import React from "react";
import { connect } from "react-redux";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonDelete, ButtonEdit } from "../Styles";
import * as actions from "../../actions";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";

const Staffs = (props) => {
    const addItem = () => {
        props.openModal(POPUP_NAME.POPUP_STAFFS, null, (data) => {
            props.alert("Thêm nhân viên thành công");
        });
    };

    const updateItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_STAFFS, item, (data) => {
            props.alert("Update nhân viên thành công");
        });
    };

    const deleteItem = (item) => {
        props.confirmError("Bạn chắc muốn hủy", 2, () => {
            return props
                .deleteStaff(item.ma)
                .then(() => {
                    props.alert("Xóa nhân viên thành công");
                })
                .catch((err) => {
                    props.alert("Tạo nhân viên thất bại \n\n Error:" + err.message);
                });
        });
    };

    return (
        <DataTable
            title="Danh sách nhân viên"
            data={props.staffs}
            addItem={() => addItem()}
            searchData={(search, e) => utils.searchName(e.ma, search) || utils.searchName(e.ten, search)}
        >
            <DataTable.Header>
                <th>Mã Nhân Viên</th>
                <th>Tên Nhân Viên</th>
                <th>Số CMND</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Account Sip</th>
                <th>Chức vụ</th>
                <th>Sữa xóa</th>
            </DataTable.Header>
            <DataTable.Body
                render={(item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.ma}</td>
                            <td>{item.ten}</td>
                            <td>{item.cmnd}</td>
                            <td>{item.sdt}</td>
                            <td>{item.gmail}</td>
                            <td>{item.accountsip}</td>
                            <td>{item.chucvu}</td>
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
    staffs: state.Staff.data,
    isLoading: state.Staff.isLoading,
});

const mapDispatch = {
    deleteStaff: (ma) => actions.StaffAction.deleteStaff(ma),
};

export default connect(mapState, mapDispatch)(Staffs);
