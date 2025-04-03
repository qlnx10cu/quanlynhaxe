import React from "react";
import { Select } from "../../styles";

const InputLoaiKhachHang = ({ style, value, onChange, disabled, readOnly, id, name }) => {
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
                <option value="SI">Sỉ</option>
                <option value="LE">Lẻ</option>
                <option value="THO_NGOAI">Thợ ngoài</option>
            </Select>
        </React.Fragment>
    );
};

export default InputLoaiKhachHang;
