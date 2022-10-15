import React from "react";
import { Button } from "../../styles";

const ButtonCall = ({ data, confirm, onClick, isUpload, title, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        } else {
            callCustomer();
        }
    };

    const callCustomer = () => {
        confirm(`Bạn muốn gọi ${data.ten} (${data.sodienthoai}) `, () => {
            window.open(`microsip://callto:${data.sodienthoai}`);
        });
    };

    return (
        <Button style={{ ...style }} className={className} onClick={handleOnClick} disabled={isUpload} title={title || "Gọi khách hàng"}>
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <i className="fas fa-phone"></i>
            </If>
        </Button>
    );
};

export default ButtonCall;
