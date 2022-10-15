import React from "react";
import utils from "../../lib/utils";

const LabelOverflow = ({ text, style }) => {
    const handleClick = () => {
        if (text) {
            utils.copyText(text);
        }
    };

    return (
        <React.Fragment>
            <div
                style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100px", ...style }}
                onDoubleClick={handleClick}
            >
                {text}
            </div>
        </React.Fragment>
    );
};

export default LabelOverflow;
