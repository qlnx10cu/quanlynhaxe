import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input } from '../../styles'
// import { showNoti } from '../../../Actions/Notification';
import { connect } from 'react-redux'
import {AddSalary} from '../../API/Salary'

// const handleInput = (initVal = null) => {
//     let [value, setValue] = useState(initVal);
//     let onChange = (event) => setValue(event.target.value);
//     let isChange = () => (initVal !== value);
//     let isEmpty = () => (value === "" || value === null);
//     return {
//         value,
//         onChange,
//         isChange,
//         setValue,
//         isEmpty,
//     }
// }

const DeleteDialog = (props) => {

    let [isUpload, setUpload] = useState(false);
    let [mName,setName]=useState("");
    let [mPrice,setPrice]=useState("");

    const handleSubmit = () => {
        setUpload(true);
        let data = {
            ten: mName,
            tien: mPrice
        }
        
        AddSalary(props.data,data).then(response=>{
            setUpload(false);
            props.onCloseClick();
        })

    }

    useEffect(() => {
        setName("");
        setPrice("");
    }, [])



    return (
        <Modal className={props.isShowing ? "active" : ""}>
            <ModalContent>
                <div style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <CloseButton onClick={props.onCloseClick}>&times;</CloseButton>
                    <h2> </h2>
                </div>
                <DivFlexRow style={{ marginTop: 10 }}>
                    <DivFlexColumn style={{ marginLeft: 25, width: '100%' }}>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 10 }}>
                            Tên Dịch Vụ
                                <Input width='auto' value={mName.value}  onChange={(e) => setName(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 10 }}>
                            Giá Tiền
                                <Input type="Number" width='auto' value={mPrice.value} onChange={(e) => setPrice(e.target.value)} />
                        </DivFlexColumn>

                    </DivFlexColumn>
                </DivFlexRow>
                <DivFlexRow style={{ justifyContent: 'flex-end' }}>
                    <Button width='100px' onClick={isUpload ? () => { } : handleSubmit}>
                        {isUpload ? <i className="fas fa-spinner fa-spin"></i> : "Lưu"}
                    </Button>
                </DivFlexRow>
            </ModalContent>
        </Modal>
    )
}

const mapState = (state) => ({
    token: state.Authenticate.token,
})

// const mapDispatch = dispatch => ({
//     showNoti: (type, mess) => { dispatch(showNoti(type, mess)) }
// })

export default connect(mapState, null)(DeleteDialog);