import React from "react";
import styled from "styled-components";

const Name = styled.div`
    position: absolute;
    display: ${(props) => (props.hidden ? "none" : "block")};
    top: -7px;
`;
const Message = styled.div`
    position: absolute;
    display: ${(props) => (props.hidden ? "none" : "block")};
    top: 65px;
    color: #c0392b;
    font-size: 13px;
    text-align: right;
    width: 100%;
`;

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

const LoginInput = ({ name, message, error, ...res }) => {
    let hidden = !res.value;
    return (
        <div style={{ width: "90%", position: "relative" }}>
            <Name hidden={hidden}>{name}</Name>
            <Input {...res} style={{ borderColor: error ? "#c0392b" : "" }} />
            <Message hidden={!error}>{message}</Message>
        </div>
    );
};

export default LoginInput;
