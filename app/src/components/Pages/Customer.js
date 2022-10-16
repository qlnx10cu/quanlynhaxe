import React, { useEffect } from "react";
import { connect } from "react-redux";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonCall, ButtonChatZalo, ButtonDelete, ButtonEdit, ButtonView, LabelOverflow } from "../Styles";
import * as actions from "../../actions";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";

const Customer = (props) => {
    useEffect(() => {
        props.getListCustomer();
    }, []);

    const handleViewItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_HISTORY, item);
    };

    const handleAddItem = () => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER, null, () => {
            props.alert("Thêm thành công");
        });
    };

    const handleUpdateItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER, item, () => {
            props.alert("Update thành công");
        });
    };

    const handleDeletetem = (item) => {
        props.confirmError("Bạn chắc muốn hủy", 2, () => {
            return props
                .deleteCustomer(item.ma)
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
            title="Danh sách khách hàng"
            isLoading={props.isLoading}
            data={props.customers}
            addItem={() => handleAddItem()}
            onSearch={(search) => props.getListCustomer(search)}
        >
            <DataTable.Header>
                <th>Mã KH</th>
                <th>Tên</th>
                <th>SĐT</th>
                <th>GT</th>
                <th style={{ width: 175 }}>Địa Chỉ</th>
                <th>T.Phố</th>
                <th>BSX</th>
                <th>Loại Xe</th>
                <th>Số Khung</th>
                <th>Số Máy</th>
                <th style={{ width: 140 }}>Xem|Sữa|Chat|Gọi</th>
                <th style={{ width: 30 }}>Xóa</th>
            </DataTable.Header>
            <DataTable.Body
                render={(item, index) => {
                    return (
                        <tr key={index}>
                            <td style={{ fontSize: 12 }}>{item.ma}</td>
                            <td>
                                <LabelOverflow style={{ maxWidth: "200px" }} text={item.ten} />
                            </td>
                            <td style={{ fontSize: 12 }}>{item.sodienthoai}</td>
                            <td style={{ fontSize: 12 }}>{utils.getGioiTinh(item.gioitinh)}</td>
                            <td>
                                <LabelOverflow style={{ maxWidth: "200px" }} text={item.diachi} />
                            </td>
                            <td style={{ fontSize: 12 }}>{item.thanhpho}</td>
                            <td style={{ fontSize: 12 }}>{item.biensoxe}</td>
                            <td style={{ fontSize: 12 }}>{item.loaixe}</td>
                            <td style={{ fontSize: 12 }}>{item.sokhung}</td>
                            <td style={{ fontSize: 12 }}>{item.somay}</td>
                            <td>
                                <ButtonView onClick={() => handleViewItem(item)} />
                                <ButtonChatZalo data={item} confirm={props.confirm} alert={props.alert} />
                                <ButtonCall data={item} confirm={props.confirm} alert={props.alert} />
                                <ButtonEdit onClick={() => handleUpdateItem(item)} />
                            </td>
                            <td>
                                <ButtonDelete onClick={() => handleDeletetem(item)} style={{ marginLeft: 5 }} />
                            </td>
                        </tr>
                    );
                }}
            ></DataTable.Body>
        </DataTable>
    );
};

const mapState = (state) => ({
    customers: state.Customer.data,
    isLoading: state.Customer.isLoading,
});

const mapDispatch = {
    getListCustomer: (query) => actions.CustomerAction.getListCustomer(query),
    deleteCustomer: (ma) => actions.CustomerAction.deleteCustomer(ma),
};

export default connect(mapState, mapDispatch)(Customer);
