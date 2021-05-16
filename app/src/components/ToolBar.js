import React, { useState, useEffect } from 'react'
import { WraperToolBar, DivFlexRow } from '../styles'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ImgStaff from '../icon/staff.svg'
import ImgProduct from '../icon/product.svg'
import ImgRepairPrice from '../icon/repairPrice.svg'
import ImgLogout from '../icon/logout.svg'
import ImgServices from '../icon/services.svg'
import ImgBanLe from '../icon/banle.svg'
import ImgChamCong from '../icon/chamcong.svg'
import ImgThongKe from '../icon/thongke.svg'
import ImgBack from '../icon/back.svg'
import ImgCustomer from '../icon/customer.svg'
import { logout } from '../actions/Authenticate';
import { getAllProduct } from '../actions/Product'

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
        img: ImgBack,
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng"],
        onClick: (history) => {
            history.goBack();
        },
    },
    {
        index: 1,
        title: "Sản Phẩm",
        img: ImgProduct,
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng"],
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
        img: ImgStaff,
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
        img: ImgRepairPrice,
        Roles: ["Admin", "Dịch Vụ", "Văn Phòng"],
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
        img: ImgServices,
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
        img: ImgBanLe,
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
        img: ImgCustomer,
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng"],
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
        img: ImgChamCong,
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
        img: ImgThongKe,
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng"],
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
        title: "Cửa hàng ngoài",
        img: ImgThongKe,
        Roles: ["Admin", "Dịch Vụ", "Phụ Tùng", "Văn Phòng"],
        onClick: (history, setIndex) => {
            if (history.location.pathname !== '/cuahangngoai') {
                history.push("/cuahangngoai");
            }

            setIndex(9);
            document.title = "Cửa hàng ngoài";
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
            <CToolBarItem title={"Đăng xuất"} img={ImgLogout} onClick={() => props.logout()} />
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