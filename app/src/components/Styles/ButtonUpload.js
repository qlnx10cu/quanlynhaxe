import React from "react";
import { Button } from "../../styles";

const ButtonUpload = ({ children, onClick, isUpload }) => {
    return (
        <Button width="100px" onClick={onClick} disabled={isUpload}>
            {isUpload ? <i className="fas fa-spinner fa-spin"></i> : children}
        </Button>
    );
};

export default ButtonUpload;
