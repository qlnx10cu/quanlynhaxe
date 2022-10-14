import React, { useState } from "react";
import { connect } from "react-redux";
import { alert } from "../../actions/App";
import { CancleButton, CloseButton, DivFlexRow, Modal, ModalContent } from "../../styles";
import { ButtonUpload } from "../Styles";
import useIsMounted from "../../lib/useIsMounted";

const ModalWrapper = ({ title, open, onClose, submit, titleSubmit, callback, alertMsg, children }) => {
    const [isUpload, setUpload] = useState(false);
    const isMounted = useIsMounted();

    const handleCallback = () => {
        if (!isMounted()) return;
        if (!submit) return;

        setUpload(true);

        submit()
            .then((data) => {
                if (!isMounted()) return;
                setUpload(false);
                if (callback) {
                    callback(data);
                }
                if (onClose) {
                    onClose(true);
                }
            })
            .catch((err) => {
                if (!isMounted()) return;
                setUpload(false);
                if (err) {
                    alertMsg(err.message);
                }
            });
    };

    return (
        <Modal className={open ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                    <h2 style={{ display: "flex", justifyContent: "center" }}>{title}</h2>
                </div>
                {children}
                <DivFlexRow style={{ marginTop: 50, marginBottom: 5, justifyContent: "flex-end", alignItems: "center" }}>
                    <DivFlexRow></DivFlexRow>
                    <CancleButton onClick={onClose}>Hủy</CancleButton>
                    <If condition={submit}>
                        <DivFlexRow></DivFlexRow>
                        <ButtonUpload isUpload={isUpload} onClick={() => handleCallback()}>
                            {titleSubmit || "Đồng ý"}
                        </ButtonUpload>
                    </If>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};

const mapDispatch = (dispatch) => ({
    alertMsg: (mess) => {
        dispatch(alert(mess));
    },
});

export default connect(null, mapDispatch)(ModalWrapper);
