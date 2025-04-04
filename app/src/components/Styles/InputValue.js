import React from "react";
import { Input } from "../../styles";

const InputValue = ({ style, type, autocomplete, className, name, id, max, min, readOnly, disabled, value, onChange, onEnter }) => {
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
    if (name !== undefined) {
        arr.autocomplete = autocomplete;
    }
    if (type !== undefined) {
        arr.type = type;
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
        </React.Fragment>
    );
};

export default InputValue;
