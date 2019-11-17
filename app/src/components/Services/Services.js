import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Button, DivFlexRow } from '../../styles'
import ImgRepair from '../../icon/repair.svg'

const RepairWraper = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    margin: 15px 0px;
`

const RepairItem = styled.div`
    width: 250px;
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
`
const ARR = [1, 2, 3, 4];

const CRepairItem = (props) => {
    let mIsWorking = props.working || 0;
    const handleBtnUseClick = () => {
        props.select(props.STT, null, () => {
            if (props.history.location.pathname !== '/services/repairedbill')
                props.history.push(`/services/repairedbill/${props.STT}`)
        });
    }
    const handleXemThongTin = () => {
        props.history.push(`/services/repairedbill/${props.STT}`)
    }

    const handleThuHoi = () => {
        if (window.confirm("Bạn có chắc muốn thu hồi")) {
            props.socket.emit('release', {
                maban: props.STT - 1,
                mahoadon: "",
                biensoxe:"",
            })
        }
    }

    return (
        <RepairItem className={mIsWorking === 0 ? "" : mIsWorking === 1 ? "dangnhap" : "working"}>
            <div className="STT">{props.STT}</div>
            <img alt="img repair" src={ImgRepair} />
            <span>{mIsWorking === 2 ? `Sửa chữa ${props.item && props.item.biensoxe} (${props.item && props.item.mahoadon})` : mIsWorking === 1 ? "Đang nhập thông tin" : "Trống"}</span>
            <DivFlexRow>
                {mIsWorking === 2 ? <Button style={{ marginTop: 10, color: "black" }} onClick={handleXemThongTin}>
                    Thông tin
                </Button> : mIsWorking === 1 ?
                        <Button style={{ marginTop: 10, color: "black" }} onClick={handleThuHoi}>
                            Thu hồi
                        </Button>
                        :
                        <Button style={{ marginTop: 10, color: "black" }} onClick={handleBtnUseClick}>
                            Sử dụng
                </Button>
                }
            </DivFlexRow>

        </RepairItem>
    )
}

const Services = (props) => {

    let [liftTable, setLiftTable] = useState([]);
    const subscribe = () => {
        props.socket.emit('connected', () => {
            //setLiftTable(data);
        })
    }

    props.socket.on('connected', (data) => {
        setLiftTable(data);
    })
    props.socket.on('lifttableFull', async data => {
        await setLiftTable(data);
        console.log(data);
    })
    const select = (stt, mahoadon, cb) => {
        props.socket.emit('select', {
            maban: stt - 1,
            mahoadon: "",
            biensoxe:"",
        })
        props.socket.on('lifttable', async data => {
            await setLiftTable(data);
            cb();
        })
    };
    const release = (stt) => {
        props.socket.emit('release', {
            maban: stt - 1,
            mahoadon: "",
            biensoxe:"",
        })
    };
    useEffect(() => {
        subscribe();
        return () => subscribe();
    }, [])
    return (
        <div>
            <h3>Khu vực sửa chữa</h3>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem socket={props.socket} key={index} STT={index} history={props.history} select={select} release={release} item={liftTable[index - 1]} working={liftTable[index - 1] && liftTable[index - 1].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem socket={props.socket} key={index + 4} STT={index + 4} history={props.history} select={select} release={release} item={liftTable[index + 3]} working={liftTable[index + 3] && liftTable[index + 3].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem socket={props.socket} key={index + 8} STT={index + 8} history={props.history} select={select} release={release} item={liftTable[index + 7]} working={liftTable[index + 7] && liftTable[index + 7].trangthai} />
                ))}
            </RepairWraper>
        </div>
    )
}

export default withRouter(Services);