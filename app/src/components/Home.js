import React, { useEffect, useState } from "react";
import ToolBar from "./ToolBar";
import SocketEvent from "./SocketEvent";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import IO from "socket.io-client";
import { HOST } from "../Config";
import LoadingComponent from "./LoadingComponent";
import { connect } from "react-redux";
import { alert, error, errorHttp, success, setLoading, addLoading, confirm, confirmError } from "../actions/App";
import CaiDat from "./CaiDat";
import CuocGoi from "./CuocGoi";
import CSKH from "./CSKH";
const Staffs = React.lazy(() => import("./Admin/Staffs"));
const Customer = React.lazy(() => import("./Admin/Customer"));
const Products = React.lazy(() => import("./Products"));
const RepairPrice = React.lazy(() => import("./Admin/RepairPrice"));
const Services = React.lazy(() => import("./Services/Services"));
const RepairedBill = React.lazy(() => import("./Services/RepairedBill"));
const BanLe = React.lazy(() => import("./BanLe"));
const ChamCong = React.lazy(() => import("./ChamCong"));
const ThongKe = React.lazy(() => import("./ThongKe/index"));
const CuaHangNgoai = React.lazy(() => import("./CuaHangNgoai"));

const BaseContainer = styled.div`
    padding: 10px 20px;
`;
const Home = (props) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(IO(HOST));
    }, []);

    return (
        <Router>
            <ToolBar />
            <SocketEvent {...props} socket={socket} />
            <BaseContainer>
                {props.info != null && (
                    <Route
                        exact
                        path="/products"
                        component={LoadingComponent(() => (
                            <Products chucvu={props.info.chucvu} {...props} />
                        ))}
                    />
                )}
                {props.info != null && props.info.chucvu === "Admin" && <Route path="/staffs" component={LoadingComponent(Staffs, props)} />}
                {props.info != null && <Route path="/repairPrice" component={LoadingComponent(RepairPrice, props)} />}
                {props.info != null && <Route path="/customer" component={LoadingComponent(Customer, props)} />}
                {props.info != null && (
                    <Route
                        path="/services/repairedbill"
                        component={LoadingComponent(() => (
                            <RepairedBill socket={socket} {...props} />
                        ))}
                    />
                )}
                {props.info != null && (
                    <Route
                        path="/services/updatebill"
                        component={LoadingComponent(() => (
                            <RepairedBill socket={socket} {...props} />
                        ))}
                    />
                )}
                {props.info != null && (
                    <Route
                        path="/services/showbill"
                        component={LoadingComponent(() => (
                            <RepairedBill socket={socket} {...props} />
                        ))}
                    />
                )}
                {props.info != null && (
                    <Route
                        exact
                        path="/services"
                        component={LoadingComponent(() => (
                            <Services socket={socket} {...props} />
                        ))}
                    />
                )}

                {props.info != null && (props.info.chucvu === "Admin" || props.info.chucvu === "Phụ Tùng") && (
                    <Route path="/banle" component={LoadingComponent(BanLe, props)} />
                )}
                {props.info != null && (props.info.chucvu === "Admin" || props.info.chucvu === "CSKH") && (
                    <Route path="/chamsockhachhang" component={LoadingComponent(CSKH, props)} />
                )}
                {props.info != null && (props.info.chucvu === "Admin" || props.info.chucvu === "Dịch Vụ" || props.info.chucvu === "Văn Phòng") && (
                    <Route path="/chamcong" component={LoadingComponent(ChamCong, props)} />
                )}
                {props.info != null && <Route path="/cuocgoi" component={LoadingComponent(CuocGoi, props)} />}
                {props.info != null && <Route path="/thongke" component={LoadingComponent(ThongKe, props)} />}
                {props.info != null && <Route path="/cuahangngoai" component={LoadingComponent(CuaHangNgoai, props)} />}
                {props.info != null && <Route path="/caidat" component={LoadingComponent(CaiDat, props)} />}
            </BaseContainer>
        </Router>
    );
};

const mapState = (state) => ({
    token: state.Authenticate.token,
    info: state.Authenticate.info,
});

const mapDispatch = (dispatch) => ({
    alert: (mess) => {
        dispatch(alert(mess));
    },
    error: (mess) => {
        dispatch(error(mess));
    },
    errorHttp: (res, mess) => {
        dispatch(errorHttp(res, mess));
    },
    success: (mess) => {
        dispatch(success(mess));
    },
    confirm: (mess, callback) => {
        dispatch(confirm(mess, callback));
    },
    confirmError: (mess, errorType, callback) => {
        dispatch(confirmError(mess, errorType, callback));
    },
    addLoading: () => {
        dispatch(addLoading());
    },
    setLoading: (isLoad, totalLoading) => {
        dispatch(setLoading(isLoad, totalLoading));
    },
});

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, mapDispatch)(Home);
