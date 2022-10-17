import React from "react";
import ButtonDelete from "./ButtonDelete";

const CellDelete = ({ children, style, className, onClick }) => {
    return (
        <td style={{ ...style }} className={className}>
            <ButtonDelete onClick={onClick}>{children}</ButtonDelete>
        </td>
    );
};

export default CellDelete;
