import React from "react";
import { Button } from "../../styles";

const ButtonEdit = ({ children, data, onClick, isUpload, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        }
    };

    return (
        <Button style={{ ...style }} className={className} onClick={handleOnClick} disabled={isUpload}>
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
