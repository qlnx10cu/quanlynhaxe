import React from "react";
import InputList from "./InputList";

const LIST_LOAI_XE = [
    "Airblade",
    "Blade",
    "CBR",
    "Click ",
    "Cub",
    "Dream",
    "Future",
    "Lead",
    "MSX",
    "PCX",
    "PS",
    "SH",
    "SH mode",
    "Sonic",
    "Super Cub",
    "Super Dream",
    "Vario",
    "Vision",
    "Wave",
    "Wave Alpha",
    "Wave RSX",
    "Winner",
    "Khác",
];

const InputLoaiXe = (props) => {
    return (
        <React.Fragment>
            <InputList
                {...props}
                data={LIST_LOAI_XE}
                render={(item, index) => {
                    return (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    );
                }}
            />
        </React.Fragment>
    );
};

export default InputLoaiXe;
