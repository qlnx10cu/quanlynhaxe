import React, { useState, useEffect } from 'react'
import { WraperToolBar, DivFlexRow } from '../styles'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { logout } from '../actions/Authenticate';
import { getAllProduct } from '../actions/Product'
import NavBar from './NavBar'

const ToolBarItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid white;
    padding: 0px 10px;
    cursor: pointer;
    width: 85px;
    min-width: 85px;

    span {
        text-align: center;
        font-size: 14px;
        color: white;
        padding: 5px;
        
        &.active {
            text-decoration: underline;
        }
    }
`;

const Icon = styled.img`
    width: 40px;
    height: 40px;
`;

const CToolBarItem = (props) => {
    return (
        <ToolBarItem onClick={props.onClick}>
            <Icon alt="staff" src={props.img} />
            <span className={props.isActive ? "active" : ""}>{props.title}</span>
        </ToolBarItem>
    )
};


const RenderByRole = (props) => {
    let canRender = props.Roles.indexOf(props.Role);

    if (canRender > -1) {
        return (
            <>
                {props.children}
            </>
        )
    }
    else {
        return <></>
    }
};

const ListToolBar = [
    {
        index: 0,
        title: "Back",
        img: "/resources/icon/back.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng", "CSKH"],
        onClick: (history) => {
            history.goBack();
        },
    },
    {
        index: 1,
        title: "Sản Phẩm",
        img: "/resources/icon/product.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/products') {
                history.push("/products");
            }
            setIndex(1);
            document.title = "Sản Phẩm";
        },
    },
    {
        index: 2,
        title: "Nhân Viên",
        img: "/resources/icon/staff.svg",
        Roles: ["Admin"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/staffs')
                history.push("/staffs");
            setIndex(2);
            document.title = "Nhân Viên";
        },
    },
    {
        index: 3,
        title: "Tiền Công",
        img: "/resources/icon/repairPrice.svg",
        Roles: ["Admin", "Dịch Vụ", "Văn Phòng", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/repairPrice')
                history.push("/repairPrice");
            setIndex(3);
            document.title = "Tiền Công";
        }
    },
    {
        index: 4,
        title: "Dịch vụ",
        img: "/resources/icon/services.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/services') {
                history.push("/services");
            }
            setIndex(4);
            document.title = "Dịch vụ sửa chữa";
        },
    },
    {
        index: 5,
        title: "Bán Lẻ",
        img: "/resources/icon/banle.svg",
        Roles: ["Admin", "Phụ Tùng"],
        onClick: (history, setIndex) => {
            if (!history.location.pathname.includes('/banle')) {
                history.push("/banle");
            } else {
                if (history.location.search.indexOf("mahoadon")) {
                    history.push("/banle");
                    history.push("/banle");
                    history.goBack();
                }
            }

            setIndex(5);
            document.title = "Hóa đơn bán lẻ";
        },
    },
    {
        index: 6,
        title: "Khách Hàng",
        img: "/resources/icon/customer.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/customer') {
                history.push("/customer");
            }

            setIndex(6);
            document.title = "Khách Hàng";
        },
    },
    {
        index: 7,
        title: "Chấm công",
        img: "/resources/icon/chamcong.svg",
        Roles: ["Admin", "Dịch Vụ", "Văn Phòng"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/chamcong') {
                history.push("/chamcong");
            }

            setIndex(7);
            document.title = "Chấm công nhân viên";
        },
    }, {
        index: 8,
        title: "Thống kê",
        img: "/resources/icon/thongke.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/thongke') {
                history.push("/thongke");
            }

            setIndex(8);
            document.title = "Thống kê bill";
        },
    },
    {
        index: 9,
        title: "Hàng ngoài",
        img: "/resources/icon/banle.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/cuahangngoai') {
                history.push("/cuahangngoai");
            }

            setIndex(9);
            document.title = "Hàng ngoài";
        },
    }, {
        index: 10,
        title: "Cuộc gọi",
        img: "/resources/icon/staff.svg",
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/cuocgoi') {
                history.push("/cuocgoi");
            }

            setIndex(10);
            document.title = "Cuộc gọi";
        },
    }, {
        index: 11,
        title: "CSKH",
        img: "/resources/icon/staff.svg",
        Roles: ["Admin", "CSKH"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/chamsockhachhang') {
                history.push("/chamsockhachhang");
            }

            setIndex(11);
            document.title = "CSKH";
        },
    },
];

const ToolBar = (props) => {

    let [index, setIndex] = useState(0);
    let [Role, setRole] = useState(null);

    useEffect(() => {
        if (props.info !== null) {
            setRole(props.info.chucvu);
        }
    }, [props.info]);
    const handleCaiDat = () => {
        props.history.push("/caidat");
        document.title = "Cài Đặt";
    }
    return (
        <WraperToolBar>
            <DivFlexRow>
                {
                    Role && ListToolBar.map(item => (
                        <React.Fragment key={item.index}>
                            <RenderByRole Roles={item.Roles} Role={Role}>
                                <CToolBarItem
                                    isActive={index === item.index}
                                    title={item.title} img={item.img} onClick={() =>
                                        item.onClick(props.history, setIndex)}
                                />
                            </RenderByRole>
                        </React.Fragment>
                    ))
                }
            </DivFlexRow>
            {/* <CToolBarItem title={"Thông Tin"} img={"/resources/icon/logout.svg"} onClick={() => props.logout()} /> */}
            <NavBar ten={props.info && props.info.ten} logout={() => props.logout()} handleCaiDat={handleCaiDat} />

        </WraperToolBar>
    )
};
const mapState = (state) => ({
    info: state.Authenticate.info,
    token: state.Authenticate.token,
});
const mapDispatch = (dispatch) => ({
    logout: () => { dispatch(logout()) },
    getAllProduct: (token) => { dispatch(getAllProduct(token)) }
});

export default connect(mapState, mapDispatch)(withRouter(ToolBar));