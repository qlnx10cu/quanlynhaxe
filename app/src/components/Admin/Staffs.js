import React, { useState, useEffect } from "react";
import { Button, DelButton } from "../../styles";
import { connect } from "react-redux";
import { GetListStaff, DeleteStaff } from "../../API/Staffs";
import { POPUP_NAME } from "../../actions/Modal";
import DataTable from "../Warrper/DataTable";
const Staffs = (props) => {
    var [listStaff, setListStaff] = useState([]);
    var [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getListStaff();
    }, []);

    const getListStaff = () => {
        setLoading(true);
        GetListStaff(props.token)
            .then((Response) => {
                setListStaff(Response.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    const addItem = () => {
        props.openModal(POPUP_NAME.POPUP_STAFFS, null, (data) => {
            props.alert("Thêm nhân viên thành công");
            getListStaff();
        });
    };

    const updateItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_STAFFS, item, (data) => {
            props.alert("Update nhân viên thành công");
        });
    };

    const deleteItem = (item) => {
        props.confirmError("Bạn chắc muốn hủy", 2, () => {
            DeleteStaff(props.token, item.ma);
            getListStaff();
        });
    };

    return (
        <DataTable
            title={"Danh sách nhân viên"}
            data={listStaff}
            isLoading={isLoading}
            addItem={addItem}
            searchData={(search, e) => search == "" || e.ten.toLowerCase().includes(search.toLowerCase())}
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
                                <Button onClick={() => updateItem(item)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <DelButton onClick={() => deleteItem(item)} style={{ marginLeft: 5 }}>
                                    <i className="far fa-trash-alt"></i>
                                </DelButton>
                            </td>
                        </tr>
                    );
                }}
            ></DataTable.Body>
        </DataTable>
    );
};
const mapState = (state) => ({
    token: state.Authenticate.token,
});

export default connect(mapState, null)(Staffs);
