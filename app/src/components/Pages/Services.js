import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, DivFlexRow, RepairItem, RepairWraper } from "../../styles";
import { connect } from "react-redux";
import Loading from "../Loading";

const CRepairItem = ({ setLoading, confirm, socket, history, stt, item }) => {
    const handleSelect = () => {
        setLoading(true, 1);
        socket.emit("select", {
            maban: stt - 1,
            mahoadon: "",
            biensoxe: "",
        });
    };
    const handleView = () => {
        history.push(`/services/repairedbill/${stt}`);
    };

    const handleReCall = () => {
        confirm("Bạn có chắc muốn thu hồi", () => {
            socket.emit("release", {
                maban: stt - 1,
                mahoadon: "",
                biensoxe: "",
            });
        });
    };

    const working = item ? item.trangthai : 0;

    return (
        <RepairItem className={working == 0 ? "" : working == 1 ? "dangnhap" : "working"}>
            <div className="STT">{stt}</div>
            <img alt="img repair" src="/resources/icon/repair.svg" />
            <Choose>
                <When condition={working == 2}>
                    <span>{`BSX: ${item && item.biensoxe} (${item && item.mahoadon})`}</span>
                    <DivFlexRow>
                        <Button style={{ marginTop: 10, color: "black" }} onClick={handleView}>
                            Thông tin
                        </Button>
                    </DivFlexRow>
                </When>
                <When condition={working == 1}>
                    <span>Đang nhập thông tin</span>
                    <DivFlexRow>
                        <Button style={{ marginTop: 10, color: "black" }} onClick={handleReCall}>
                            Thu hồi
                        </Button>
                    </DivFlexRow>
                </When>
                <Otherwise>
                    <span>Trống</span>
                    <DivFlexRow>
                        <Button style={{ marginTop: 10, color: "black" }} onClick={handleSelect}>
                            Sử dụng
                        </Button>
                    </DivFlexRow>
                </Otherwise>
            </Choose>
        </RepairItem>
    );
};

const Services = (props) => {
    const liftTable = props.appInfo.liftTable || [];

    useEffect(() => {
        if (liftTable && liftTable.length != 0) {
            props.setLoading(false);
        } else {
            props.setLoading(true);
        }
    }, [props.appInfo.liftTable]);

    const updateBan = () => {
        props.confirm("Bạn có chắc muốn update", () => {
            props.socket.emit("update");
            props.alert("Update thành công");
        });
    };

    const ColumnItem = Array(4).fill();
    const RowItem = Array(12).fill();

    return (
        <React.Fragment>
            <Choose>
                <When condition={props.isLoading}>
                    <Loading />
                </When>
                <Otherwise>
                    <h3>Khu vực sửa chữa</h3>
                    <If condition={props.info && props.info.chucvu === "Admin"}>
                        <Button onClick={() => updateBan(true)} style={{ marginLeft: 20, marginTop: 10 }}>
                            Update
                        </Button>
                    </If>
                    {RowItem.map((e, row) => (
                        <RepairWraper key={row}>
                            {ColumnItem.map((v, column) => {
                                const index = row * ColumnItem.length + column;
                                return (
                                    <CRepairItem
                                        key={index}
                                        stt={index + 1}
                                        item={liftTable[index]}
                                        socket={props.socket}
                                        history={props.history}
                                        setLoading={props.setLoading}
                                        confirm={props.confirm}
                                    />
                                );
                            })}
                        </RepairWraper>
                    ))}
                </Otherwise>
            </Choose>
        </React.Fragment>
    );
};

const mapState = (state) => ({
    isLoading: state.App.isLoading,
    appInfo: state.AppInfo,
});

export default withRouter(connect(mapState, null)(Services));
