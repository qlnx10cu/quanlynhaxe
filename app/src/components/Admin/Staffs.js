import React, { useState, useEffect } from "react";
import { Table, Button, DelButton, DivFlexRow, Input } from "../../styles";
import { connect } from "react-redux";
import StaffDetail from "./StaffDetail";
import { GetListStaff, DeleteStaff } from "../../API/Staffs";
import { setLoading } from "../../actions/App";
import Loading from "../Loading";
const Staffs = (props) => {
    let [editItem, setEditItem] = useState(null);
    let [isShowStaffDetail, setShowStaffDetail] = useState(false);
    var [listStaff, setListStaff] = useState([]);
    var [listStaffTemp, setListStaffTemp] = useState([]);
    var [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        getListStaff();
    }, []);

    const getListStaff = () => {
        props.setLoading(true);
        GetListStaff(props.token)
            .then((Response) => {
                setListStaff(Response.data);
                setListStaffTemp(Response.data);
                props.setLoading(false);
            })
            .catch((err) => {
                props.setLoading(false);
            });
    };
    // const handleButtonEdit = (item) => {
    //     setShowStaffDetail(true);
    //     setEditItem(item);
    // };
    const handleButtonSearch = () => {
        var arr = [];
        arr = listStaffTemp.filter((e) => {
            var s = e.ten.toLowerCase().includes(searchValue.toLowerCase());
            var k = String(e.ma).toLowerCase().includes(searchValue.toLowerCase());
            return s || k;
        });
        setListStaff(arr);
    };
    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleButtonSearch();
        }
    };
    return (
        <Choose>
            <When condition={props.isLoading}>
                <Loading />
            </When>
            <Otherwise>
                <React.Fragment>
                    <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}>Danh sách nhân viên</span>
                        <Button
                            onClick={() => {
                                setShowStaffDetail(true);
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
                        <Button
                            onClick={() => {
                                handleButtonSearch();
                            }}
                        >
                            Tìm Kiếm
                            <i className="fas fa-search"></i>
                        </Button>
                    </DivFlexRow>
                    <Table>
                        <tbody>
                            <tr>
                                <th>Mã Nhân Viên</th>
                                <th>Tên Nhân Viên</th>
                                <th>Số CMND</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Account Sip</th>
                                <th>Chức vụ</th>
                                <th></th>
                            </tr>

                            {listStaff
                                .filter((e) => e.ten != "root")
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.ma}</td>
                                        <td>{item.ten}</td>
                                        <td>{item.cmnd}</td>
                                        <td>{item.sdt}</td>
                                        <td>{item.gmail}</td>
                                        <td>{item.accountsip}</td>
                                        <td>{item.chucvu}</td>

                                        <td>
                                            <Button
                                                onClick={() => {
                                                    setShowStaffDetail(true);
                                                    setEditItem(item);
                                                }}
                                            >
                                                <i className="fas fa-cog"></i>
                                            </Button>
                                            <DelButton
                                                onClick={() => {
                                                    props.confirmError("Bạn chắc muốn hủy", 2, () => {
                                                        DeleteStaff(props.token, item.ma);
                                                        getListStaff();
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
                    <StaffDetail
                        isShowing={isShowStaffDetail}
                        onCloseClick={() => {
                            setShowStaffDetail(false);
                            getListStaff();
                            setEditItem(null);
                        }}
                        editItem={editItem}
                    />
                </React.Fragment>
            </Otherwise>
        </Choose>
    );
};
const mapState = (state) => ({
    token: state.Authenticate.token,
    isLoading: state.App.isLoading,
});
const mapDispatch = (dispatch) => ({
    setLoading: (isLoad) => {
        dispatch(setLoading(isLoad));
    },
});
export default connect(mapState, mapDispatch)(Staffs);
