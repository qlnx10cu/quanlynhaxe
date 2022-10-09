import React, { useState, useEffect } from "react";
import { Table, Button, DelButton, DivFlexRow, Input } from "../../styles";
import { GetListSalary, DelSalary } from "../../API/Salary";
import RepairPriceDetail from "./RepairPriceDetail";
// import DeleteDialog from './DeleteDialog'
import { connect } from "react-redux";
import Loading from "../Loading";

const RepairPrice = (props) => {
    let [editItem, setEditItem] = useState(null);
    let [isShowRepairPriceDetail, setShowRepairPriceDetail] = useState(false);
    let [listSalary, setListSalary] = useState([]);
    let [listSalaryAll, setListSalaryAll] = useState([]);
    var [searchValue, setSearchValue] = useState("");

    const handleButtonEdit = (item) => {
        setShowRepairPriceDetail(true);
        setEditItem(item);
    };

    useEffect(() => {
        props.setLoading(true);
        GetListSalary(props.token)
            .then((response) => {
                setListSalary(response.data);
                setListSalaryAll(response.data);
                props.setLoading(false);
            })
            .catch((e) => {
                props.setLoading(true);
                props.error("Kết nối server có vấn đề, vui lòng kiểm tra đường mạng");
            });
    }, []);

    const TimKiem = () => {
        var arr = [];
        if (!searchValue) arr = listSalaryAll;
        else
            arr = listSalary.filter((e) => {
                var s = e.ten.toLowerCase().includes(searchValue.toLowerCase());
                var k = false;
                if (String(e.ma).toLowerCase().includes(searchValue.toLowerCase())) k = true;
                return s || k;
            });
        setListSalary(arr);
    };
    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            TimKiem();
        }
    };
    return (
        <div>
            {props.isLoading && <Loading />}
            {!props.isLoading && (
                <React.Fragment>
                    <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}>Danh sách tiền công</span>
                        <Button
                            onClick={() => {
                                setShowRepairPriceDetail(true);
                                setEditItem(null);
                            }}
                        >
                            Thêm mới
                            <i className="fas fa-plus"></i>
                        </Button>
                    </DivFlexRow>
                    <DivFlexRow style={{ alignItems: "center", marginTop: 5, marginBottom: 15 }}>
                        <Input
                            onKeyPress={_handleKeyPress}
                            style={{ width: 250, marginRight: 15 }}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Button onClick={() => TimKiem()}>
                            Tìm Kiếm
                            <i className="fas fa-search"></i>
                        </Button>
                    </DivFlexRow>
                    <Table>
                        <tbody>
                            <tr>
                                <th>Mã</th>
                                <th>Tên Dịch vụ</th>
                                <th>Giá Tiền</th>
                                <th></th>
                            </tr>

                            {listSalary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.ma}</td>
                                    <td>{item.ten}</td>
                                    <td>{item.tien.toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                                    <td>
                                        <Button
                                            onClick={() => {
                                                handleButtonEdit(item);
                                            }}
                                        >
                                            <i className="fas fa-cog"></i>
                                        </Button>
                                        <DelButton
                                            onClick={() => {
                                                props.confirmError("Bạn chắc muốn hủy", 2, () => {
                                                    DelSalary(props.token, item.ma).then((res) => {
                                                        GetListSalary(props.token).then((response) => {
                                                            setListSalary(response.data);
                                                        });
                                                    });
                                                });
                                            }}
                                            style={{ marginLeft: 5 }}
                                        >
                                            <i className="far fa-trash-alt"></i>
                                        </DelButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <DivFlexRow style={{ alignItems: " center", justifyContent: "flex-end", marginTop: 15 }}>
                        <Button>
                            <i className="fas fa-angle-double-left"></i>
                        </Button>
                        <Button style={{ marginLeft: 10 }}>
                            <i className="fas fa-angle-double-right"></i>
                        </Button>
                    </DivFlexRow>
                    <RepairPriceDetail
                        {...props}
                        isShowing={isShowRepairPriceDetail}
                        onCloseClick={() => {
                            setShowRepairPriceDetail(false);
                            GetListSalary(props.token).then((response) => {
                                setListSalary(response.data);
                            });
                            setEditItem(null);
                        }}
                        editItem={editItem}
                    />
                </React.Fragment>
            )}
        </div>
    );
};

const mapState = (state) => ({
    token: state.Authenticate.token,
    isLoading: state.App.isLoading,
});
const mapDispatch = (dispatch) => ({});
export default connect(mapState, mapDispatch)(RepairPrice);
