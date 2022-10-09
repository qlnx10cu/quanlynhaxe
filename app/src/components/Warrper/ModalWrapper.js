import React, { useState } from "react";
import { connect } from "react-redux";
import { alert, error } from "../../actions/App";
import useIsMounted from "../../lib/useIsMounted";
import { CancleButton, CloseButton, DivFlexRow, Modal, ModalContent } from "../../styles";
import ButtonUpload from "./ButtonUpload";

const ModalWrapper = (props) => {
    const [isUpload, setUpload] = useState(false);
    const isMounted = useIsMounted();

    const handleCallback = () => {
        if (!isMounted()) return;
        if (!props.submit) return;

        setUpload(true);

        props.submit(
            (data) => {
                if (!isMounted()) return;
                setUpload(false);
                if (props.callback) {
                    props.callback(data);
                }
                if (props.onClose) {
                    props.onClose(true);
                }
            },
            (err) => {
                if (!isMounted()) return;
                setUpload(false);
                if (err) {
                    props.alert(err);
                }
            }
        );
    };

    return (
        <Modal className={props.open ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={props.onClose}>&times;</CloseButton>
                    <h2 style={{ display: "flex", justifyContent: "center" }}>{props.title}</h2>
                </div>
                {props.children}
                <DivFlexRow style={{ marginTop: 50, marginBottom: 5, justifyContent: "flex-end", alignItems: "center" }}>
                    <DivFlexRow></DivFlexRow>
                    <CancleButton onClick={props.onClose}>Hủy</CancleButton>
                    <If condition={props.submit}>
                        <DivFlexRow></DivFlexRow>
                        <ButtonUpload isUpload={isUpload} onClick={() => handleCallback()}>
                            {props.titleSubmit || "Đồng ý"}
                        </ButtonUpload>
                    </If>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
};

const mapDispatch = (dispatch) => ({
    alert: (mess) => {
        dispatch(alert(mess));
    },
    error: (mess) => {
        dispatch(error(mess));
    },
});

export default connect(null, mapDispatch)(ModalWrapper);
