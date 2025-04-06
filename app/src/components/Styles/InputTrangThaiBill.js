import React from "react";
import { Select } from "../../styles";

const InputTrangThaiBill = ({ style, value, onChange, disabled, readOnly, id, name }) => {
    let arr = {};
    if (readOnly !== undefined) {
        arr.readOnly = readOnly;
    }
    if (disabled !== undefined) {
        arr.disabled = disabled;
    }
    if (id !== undefined) {
        arr.id = id;
    }
    if (name !== undefined) {
        arr.name = name;
    }

    return (
        <React.Fragment>
            <Select style={{ ...style }} {...arr} value={value || "LE"} onChange={onChange}>
                <option value={null}>Tất cả</option>
                <option value={0}>Chưa thanh toán</option>
                <option value={1}>Đã thanh toán</option>
                <option value={2}>Đã huỷ</option>
            </Select>
        </React.Fragment>
    );
};

export default InputTrangThaiBill;
