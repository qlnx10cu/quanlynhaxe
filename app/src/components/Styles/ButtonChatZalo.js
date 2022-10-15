import React from "react";
import { Button } from "../../styles";

const ButtonChatZalo = ({ data, alert, onClick, isUpload, title, style, className }) => {
    const handleOnClick = (e) => {
        if (onClick) {
            onClick(data, e);
        } else {
            chatCustomer();
        }
    };

    const chatCustomer = () => {
        if (!data || !data.zaloid) {
            alert("Chưa có thông tin zalo từ khách hàng này");
        } else {
            window.open(`https://oa.zalo.me/chatv2?uid=${data.zaloid}&oaid=2867735993958514567`, "_blank");
        }
    };

    return (
        <Button style={{ ...style }} className={className} onClick={handleOnClick} disabled={isUpload} title={title || "Nhắn tin khách hàng"}>
            <If condition={isUpload}>
                <i className="fas fa-spinner fa-spin"></i>
            </If>
            <If condition={!isUpload}>
                <i className="fas fa-comment"></i>
            </If>
        </Button>
    );
};

export default ButtonChatZalo;
