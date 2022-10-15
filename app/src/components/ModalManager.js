import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { POPUP_NAME } from "../actions/Modal";
import useIsMounted from "../lib/useIsMounted";
import PopupPhuTung from "./Modal/PopupPhuTung";
import PopupStaff from "./Modal/PopupStaff";
import PopupSalary from "./Modal/PopupSalary";
import PopupStoreOutside from "./Modal/PopupStoreOutside";
import PopupConfirmBill from "./Modal/PopupConfirmBill";
import PopupBill from "./Modal/PopupBill";
import PopupCustomerHistory from "./Modal/PopupCustomerHistory";

/* eslint-disable no-undef */

const ModalManager = (props) => {
    const isMounted = useIsMounted();

    useEffect(() => {
        function handleEscapeKey(event) {
            if (!isMounted()) return;

            if (event.code === "Escape") {
                if (props.Modal.length > 0) {
                    handleClose(props.Modal[props.Modal.length - 1]);
                }
            }
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [props.Modal]);

    const handleClose = (item) => {
        props.closeModal(item.name, item.id);
    };

    return (
        <For each="item" of={props.Modal}>
            <Choose>
                <When condition={item.name == POPUP_NAME.POPUP_STAFFS}>
                    <PopupStaff
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        onClose={() => handleClose(item)}
                    />
                </When>
                <When condition={item.name == POPUP_NAME.POPUP_PRODUCTS}>
                    <PopupPhuTung
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        onClose={() => handleClose(item)}
                    />
                </When>
                <When condition={item.name == POPUP_NAME.POPUP_SALARIES}>
                    <PopupSalary
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        onClose={() => handleClose(item)}
                    />
                </When>
                <When condition={item.name == POPUP_NAME.POPUP_STORE_OUTSIDES}>
                    <PopupStoreOutside
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        onClose={() => handleClose(item)}
                    />
                </When>
                <When condition={item.name == POPUP_NAME.POPUP_COMFIRM_BILL}>
                    <PopupConfirmBill
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        history={props.history}
                        onClose={() => handleClose(item)}
                    />
                </When>
                <When condition={item.name == POPUP_NAME.POPUP_BILL}>
                    <PopupBill
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        history={props.history}
                        onClose={() => handleClose(item)}
                    />
                </When>
                <When condition={item.name == POPUP_NAME.POPUP_CUSTOMER_HISTORY}>
                    <PopupCustomerHistory
                        key={item.id}
                        callback={item.callback}
                        open={item.open}
                        item={item.data}
                        alert={props.alert}
                        comfirm={props.comfirm}
                        openModal={props.openModal}
                        history={props.history}
                        onClose={() => handleClose(item)}
                    />
                </When>
            </Choose>
        </For>
    );
};

/* eslint-enable no-undef */

const mapState = (state) => ({
    Modal: state.Modal,
});

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(withRouter(ModalManager));
