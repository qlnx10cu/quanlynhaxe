import React from 'react'
import ToolBar from './ToolBar'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import styled from 'styled-components'
import IO from 'socket.io-client';
import {HOST} from '../Config'
import LoadingComponent from './LoadingComponent';
import { connect } from 'react-redux'
const Staffs = React.lazy(() => import('./Admin/Staffs'));
const Customer = React.lazy(() => import('./Admin/Customer'));
const Products = React.lazy(() => import('./Products'));
const RepairPrice = React.lazy(() => import('./Admin/RepairPrice'));
const Services = React.lazy(() => import('./Services/Services'));
const RepairedBill = React.lazy(() => import('./Services/RepairedBill'));
const BanLe = React.lazy(() => import('./BanLe'));
const ChamCong = React.lazy(() => import ('./ChamCong'));
const ThongKe = React.lazy(() => import('./ThongKe/index.js'));
const CuaHangNgoai = React.lazy(() => import('./CuaHangNgoai'))

const BaseContainer = styled.div`
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    padding: 10px 20px;
`;
const Home = (props) => {
    const socket = IO(HOST);
    return (
        <Router>
            <ToolBar socket={socket}/>
            <BaseContainer>
                {props.info!=null && <Route exact path="/products" component={LoadingComponent(() =><Products chucvu={props.info.chucvu} {...props}/>)} />}
                {props.info!=null && (props.info.chucvu==="Admin" || props.info.chucvu==="Dịch Vụ") && <Route path="/staffs" component={LoadingComponent(Staffs)}/>}
                {props.info!=null && (props.info.chucvu==="Admin" || props.info.chucvu==="Dịch Vụ") && <Route path="/repairPrice" component={LoadingComponent(RepairPrice)}/>}
                {props.info!=null &&  <Route path="/customer" component={LoadingComponent(Customer)}/>}
                
                
                <Route exact path="/services" component={LoadingComponent(() =><Services socket={socket} {...props}/>)}/>
                <Route path="/services/repairedbill" component={LoadingComponent(() =><RepairedBill socket={socket} {...props}/>)}/>
                <Route path="/banle" component={LoadingComponent(BanLe)}/>
                <Route path="/chamcong" component={LoadingComponent(ChamCong)}/>
                <Route path="/thongke" component={LoadingComponent(ThongKe)}/>
                <Route path="/cuahangngoai" component={LoadingComponent(CuaHangNgoai)}/>
            </BaseContainer>
        </Router>
    )
}

const mapState = (state) => ({
    token: state.Authenticate.token,
    info: state.Authenticate.info,
})

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, null)(Home);
