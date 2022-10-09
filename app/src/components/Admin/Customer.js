import React, { useState, useEffect } from "react";
import { Table, Button, DelButton, DivFlexRow, Input, Select } from "../../styles";
import { connect } from "react-redux";
import CustomerDetail from "./CustomerDetail";
import { GetlistCustomer, DeleteCustomer } from "../../API/Customer";
import HistoryCustomer from "./HistoryCustomer";
import Loading from "../Loading";
import _ from "lodash";

const Customer = (props) => {
    let [editItem, setEditItem] = useState(null);
    let [isShowCustomerDetail, setShowCustomerDetail] = useState(false);
    let [isShowHistoryCustomer, setShowHistoryCustomer] = useState(false);

    var [listCustomer, setlistCustomer] = useState([]);
    var [listCustomerTemp, setlistCustomerTemp] = useState([]);
    var [searchValue, setSearchValue] = useState("");
    let [maxSizePage, setMaxSizePage] = useState(50);
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);

    useEffect(() => {
        getlistCustomer();
    }, []);

    const getlistCustomer = (query = "") => {
        props.setLoading(true);
        GetlistCustomer(props.token, `ma=${query}&ten=${query}&sodienthoai=${query}&biensoxe=${query}&sokhung=${query}&somay=${query}`)
            .then((Response) => {
                var dataCustomer = Response.data;
                setlistCustomerTemp(dataCustomer);
                tachList(dataCustomer, maxSizePage);
                props.setLoading(false);
            })
            .catch((err) => {
                props.alert("Không thể load danh sách khách hàng");
            });
    };

    const tachList = (list, size) => {
        let tmp = _.chunk(list, size);
        setlistCustomer(tmp);
        setMaxPage(tmp.length);
        setPage(0);
    };

    const handleNextPage = () => {
        let newPage = page + 1;
        if (newPage >= maxPage) {
            return;
        }
        setPage(newPage);
    };

    const handlePrevPage = () => {
        let newPage = page - 1;
        if (newPage < 0) {
            return;
        }
        setPage(newPage);
    };

    // const handleButtonEdit = (item) => {
    //     setShowCustomerDetail(true);
    //     setEditItem(item);
    // };
    const handleButtonSearch = () => {
        if (searchValue == "") {
            getlistCustomer();
            return;
        }
        getlistCustomer(searchValue);
    };
    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleButtonSearch();
        }
    };
    const handleChangeSoHang = (e) => {
        setMaxSizePage(parseInt(e));
        tachList(listCustomerTemp, e);
    };

    const goiKhachHang = (e) => {
        let url = `microsip://callto:${e}`;
        window.open(url);
    };

    return (
        <React.Fragment>
            {props.isLoading && <Loading />}
            {!props.isLoading && (
                <React.Fragment>
                    <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}>Danh sách Khách Hàng</span>
                        <Button
                            onClick={() => {
                                setShowCustomerDetail(true);
                                setEditItem(null);
                            }}
                        >
                            Thêm mới
                            <i className="fas fa-plus"></i>
                        </Button>
                    </DivFlexRow>
                    <DivFlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <DivFlexRow style={{ alignItems: "center", marginTop: 5, marginBottom: 10 }}>
                            <Input
                                onKeyPress={_handleKeyPress}
                                style={{ width: 250, marginRight: 15 }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Button
                                onClick={() => {
                                    handleButtonSearch();
                                }}
                            >
                                {" "}
                                Tìm Kiếm <i className="fas fa-search"></i>
                            </Button>
                        </DivFlexRow>
                        <DivFlexRow style={{ alignItems: " center", justifyContent: "flex-end", marginTop: 5, marginBottom: 10 }}>
                            <label>Số hàng </label>
                            <Select style={{ marginLeft: 10 }} width={100} value={maxSizePage} onChange={(e) => handleChangeSoHang(e.target.value)}>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="250">250</option>
                                <option value="500">500</option>
                                <option value="1000">1000</option>
                                <option value="2000">2000</option>
                            </Select>
                            <Button style={{ marginLeft: 35 }} onClick={handlePrevPage}>
                                <i className="fas fa-angle-double-left"></i>
                            </Button>
                            <DivFlexRow style={{ alignItems: "center", justifyContent: "space-between", marginLeft: 10 }}>
                                <div>
                                    {" "}
                                    {page + 1}/{maxPage > 1 ? maxPage : 1}
                                </div>
                            </DivFlexRow>
                            <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                                <i className="fas fa-angle-double-right"></i>
                            </Button>
                        </DivFlexRow>
                    </DivFlexRow>

                    <Table>
                        <thead>
                            <tr>
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
                            </tr>
                        </thead>
                        <tbody>
                            {listCustomer[page] &&
                                listCustomer[page].map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ fontSize: 12 }}>{item.ma}</td>
                                        <td
                                            style={{
                                                fontSize: 12,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {item.ten}
                                        </td>
                                        <td style={{ fontSize: 12 }}>{item.sodienthoai}</td>
                                        <td style={{ fontSize: 12 }}>{item.gioitinh == "1" ? "Nữ" : item.gioitinh == "0" ? "Nam" : ""}</td>
                                        <td
                                            style={{
                                                fontSize: 12,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {item.diachi}
                                        </td>
                                        <td style={{ fontSize: 12 }}>{item.thanhpho}</td>
                                        <td style={{ fontSize: 12 }}>{item.biensoxe}</td>
                                        <td style={{ fontSize: 12 }}>{item.loaixe}</td>
                                        <td style={{ fontSize: 12 }}>{item.sokhung}</td>
                                        <td style={{ fontSize: 12 }}>{item.somay}</td>
                                        <td style={{ fontSize: 12 }}>
                                            <Button
                                                onClick={() => {
                                                    setShowHistoryCustomer(true);
                                                    setEditItem(item);
                                                }}
                                                style={{
                                                    height: 30,
                                                    width: 30,
                                                    display: "inline-flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                title="Xem chi tiết"
                                            >
                                                <i className="fas fa-eye"></i>{" "}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setShowCustomerDetail(true);
                                                    setEditItem(item);
                                                }}
                                                style={{
                                                    marginLeft: 5,
                                                    height: 30,
                                                    width: 30,
                                                    display: "inline-flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                title="Cập nhập thông tin khách hàng"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (!item.zaloid) {
                                                        props.alert("Chưa có thông tin zalo từ khách hàng này");
                                                    } else {
                                                        window.open(
                                                            `https://oa.zalo.me/chatv2?uid=${item.zaloid}&oaid=2867735993958514567`,
                                                            "_blank"
                                                        );
                                                    }
                                                }}
                                                style={{
                                                    marginLeft: 5,
                                                    height: 30,
                                                    width: 30,
                                                    display: "inline-flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                title="Nhắn tin với khách hàng"
                                            >
                                                <i className="fas fa-comment"></i>
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    props.confirm(`Bạn muốn gọi ${item.ten} (${item.sodienthoai}) `, () => {
                                                        goiKhachHang(item.sodienthoai);
                                                    });
                                                }}
                                                style={{
                                                    marginLeft: 5,
                                                    height: 30,
                                                    width: 30,
                                                    display: "inline-flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                title="Gọi khách hàng"
                                            >
                                                <i className="fas fa-phone"></i>
                                            </Button>
                                        </td>
                                        <td style={{ fontSize: 12 }}>
                                            <DelButton
                                                onClick={() => {
                                                    props.confirm("Bạn chắc muốn xóa khách hàng này", () => {
                                                        DeleteCustomer(props.token, item.ma)
                                                            .then(() => {
                                                                getlistCustomer();
                                                            })
                                                            .catch((err) => {
                                                                props.error("Xoa that bai");
                                                            });
                                                    });
                                                }}
                                                style={{
                                                    marginLeft: 5,
                                                    height: 30,
                                                    width: 30,
                                                    display: "inline-flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                title="Xóa Khách hàng"
                                            >
                                                <i className="far fa-trash-alt"></i>
                                            </DelButton>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    <DivFlexRow style={{ alignItems: " center", justifyContent: "flex-end", marginTop: 15 }}>
                        <Button onClick={handlePrevPage}>
                            <i className="fas fa-angle-double-left"></i>
                        </Button>
                        <DivFlexRow style={{ alignItems: "center", justifyContent: "space-between", marginLeft: 10 }}>
                            <div>
                                {" "}
                                {page + 1}/{maxPage > 1 ? maxPage : 1}
                            </div>
                        </DivFlexRow>
                        <Button style={{ marginLeft: 15 }} onClick={handleNextPage}>
                            <i className="fas fa-angle-double-right"></i>
                        </Button>
                    </DivFlexRow>
                    <CustomerDetail
                        alert={props.alert}
                        error={props.error}
                        confirm={props.confirm}
                        isShowing={isShowCustomerDetail}
                        onCloseClick={(hasUpdate) => {
                            setShowCustomerDetail(false);
                            setEditItem(null);
                            if (hasUpdate === true) {
                                getlistCustomer();
                            }
                        }}
                        editItem={editItem}
                    />

                    <HistoryCustomer
                        alert={props.alert}
                        error={props.error}
                        confirm={props.confirm}
                        token={props.token}
                        isShowing={isShowHistoryCustomer}
                        onCloseClick={() => {
                            setShowHistoryCustomer(false);
                            setEditItem(null);
                        }}
                        ma={editItem && editItem.ma ? editItem.ma : null}
                    />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};
const mapState = (state) => ({
    isLoading: state.App.isLoading,
    token: state.Authenticate.token,
});

export default connect(mapState, null)(Customer);
