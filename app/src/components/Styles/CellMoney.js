import React from "react";
import utils from "../../lib/utils";

const CellMoney = ({ children, style, className }) => {
    return (
        <td style={{ ...style }} className={className}>
            {utils.formatVND(children)}
        </td>
    );
};

export default CellMoney;
