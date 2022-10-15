import moment from "moment/moment";
import { useState } from "react";

export default function (formatInput, formatValue, init, callback) {
    let [value, setValueState] = useState(moment(init).format(formatInput));

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

    const getValue = (fm) => {
        fm = fm || formatValue || formatInput;
        return moment(value).format(fm);
    };

    const setValue = (val) => {
        _setValue(moment(val).format(formatInput));
    };

    return {
        value: value || "",
        getValue: getValue,
        onChange: onChange,
        setValue: setValue,
    };
}
