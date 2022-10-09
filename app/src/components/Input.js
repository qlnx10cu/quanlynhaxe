import React from "react";
import styled from "styled-components";

const Input = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    outline: none;
    border-radius: 5px;
    font-size: 1em;
    padding: 5px;
    margin: 10px 0;
    :focus {
        border: 1px solid rgba(0, 0, 0, 0.6);
    }
`;

export default (props) => {
    return <Input {...props} />;
};
