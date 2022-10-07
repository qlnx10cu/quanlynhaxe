import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, CloseButton, DivFlexRow, Button, DivFlexColumn, Input } from '../../styles'
import { connect } from 'react-redux'
import { AddSalary, UpdateSalary } from '../../API/Salary'


const RepairPriceDetail = (props) => {

    let [isUpload, setUpload] = useState(false);
    let [mName, setName] = useState("");
    let [mPrice, setPrice] = useState("");
    const handleSubmit = () => {
        setUpload(true);
        if (!mName) {
            alert("Tên không được bỏ trống");
            return;
        }

        if (!mPrice) {
            alert("Tên không được bỏ trống");
            return;
        }
        let data = {
            ten: mName,
            tien: mPrice
        }
        if (props.editItem) {
            UpdateSalary(props.token, data, props.editItem.ma).then(() => {
                setUpload(false);
                props.onCloseClick();
            }).catch(err => {
                alert(JSON.stringify(err.response.data))
                setUpload(false);
            })
        } else {
            AddSalary(props.token, data).then(response => {
                setUpload(false);
                props.onCloseClick();
            }).catch(err => {
                alert(JSON.stringify(err.response.data))
                setUpload(false);
            })
        }


    }

    useEffect(() => {
        setName("");
        setPrice(0);
        if (props.editItem && props.editItem.ma) {
            setName(props.editItem.ten);
            setPrice(props.editItem.tien);
        }

    }, [props.editItem])



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
                            <Input width='auto' value={mName} onChange={(e) => setName(e.target.value)} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ fontSize: 20, marginBottom: 10 }}>
                            Giá Tiền
                            <Input type="Number" width='auto' value={mPrice} onChange={(e) => setPrice(e.target.value)} />
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

export default connect(mapState, null)(RepairPriceDetail);