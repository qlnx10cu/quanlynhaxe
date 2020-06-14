import React, { useState } from 'react';
import { ModalAlert, ModalContent, CloseButton } from '../../styles'
import { setAlert } from "../../actions/App";
import { connect } from 'react-redux'

const ConfirmWarrper = (props) => {
    const onCloseClick = () => {
        props.setAlert(false, null);
    }
    return (
        <ModalAlert className={props.alert.isLoading ? "active" : ""}>
            <ModalContent style={{ width: '50%' }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: 'center' }}>{props.alert.message}</h3>
            </ModalContent>
        </ModalAlert>
    );
}
const mapState = (state) => ({
    alert: state.App.alert,
})
const mapDispatch = (dispatch) => ({
    setAlert: (isLoad, mess) => { dispatch(setAlert(isLoad, mess)) }
})
export default connect(mapState, mapDispatch)(ConfirmWarrper);
