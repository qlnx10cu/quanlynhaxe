import React from "react";
import { Button } from "../../styles";

const ButtonView = ({ children, data, onClick, isUpload, title, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        }
    };

    return (
        <Button style={{ ...style }} className={className} onClick={handleOnClick} disabled={isUpload} title={title || "Xem chi tiết"}>
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <i className="fas fa-eye"></i>
                {children}
            </If>
        </Button>
    );
};

export default ButtonView;
