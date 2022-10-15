import React from "react";
import { DelButton } from "../../styles";

const ButtonDelete = ({ children, data, onClick, isUpload, title, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        }
    };

    return (
        <DelButton
            style={{ marginLeft: 5, height: 30, width: 30, display: "inline-flex", justifyContent: "center", alignItems: "center", ...style }}
            className={className}
            onClick={handleOnClick}
            disabled={isUpload}
            title={title || "Xóa"}
        >
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <i className="far fa-trash-alt"></i>
                {children}
            </If>
        </DelButton>
    );
};

export default ButtonDelete;
