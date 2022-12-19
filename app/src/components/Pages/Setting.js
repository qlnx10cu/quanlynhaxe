import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { DivFlexColumn, DivFlexRow, Button } from "../../styles";
import { HOST } from "../../Config";
import { authenticate } from "../../actions/Authenticate";

const Setting = (props) => {
    let [info, setInfo] = useState(null);

    useEffect(() => {
        if (props.info !== null) {
            setInfo(props.info);
        }
    }, [props.info]);

    const handleDowloadTrungTrang = () => {
        let url = `${HOST}/dowload/SetupTrungTrang_1.0.4.msi`;
        window.open(url);
    };

    const handleDowloadMicroSip = () => {
        let url = `${HOST}/dowload/MicroSIPFileSetup.msi`;
        window.open(url);
    };

    const handleInstallMicroSip = async () => {
        if (!info) {
            props.alert("Vui lòng đăng nhập để cài đặt.");
            return;
        }
        if (!info.accountsip) {
            const res = await props.authenticate(info.username, "123456");
            if (!res || !res.accountsip) {
                props.alert("Bạn không đủ quyền để sài trước năng này.");
                return;
            }
        }
        let url = `microsip://init:${info.accountsip}`;
        window.open(url);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}> Cài Đặt</h1>
            <DivFlexRow style={{ marginTop: 15, justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexColumn>
                    <Button onClick={() => handleDowloadTrungTrang()}>Download TrungTrang 1.0.4</Button>
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 15, justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexColumn>
                    <Button onClick={() => handleDowloadMicroSip()}>Download MicroSip</Button>
                </DivFlexColumn>
            </DivFlexRow>
            <DivFlexRow style={{ marginTop: 15, justifyContent: "space-between", alignItems: "center" }}>
                <DivFlexColumn>
                    <Button onClick={() => handleInstallMicroSip()}>Cài Đặt MicroSip</Button>
                </DivFlexColumn>
            </DivFlexRow>
        </div>
    );
};

const mapState = (state) => ({
    token: state.Authenticate.token,
    info: state.Authenticate.info,
    isLoading: state.App.isLoading,
});
const mapDispatch = (dispatch) => ({
    authenticate: (username, password) => dispatch(authenticate(username, password)),
});
export default connect(mapState, mapDispatch)(Setting);
