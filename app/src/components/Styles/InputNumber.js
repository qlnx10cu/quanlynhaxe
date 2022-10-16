import React from "react";
import utils from "../../lib/utils";
import InputValue from "./InputValue";

const InputNumber = (props) => {
    return (
        <React.Fragment>
            <InputValue {...props} type="Number" value={props.value || 0} />
        </React.Fragment>
    );
};

export default InputNumber;
