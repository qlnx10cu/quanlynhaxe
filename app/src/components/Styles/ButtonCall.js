import React from "react";
import { Button } from "../../styles";

const ButtonCall = ({ data, confirm, alert, onClick, isUpload, title, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        } else {
            callCustomer();
        }
    };

    const callCustomer = () => {
        const phone = data.sodienthoai || data.zaloid || (data.direction == "agent2user" ? data.tosip : data.fromsip);
        if (!phone) {
            alert("Không tìm thấy thông tin khách hàng");
            return;
        }

        confirm(`Bạn muốn gọi ${data.tenkh || data.ten} (${phone}) `, () => {
            try {
                window.open(`microsip://callto:${phone}`);
            } catch (ex) {}
        });
    };

    return (
        <Button
            style={{ marginLeft: 5, height: 30, width: 30, display: "inline-flex", justifyContent: "center", alignItems: "center", ...style }}
            className={className}
            onClick={handleOnClick}
            disabled={isUpload}
            title={title || "Gọi khách hàng"}
        >
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
