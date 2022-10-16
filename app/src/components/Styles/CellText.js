import React from "react";

const CellText = ({ children, style, className }) => {
    return (
        <td style={{ ...style }} className={className}>
            {children}
        </td>
    );
};

export default CellText;
