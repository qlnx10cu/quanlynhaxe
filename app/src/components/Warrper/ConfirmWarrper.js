import React, { useState } from 'react';
import { Modal, ModalContent, CloseButton, Button, DivFlexRow } from '../../styles'
import { setConfirm } from "../../actions/App";
import { connect } from 'react-redux'

const ConfirmWarrper = (props) => {
    const onCloseClick = () => {
        props.setConfirm(false, '', null);
    }
    const handleCallback = (callback) => {
        onCloseClick();
        if (callback) {
            callback();
        }
    }
    return (
        <Modal className={props.confirm.isLoading ? "active" : ""}>
            <ModalContent style={{ width: '50%' }}>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={() => onCloseClick()}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <h3 style={{ textAlign: 'center' }}>{props.confirm.message}</h3>
                <DivFlexRow style={{ marginTop: 50, marginBottom: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                    <DivFlexRow></DivFlexRow>
                    <Button onClick={() => handleCallback(props.confirm.callback)}>
                        Đồng ý  </Button>
                    <Button onClick={() => onCloseClick()}>
                        Hủy </Button>
                    <DivFlexRow></DivFlexRow>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    );
}
const mapState = (state) => ({
    confirm: state.App.confirm,
})
const mapDispatch = (dispatch) => ({
    setConfirm: (isLoad, mess, callback) => { dispatch(setConfirm(isLoad, mess, callback)) }
})
export default connect(mapState, mapDispatch)(ConfirmWarrper);
