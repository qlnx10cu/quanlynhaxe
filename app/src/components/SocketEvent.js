import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateLiftTable } from "../actions/AppInfo";
import * as actions from "../actions";

const SocketEvent = (props) => {
    useEffect(() => {
        let connected = true;
        if (!props.socket) return;

        props.socket.on("connected", (data) => {
            if (connected) {
                props.updateLiftTable(data);
            }
        });

        props.socket.on("lifttableFull", (data) => {
            if (connected) {
                props.updateLiftTable(data);
            }
        });

        props.socket.on("lifttableBill", (data) => {
            if (connected) {
                props.updateLiftTable(data.liftTable);
                if (props.history.location.pathname.includes(`/repairedbill?maban=${data.maban + 1}`)) {
                    props.error("Bạn đã bị ai đó hủy bàn này");
                    props.history.push("/suachua");
                }
            }
        });

        props.socket.on("lifttable", (data) => {
            if (connected) {
                try {
                    props.updateLiftTable(data.liftTable);
                    if (props.history.location.pathname == "/suachua") {
                        props.history.push(`/repairedbill?maban=${data.maban + 1}`);
                    }
                } catch (error) {}
            }
        });

        props.socket.on("enter_lifttable_error", (data) => {
            if (connected) {
                props.addLoading();
                props.updateLiftTable(data.liftTable);
                props.alert(data && data.message ? data.message : "Lỗi chọn bàn! Vui lòng chọn lại");
            }
        });

        props.socket.on("enter_lifttable_error", (data) => {
            if (connected) {
                props.addLoading();
                props.updateLiftTable(data.liftTable);
                props.alert(data && data.message ? data.message : "Lỗi chọn bàn! Vui lòng chọn lại");
            }
        });

        props.socket.on("seen_lifttable_error", (data) => {
            if (connected) {
                props.alert(data && data.message ? data.message : "Lỗi chọn bàn! Vui lòng chọn lại");
            }
        });

        return () => {
            if (connected && props.socket) {
                try {
                    props.socket.disconnect();
                } catch (error) {}
            }
            connected = false;
        };
    }, [props.socket]);

    useEffect(() => {
        props.getListStaff();
        props.getListSalary();
        props.getListStoreOutside();
        props.getListProduct();

        const productInterval = setInterval(() => {
            props.refeshListProduct();
        }, 300000);

        return () => {
            clearInterval(productInterval);
        };
    }, []);

    return <div style={{ display: "none" }}></div>;
};
const mapState = (state) => ({
    token: state.Authenticate.token,
    info: state.Authenticate.info,
});

const mapDispatch = {
    updateLiftTable: (data) => updateLiftTable(data),
    getListStaff: () => actions.StaffAction.getListStaff(),
    getListSalary: () => actions.SalaryAction.getListSalary(),
    getListStoreOutside: () => actions.StoreOutsideAction.getListStoreOutside(),
    getListProduct: () => actions.ProductAction.getListProduct(),
    refeshListProduct: () => actions.ProductAction.refeshListProduct(),
};

export default connect(mapState, mapDispatch)(withRouter(SocketEvent));
