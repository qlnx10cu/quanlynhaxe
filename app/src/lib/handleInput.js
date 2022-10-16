import { useState } from "react";
import utils from "./utils";

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
            _setValue(utils.parseInt(val));
        } else if (typeof init === "number" && !Number.isInteger(init)) {
            _setValue(utils.parseFloat(val));
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
