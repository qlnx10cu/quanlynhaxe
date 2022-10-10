import React from "react";
import { CancleButton } from "../../styles";

const ButtonClose = ({ data, onClick, isUpload, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(e, data, false);
        }
    };

    return (
        <CancleButton style={{ ...style }} className={className} onClick={handleOnClick} disabled={isUpload}>
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>Hủy</If>
        </CancleButton>
    );
};

export default ButtonClose;
