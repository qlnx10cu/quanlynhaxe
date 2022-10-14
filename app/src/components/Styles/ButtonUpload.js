import React from "react";
import { Button } from "../../styles";

const ButtonUpload = ({ children, style, onClick, isUpload }) => {
    return (
        <Button style={{ ...style }} onClick={onClick} disabled={isUpload}>
            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : children}
        </Button>
    );
};

export default ButtonUpload;
