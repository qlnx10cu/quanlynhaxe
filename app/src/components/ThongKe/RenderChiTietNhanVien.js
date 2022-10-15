import React from "react";

const RenderChiTietNhanVien = ({ staff }) => {
    return (
        <React.Fragment>
            <h3> Nhân viên bán hàng : {staff ? staff.ten : <div></div>}</h3>
        </React.Fragment>
    );
};

export default RenderChiTietNhanVien;
