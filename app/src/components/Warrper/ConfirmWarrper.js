import React, { useEffect } from 'react';
import { ModalAlert, ModalContent, CloseButton, CancleButton, Button, DivFlexRow } from '../../styles'
import { setConfirm } from "../../actions/App";
import { connect } from 'react-redux'

const ConfirmWarrper = (props) => {
    useEffect(() => {
        function handleEscapeKey(event) {
            if (event.code === 'Escape') {
                onCloseClick();
            }
        }
        document.addEventListener('keydown', handleEscapeKey)
        return () => document.removeEventListener('keydown', handleEscapeKey)
    }, [])

    const onCloseClick = () => {
        props.setConfirm(false, '', null);
    }
    const handleCallback = (callback) => {
        onCloseClick();
        if (callback) {
            callback();
        }
    }
    var message = [];
    if (props && props.confirm && props.confirm.message) {
        message = props.confirm.message.split('\n');
    }

    return (
        <ModalAlert className={props.confirm.isLoading ? "active" : ""}>
            <ModalContent style={{ width: '700px', backgroundColor: props.confirm.error == 0 ? "#fefefe" : (props.confirm.error == 1 ? '#fcff40fc' : '#ff4100') }} >
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                {message.map((mess, index) => (
                    <h3 key={index} style={{ textAlign: 'center' }}>{mess}</h3>
                ))}
                <DivFlexRow style={{ marginTop: 50, marginBottom: 5, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <DivFlexRow></DivFlexRow>
                    <CancleButton onClick={() => onCloseClick()}>
                        Hủy </CancleButton>
                    <DivFlexRow></DivFlexRow>
                    <Button onClick={() => handleCallback(props.confirm.callback)}>
                        Đồng ý  </Button>
                </DivFlexRow>
            </ModalContent>
        </ModalAlert>
    );
}
const mapState = (state) => ({
    confirm: state.App.confirm,
})
const mapDispatch = (dispatch) => ({
    setConfirm: (isLoad, mess, callback) => { dispatch(setConfirm(isLoad, mess, callback)) }
})
export default connect(mapState, mapDispatch)(ConfirmWarrper);
