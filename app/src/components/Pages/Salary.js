import React from "react";
import { connect } from "react-redux";
import { POPUP_NAME } from "../../actions/Modal";
import DataTable from "../Warrper/DataTable";
import * as actions from "../../actions";
import utils from "../../lib/utils";
import { ButtonDelete, ButtonEdit } from "../Styles";

const RepairPrice = (props) => {
    const addItem = () => {
        props.openModal(POPUP_NAME.POPUP_SALARIES, null, (data) => {
            props.alert("Thêm thành công");
        });
    };

    const updateItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_SALARIES, item, (data) => {
            props.alert("Update thành công");
        });
    };

    const deleteItem = (item) => {
        props.confirmError("Bạn chắc muốn hủy", 2, () => {
            return props
                .deleteSalary(item.ma)
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
            title="Danh sách tiền công"
            data={props.salaries}
            addItem={() => addItem()}
            searchData={(search, e) => utils.searchName(e.ten, search)}
        >
            <DataTable.Header>
                <th>Mã</th>
                <th>Tên Dịch vụ</th>
                <th>Giá Tiền</th>
                <th></th>
            </DataTable.Header>
            <DataTable.Body
                render={(item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.ma}</td>
                            <td>{item.ten}</td>
                            <td>{utils.formatVND(item.tien)}</td>
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
    salaries: state.Salary.data,
    isLoading: state.Salary.isLoading,
});

const mapDispatch = {
    deleteSalary: (ma) => actions.SalaryAction.deleteSalary(ma),
};

export default connect(mapState, mapDispatch)(RepairPrice);
