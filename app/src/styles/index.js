import styled from "styled-components";

const WraperToolBar = styled.div`
    width: auto;
    height: 60px;
    min-height: 60px;
    background-color: #99ddff;
    padding: 5px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`;

// const BaseContainer = styled.div`
//     -webkit-touch-callout: none;
//     -webkit-user-select: none;
//     -khtml-user-select: none;
//     -moz-user-select: none;
//     -ms-user-select: none;
//     user-select: none;
//     padding: 10px;
//     height: 100%;
// `

const Link = styled.a`
    border-bottom: 1px solid blue;
    color: blue;
    cursor: pointer;
`;

const Button = styled.button`
    width: ${(props) => props.width || "auto"}
    height: ${(props) => props.height || "38px"}
    outline: none;
    border-radius: 5px;
    color: white;
    border: none;
    font-size: 16px;
    background-color: #66ccff;
    cursor: pointer;
    padding: 0 15px;

    :hover {
      background-color: #99ddff;
    }

    i {
      padding: 5px;
      font-size: 14px;
    }
`;
const CancleButton = styled.button`
    width: ${(props) => props.width || "auto"}
    height: ${(props) => props.height || "38px"}
    outline: none;
    border-radius: 5px;
    color: #001a33;
    border: none;
    font-size: 16px;
    background-color: #e5e7eb;
    cursor: pointer;
    padding: 0 15px;
    margin-right: 15px;

    :hover {
      background-color: #e1e4ea;
    }

    i {
      padding: 5px;
      font-size: 14px;
    }
`;
const DelButton = styled(Button)`
  width: ${(props) => props.width || "auto"}
  height: ${(props) => props.height || "38px"}
  background-color: #ff8080;
  :hover {
    background-color: #ff9999;
  }
`;

const Modal = styled.div`
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    ${"" /* padding-top: 5%; */}
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    animation-name: fadeIn;
    animation-duration: 0.4s;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    &.active {
        display: block;
    }
`;

const ModalContent = styled.div`
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    width: 75%;
    animation-name: slideIn;
    animation-duration: 0.4s;

    @keyframes slideIn {
        from {
            top: -300px;
            opacity: 0;
        }
        to {
            top: 0;
            opacity: 1;
        }
    }
`;

const ModalAlert = styled.div`
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    ${"" /* padding-top: 5%; */}
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    animation-name: fadeIn;
    animation-duration: 0.4s;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    &.active {
        display: flex;
    }
`;

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    text-align: center;

    td {
        border: 1px solid #ddd;
        padding: 8px;
        font-size: 14px;
    }

    a {
        border-bottom: 1px solid blue;
        color: blue;
        cursor: pointer;
    }

    tr:hover {
        background-color: #ddd;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    th {
        padding-top: 12px;
        padding-bottom: 12px;
        background-color: #999966;
        color: white;
        border: 1px solid #ddd;
        padding: 8px;
        font-size: 14px;
    }

    input[type="text"],
    select,
    textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
    }
`;
const CloseButton = styled.span`
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;

    :hover,
    focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
`;
const DivFlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const DivFlexRow = styled.div`
    display: flex;
`;

const Select = styled.select`
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.8);
    height: 36px;
    padding: 8px 20px;
    margin: 8px 0;
    font-size: 14px;
    background: white;
    width: ${(props) => props.width || "200px"};
    min-width: 100px;

    :disabled {
        color: black;
        opacity: 1;
    }
`;

const Input = styled.input`
    width: ${(props) => props.width || "auto"};
    padding: 8px 20px;
    margin: 8px 0;

    :disabled {
        opacity: 1;
    }

    :read-only {
        background: rgba(0, 0, 0, 0.15);
    }
`;

const Textarea = styled.textarea`
    width: ${(props) => props.width || "auto"};
    padding: 8px 20px;
    margin: 8px 0;
`;

const ProductContainer = styled.div`
    display: none;
    width: auto;
    height: auto;

    &.active {
        display: block;
    }
`;

const ButtonFile = styled.label`
    border: 1px solid #ccc;
    border-radius: 3px;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    margin-top: 10px;
    color: white;
    background: #66ccff;

    :hover {
        background-color: #99ddff;
    }

    input[type="file"] {
        display: none;
    }
`;

const Tab = styled.div`
    overflow: hidden;
    border-bottom: 1px solid #ccc;

    button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
        font-size: 17px;

        :hover {
            background-color: #ddd;
        }

        &.active {
            background-color: #ccc;
        }
    }
`;

const TabContent = styled.div`
    display: none;

    &.active {
        display: block;
    }
`;

const RepairWraper = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    margin: 15px 0px;
`;

const RepairItem = styled.div`
    max-width: 300px;
    width: 20%;
    height: 180px;
    background-color: #e6e6e6;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    position: relative;

    img {
        width: 100px;
        height: 100px;
    }

    span {
        margin-top: 10px;
        font-size: 16px;
        color: black;
        font-weight: bold;
    }

    .STT {
        position: absolute;
        top: 0;
        left: 0;
        font-weight: bold;
        font-size: 45px;
        padding: 5px;
    }

    &.working {
        background-color: #ff6666;
    }

    &.dangnhap {
        background-color: #ff0066;
    }
`;

export {
    WraperToolBar,
    DivFlexRow,
    DivFlexColumn,
    Button,
    DelButton,
    Modal,
    ModalContent,
    ModalAlert,
    Input,
    Textarea,
    Table,
    Tab,
    TabContent,
    Select,
    CloseButton,
    Link,
    CancleButton,
    ProductContainer,
    ButtonFile,
    RepairWraper,
    RepairItem,
};
