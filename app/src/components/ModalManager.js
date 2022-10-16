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
import PopupCustomerCareNote from "./Modal/PopupCustomerCareNote";
import PopupCustomer from "./Modal/PopupCustomer";
import PopupAddStoreOutside from "./Modal/PopupAddStoreOutside";
import PopupAddProduct from "./Modal/PopupAddProduct";

const ArrayModal = {};

ArrayModal[POPUP_NAME.POPUP_STAFFS] = <PopupStaff />;
ArrayModal[POPUP_NAME.POPUP_PRODUCTS] = <PopupPhuTung />;
ArrayModal[POPUP_NAME.POPUP_SALARIES] = <PopupSalary />;
ArrayModal[POPUP_NAME.POPUP_STORE_OUTSIDES] = <PopupStoreOutside />;
ArrayModal[POPUP_NAME.POPUP_COMFIRM_BILL] = <PopupConfirmBill />;
ArrayModal[POPUP_NAME.POPUP_BILL] = <PopupBill />;
ArrayModal[POPUP_NAME.POPUP_CUSTOMER_CARE_NOTE] = <PopupCustomerCareNote />;
ArrayModal[POPUP_NAME.POPUP_CUSTOMER_HISTORY] = <PopupCustomerHistory />;
ArrayModal[POPUP_NAME.POPUP_CUSTOMER] = <PopupCustomer />;
ArrayModal[POPUP_NAME.POPUP_CUSTOMER_ADD_STORE_OUTSIDES] = <PopupAddStoreOutside />;
ArrayModal[POPUP_NAME.POPUP_CUSTOMER_ADD_PRODUCT] = <PopupAddProduct />;

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
        <For
            of={props.Modal}
            body={(item, index) => {
                return (
                    <If key={index} condition={ArrayModal[item.name]}>
                        {React.cloneElement(ArrayModal[item.name], {
                            key: item.id,
                            callback: item.callback,
                            open: item.open,
                            item: item.data,
                            alert: props.alert,
                            confirm: props.confirm,
                            history: props.history,
                            openModal: props.openModal,
                            onClose: () => handleClose(item),
                        })}
                    </If>
                );
            }}
        ></For>
    );
};

const mapState = (state) => ({
    Modal: state.Modal,
});

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(withRouter(ModalManager));
