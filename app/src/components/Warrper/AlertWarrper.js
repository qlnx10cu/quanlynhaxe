import React, { useEffect } from 'react';
import { ModalAlert, ModalContent, CloseButton } from '../../styles'
import { setAlert } from "../../actions/App";
import { connect } from 'react-redux'

const AlertWarrper = (props) => {

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
        props.setAlert(false, null, 0);
    }
    var message = [];
    var color = '#fefefe';
    if (props && props.alert && props.alert.message) {
        message = props.alert.message.split('\n');
        color = props.alert.error == 2 ? '#00ff32' : props.alert.error == 1 ? '#ff4100' : "#fefefe";
    }
    return (
        <ModalAlert className={props.alert.isLoading ? "active" : ""}>
            <ModalContent style={{ width: '600px', backgroundColor: color }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                {message.map((mess, index) => (
                    <h3 key={index} style={{ textAlign: 'center' }}>{mess}</h3>
                ))}
            </ModalContent>
        </ModalAlert >
    );
}
const mapState = (state) => ({
    alert: state.App.alert,
})
const mapDispatch = (dispatch) => ({
    setAlert: (isLoad, mess, error) => { dispatch(setAlert(isLoad, mess, error)) }
})
export default connect(mapState, mapDispatch)(AlertWarrper);
