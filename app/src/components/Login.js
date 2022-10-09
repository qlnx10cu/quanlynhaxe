import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LoginInput from "./LoginInput";
import { connect } from "react-redux";
import lib from "../lib";
import { authenticate } from "../actions/Authenticate";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    min-width: 768px;
    min-height: 600px;
    background-color: #7f8c8d;
`;

const Form = styled.form`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 5px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Button = styled.button`
    background-color: #2ecc71;
    width: 100px;
    height: 40px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    box-shadow: none;
    outline: none;
    font-weight: bold;
    font-size: 1em;
    box-shadow: 0 4px #999;
    border: none;
    :hover {
        background-color: #27ae60;
    }
    :active {
        transform: translateY(4px);
        box-shadow: 0 0 #999;
    }
`;

const Title = styled.h2`
    text-align: center;
    font-size: 2em;
`;

const DefaultError = {
    Username: {
        message: "",
        show: false,
    },
    Password: {
        message: "",
        show: false,
    },
};

const Login = (props) => {
    useEffect(() => {
        document.title = "Đăng nhập";
    }, []);
    let Username = lib.handleInput("");
    let Password = lib.handleInput("");
    let [errors, setErrors] = useState(DefaultError);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let tmp = {};
        let isError = false;
        if (Username.value.length === 0) {
            tmp = { ...tmp, Username: { message: "Tài khoản không được để trống.", show: true } };
            isError = true;
        }
        if (Password.value.length === 0) {
            tmp = { ...tmp, Password: { message: "Mật khẩu không được để trống.", show: true } };
            isError = true;
        }
        if (isError) {
            await setErrors(tmp);
            return setTimeout(() => setErrors(DefaultError), 2000);
        }
        // Login
        props.authenticate(Username.value, Password.value);
    };
    return (
        <Wrapper>
            <Form width={"400px"} height={"300px"} onSubmit={handleSubmit}>
                <Title>ĐĂNG NHẬP</Title>
                <LoginInput
                    {...Username}
                    placeholder="Tên đăng nhập"
                    name="Tên đăng nhập"
                    message={errors["Username"] && errors["Username"].message}
                    error={errors["Username"] && errors["Username"].show}
                />
                <LoginInput
                    type="password"
                    {...Password}
                    placeholder="Mật khẩu"
                    name="Mật khẩu"
                    message={errors["Password"] && errors["Password"].message}
                    error={errors["Password"] && errors["Password"].show}
                />
                <Button style={{ marginTop: 15 }}>Đăng nhập</Button>
            </Form>
        </Wrapper>
    );
};

const mapDispatch = (dispatch) => ({
    authenticate: (username, password) => {
        dispatch(authenticate(username, password));
    },
});

export default connect(null, mapDispatch)(Login);
