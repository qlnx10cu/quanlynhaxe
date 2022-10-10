import { useState } from "react";

export default function (init, callback) {
    let [value, setValueState] = useState(init);

    const _setValue = (val) => {
        value = val;
        setValueState(val);
    };

    const onChange = function (e) {
        setValue(e.target.value);
        if (callback) {
            callback(value);
        }
    };

    const setValue = (val) => {
        if (init === null || init === undefined) {
            _setValue(val);
        } else if (typeof init === "number" && Number.isInteger(init)) {
            try {
                _setValue(parseInt(val));
            } catch (error) {
                _setValue(0);
            }
        } else if (typeof init === "number" && !Number.isInteger(init)) {
            try {
                _setValue(parseFloat(val));
            } catch (error) {}
            _setValue(0);
        } else {
            _setValue(val);
        }
    };

    return {
        value: value || "",
        onChange: onChange,
        setValue: setValue,
    };
}
