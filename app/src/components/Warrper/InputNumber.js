import React from "react";
import { DelButton, Input } from "../../styles";

const InputNumber = ({ style, className, name, list, id, max, min, readOnly, disabled, value, onChange, onEnter, listRender }) => {
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
    if (list !== undefined) {
        arr.list = list;
    }
    if (max !== undefined) {
        arr.max = max;
    }
    if (min !== undefined) {
        arr.min = min;
    }
    if (value !== undefined) {
        arr.value = value;
    }
    if (onChange !== undefined) {
        arr.onChange = onChange;
    }
    if (className !== undefined) {
        arr.className = className;
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onEnter(e);
        }
    };

    return (
        <React.Fragment>
            <Input style={{ ...style }} {...arr} onKeyPress={handleKeyPress} />
            <If condition={list && listRender}>
                <datalist id={list}>{listRender}</datalist>
            </If>
        </React.Fragment>
    );
};

export default InputNumber;
