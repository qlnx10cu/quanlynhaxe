import React from "react";
import { Select } from "../../styles";

const InputGioiTinh = ({ style, value, onChange, disabled, readOnly, id, name }) => {
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
            <Select style={{ ...style }} {...arr} value={value || 0} onChange={onChange}>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
            </Select>
        </React.Fragment>
    );
};

export default InputGioiTinh;
