import React from "react";

const IconCircle = ({ style, status }) => {
    return (
        <React.Fragment>
            <i className="fa fa-circle" style={{ ...style, color: status == 1 ? "green" : status == 2 ? "red" : "#00ffd0" }} />
            {status == 1 ? "Thành công" : status == 2 ? "Gọi nhỡ" : "Đang gọi"}
        </React.Fragment>
    );
};

export default IconCircle;
