import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Button, DivFlexRow } from '../../styles'

const RepairWraper = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    margin: 15px 0px;
`

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
`
const ARR = [1, 2, 3, 4];

const CRepairItem = (props) => {
    let mIsWorking = props.working || 0;
    const handleBtnUseClick = () => {
        props.select(props.STT, null, () => {
            if (props.history.location.pathname !== '/services/repairedbill') {
                props.history.push(`/services/repairedbill/${props.STT}`)
            }

        });
    }
    const handleXemThongTin = () => {
        props.history.push(`/services/repairedbill/${props.STT}`)
    }

    const handleThuHoi = () => {
        props.parent.confirm("Bạn có chắc muốn thu hồi", () => {
            props.socket.emit('release', {
                maban: props.STT - 1,
                mahoadon: "",
                biensoxe: "",
            })
        })
    }

    return (
        <RepairItem className={mIsWorking === 0 ? "" : mIsWorking === 1 ? "dangnhap" : "working"}>
            <div className="STT">{props.STT}</div>
            <img alt="img repair" src="/resources/icon/repair.svg" />
            <span>{mIsWorking === 2 ? `BSX: ${props.item && props.item.biensoxe} (${props.item && props.item.mahoadon})` : mIsWorking === 1 ? "Đang nhập thông tin" : "Trống"}</span>
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
    let connected = false;
    const subscribe = () => {
        props.socket.emit('connected', () => {
            //setLiftTable(data);
        })
    }

    props.socket.on('connected', (data) => {
        if (connected) {
            setLiftTable(data);
        }
    })
    props.socket.on('lifttableFull', data => {
        if (connected) {
            setLiftTable(data);
        }
    })
    const select = (stt, mahoadon, cb) => {
        props.socket.emit('select', {
            maban: stt - 1,
            mahoadon: "",
            biensoxe: "",
        })
        props.socket.on('lifttable', async data => {
            if (connected) {
                await setLiftTable(data);
            }
            cb();
        })
    };
    const release = (stt) => {
        props.socket.emit('release', {
            maban: stt - 1,
            mahoadon: "",
            biensoxe: "",
        })
    };
    const updateBan = () => {
        props.socket.emit('update');
        props.alert('Update thành công')
    }
    useEffect(() => {
        connected = true;
        subscribe();
        return () => {
            connected = false;
        };
    }, [])
    return (
        <div>
            <h3>Khu vực sửa chữa</h3>
            {props.info.chucvu === "Admin" && <Button onClick={() => updateBan(true)} style={{ marginLeft: 20, marginTop: 10 }}>
                Update
            </Button>
            }
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index} STT={index} history={props.history} select={select} release={release} item={liftTable[index - 1]} working={liftTable[index - 1] && liftTable[index - 1].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 4} STT={index + 4} history={props.history} select={select} release={release} item={liftTable[index + 3]} working={liftTable[index + 3] && liftTable[index + 3].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 8} STT={index + 8} history={props.history} select={select} release={release} item={liftTable[index + 7]} working={liftTable[index + 7] && liftTable[index + 7].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 12} STT={index + 12} history={props.history} select={select} release={release} item={liftTable[index + 11]} working={liftTable[index + 11] && liftTable[index + 11].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 16} STT={index + 16} history={props.history} select={select} release={release} item={liftTable[index + 15]} working={liftTable[index + 15] && liftTable[index + 15].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 20} STT={index + 20} history={props.history} select={select} release={release} item={liftTable[index + 19]} working={liftTable[index + 19] && liftTable[index + 19].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 24} STT={index + 24} history={props.history} select={select} release={release} item={liftTable[index + 23]} working={liftTable[index + 23] && liftTable[index + 23].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 28} STT={index + 28} history={props.history} select={select} release={release} item={liftTable[index + 27]} working={liftTable[index + 27] && liftTable[index + 27].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 32} STT={index + 32} history={props.history} select={select} release={release} item={liftTable[index + 31]} working={liftTable[index + 31] && liftTable[index + 31].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 36} STT={index + 36} history={props.history} select={select} release={release} item={liftTable[index + 35]} working={liftTable[index + 35] && liftTable[index + 35].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 40} STT={index + 40} history={props.history} select={select} release={release} item={liftTable[index + 39]} working={liftTable[index + 39] && liftTable[index + 39].trangthai} />
                ))}
            </RepairWraper>
            <RepairWraper>
                {ARR.map(index => (
                    <CRepairItem parent={props} socket={props.socket} key={index + 44} STT={index + 44} history={props.history} select={select} release={release} item={liftTable[index + 43]} working={liftTable[index + 43] && liftTable[index + 43].trangthai} />
                ))}
            </RepairWraper>
        </div>
    )
}

export default withRouter(Services);
