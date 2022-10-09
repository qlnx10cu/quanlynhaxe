import { useState } from "react";

export default function (init) {
    let [value, setValueState] = useState(init);

    const onChange = function (e) {
        setValue(e.target.value);
    };

    const setValue = (val) => {
        if (init === null || init === undefined) {
            setValueState(val);
        } else if (typeof init === "number" && Number.isInteger(init)) {
            try {
                setValueState(parseInt(val));
            } catch (error) {
                setValueState(0);
            }
        } else if (typeof init === "number" && !Number.isInteger(init)) {
            try {
                setValueState(parseFloat(val));
            } catch (error) {}
            setValueState(0);
        } else {
            setValueState(val);
        }
    };

    return {
        value: value || "",
        onChange: onChange,
        setValue: setValue,
    };
}
