import React from "react";
import { Button } from "../../styles";

const ButtonEdit = ({ children, data, onClick, isUpload, title, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        }
    };

    return (
        <Button
            style={{ marginLeft: 5, height: 30, width: 30, display: "inline-flex", justifyContent: "center", alignItems: "center", ...style }}
            className={className}
            onClick={handleOnClick}
            disabled={isUpload}
            title={title || "Cập nhập"}
        >
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <i className="fas fa-edit"></i>
                {children}
            </If>
        </Button>
    );
};

export default ButtonEdit;
