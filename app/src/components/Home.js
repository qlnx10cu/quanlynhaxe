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
import { closeModal, openModal } from "../actions/Modal";
import ModalManager from "./ModalManager";
const Staffs = React.lazy(() => import("./Pages/Staffs"));
const Customer = React.lazy(() => import("./Pages/Customer"));
const Products = React.lazy(() => import("./Pages/Products"));
const Salary = React.lazy(() => import("./Pages/Salary"));
const SuaChua = React.lazy(() => import("./Pages/Services"));
const RepairedBill = React.lazy(() => import("./Pages/RepairedBill"));
const HistoryCall = React.lazy(() => import("./Pages/HistoryCall"));
const Retail = React.lazy(() => import("./Pages/Retail"));
const ChamCong = React.lazy(() => import("./Pages/ChamCong"));
const Statistic = React.lazy(() => import("./Pages/Statistic"));
const Setting = React.lazy(() => import("./Pages/Setting"));
const CustomerCare = React.lazy(() => import("./Pages/CustomerCare"));
const StoreOutside = React.lazy(() => import("./Pages/StoreOutside"));

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
            <ModalManager {...props} />
            <If condition={props.info != null}>
                <BaseContainer>
                    <Route path="/salary" component={LoadingComponent(Salary, props)} />
                    <Route path="/customer" component={LoadingComponent(Customer, props)} />
                    <Route path="/cuocgoi" component={LoadingComponent(HistoryCall, props)} />
                    <Route path="/thongke" component={LoadingComponent(Statistic, props)} />
                    <Route path="/cuahangngoai" component={LoadingComponent(StoreOutside, props)} />
                    <Route path="/caidat" component={LoadingComponent(Setting, props)} />
                    <Route path="/products" component={LoadingComponent(Products, props)} />

                    <Route path="/suachua" component={LoadingComponent(SuaChua, props, { socket: socket })} />
                    <Route path="/repairedbill" component={LoadingComponent(RepairedBill, props, { socket: socket })} />
                    <Route path="/showrepaired" component={LoadingComponent(RepairedBill, props, { socket: socket })} />
                    <Route path="/updaterepaired" component={LoadingComponent(RepairedBill, props, { socket: socket })} />

                    <If condition={props.info.chucvu === "Admin"}>
                        <Route path="/staffs" component={LoadingComponent(Staffs, props)} />
                    </If>

                    <If condition={props.info.chucvu === "Admin" || props.info.chucvu === "Phụ Tùng"}>
                        <Route path="/retail" component={LoadingComponent(Retail, props)} />
                        <Route path="/showretail" component={LoadingComponent(Retail, props)} />
                        <Route path="/updateretail" component={LoadingComponent(Retail, props)} />
                    </If>

                    <If condition={props.info.chucvu === "Admin" || props.info.chucvu === "CSKH"}>
                        <Route path="/chamsockhachhang" component={LoadingComponent(CustomerCare, props)} />
                    </If>
                    <If condition={props.info.chucvu === "Admin" || props.info.chucvu === "Dịch Vụ" || props.info.chucvu === "Văn Phòng"}>
                        <Route path="/chamcong" component={LoadingComponent(ChamCong, props)} />
                    </If>

                </BaseContainer>
            </If>
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
    openModal: (name, data, handleSubmit) => {
        dispatch(openModal(name, data, handleSubmit));
    },
    closeModal: (name, id) => {
        dispatch(closeModal(name, id));
    },
});

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, mapDispatch)(Home);
