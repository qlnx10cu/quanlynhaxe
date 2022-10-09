import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { alert } from "../actions/App";
import { closeModal, POPUP_NAME } from "../actions/Modal";
import useIsMounted from "../lib/useIsMounted";
import PopupStaff from "./Modal/PopupStaff";
import ModalWrapper from "./Warrper/ModalWrapper";

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
                        onCloseClick={() => handleClose(item)}
                        onClose={() => handleClose(item)}
                    ></PopupStaff>
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
