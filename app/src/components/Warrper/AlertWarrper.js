import React from 'react';
import { ModalAlert, ModalContent, CloseButton } from '../../styles'
import { setAlert } from "../../actions/App";
import { connect } from 'react-redux'

const AlertWarrper = (props) => {
    const onCloseClick = () => {
        props.setAlert(false, null, false);
    }
    var message = [];
    if (props && props.alert && props.alert.message) {
        message = props.alert.message.split('\n');
    }
    return (
        <ModalAlert className={props.alert.isLoading ? "active" : ""}>
            <ModalContent style={{ width: '50%' }} style={{ backgroundColor: props.alert.error ? '#ff4100' : "#fefefe" }}>
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