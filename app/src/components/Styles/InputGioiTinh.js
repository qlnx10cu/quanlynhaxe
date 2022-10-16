import React from "react";
import { Select } from "../../styles";

const InputGioiTinh = ({ style, value, onChange }) => {
    return (
        <React.Fragment>
            <Select style={{ ...style }} value={value || 0} onChange={onChange}>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
            </Select>
        </React.Fragment>
    );
};

export default InputGioiTinh;
