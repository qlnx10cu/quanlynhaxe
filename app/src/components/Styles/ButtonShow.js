import React from "react";
import { Button } from "../../styles";

const ButtonShow = ({ children, data, onClick, isUpload, title, style, className }) => {
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
            title={title || "Chi tiết"}
        >
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <i className="fas fa-newspaper"></i>
                {children}
            </If>
        </Button>
    );
};

export default ButtonShow;
