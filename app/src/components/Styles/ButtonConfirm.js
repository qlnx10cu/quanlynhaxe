import React from "react";
import { connect } from "react-redux";
import * as App from "../../actions/App";
import { Button } from "../../styles";

const ButtonConfirm = ({ children, onClick, isUpload, title, titleConfirm, confirm, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick && confirm) {
            confirm(titleConfirm || "Vui lòng xác nhận", () => {
                onClick(e);
            });
        }
    };

    return (
        <Button style={{ ...style }} className={className} onClick={handleOnClick} disabled={isUpload} title={title || "Xác nhận"}>
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>{children ? children : title}</If>
        </Button>
    );
};

const mapDispatch = (dispatch) => ({
    confirm: (mess, callback) => dispatch(App.confirm(mess, callback)),
});
export default connect(null, mapDispatch)(ButtonConfirm);
