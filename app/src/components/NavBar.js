import React from "react";
import styled from "styled-components";

const NavBarContainer = styled.div`
    min-height: 50px;
    padding: 0px 15px;
    background-color: #99ddff;
    display: flex;
    font-size: 20px;
    color: gray;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
`;

const RightContainer = styled.div`
    display: flex;
    align-items: center;
`;
const Dropdown = styled.div`
    margin: 0 30px;
    display: inline-block;
    position: relative;
    :hover {
        cursor: pointer;
    }
`;

const DropdownContent = styled.div`
    display: ${(props) => (props.show ? "block" : "none")};
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background-color: white;
    border-radius: 5px;
    min-width: 160px;
    overflow: auto;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

    span {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        font-size: 16px;

        :hover {
            background-color: #ddd;
        }
    }
`;

const Title = styled.div`
    display: flex;
    align-items: center;

    :hover {
        cursor: pointer;
    }

    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
        font-size: 14px;
    }

    img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }
`;

/* eslint-disable no-invalid-this */

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    handleClickOut = () => {
        this.setState({ show: false });
        document.removeEventListener("click", this.handleClickOut);
    };

    handleOptionClick = () => {
        if (!this.state.show) {
            document.addEventListener("click", this.handleClickOut);
            this.setState({ show: true });
        } else {
            this.setState({ show: false });
        }
    };

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOut);
    }

    componentDidMount() {
    }

    render() {
        return (
            <NavBarContainer onClick={this.handleOptionClick}>
                <Title>
                    <img src="/resources/img/logo.png" alt="HEAD Trung Trang" />
                    <span>{this.props.ten || "Loading ..."}</span>
                </Title>

                <RightContainer>
                    <Dropdown>
                        <span>{this.props.userName}</span>
                        <i className="fas fa-caret-down" style={{ marginLeft: 5 }}></i>

                        <DropdownContent show={this.state.show}>
                            <span onClick={this.props.handleCaiDat}>Cài Đặt</span>
                            <span onClick={() => this.props.logout()}>Đăng xuất</span>
                        </DropdownContent>
                    </Dropdown>
                </RightContainer>
            </NavBarContainer>
        );
    }
}

/* eslint-enable no-invalid-this */

// export default connect(mapState, mapDispatch)(NavBar);
export default NavBar;
