import React, { useState, useEffect } from 'react'
import { Table, Button, DelButton, DivFlexRow } from '../../styles'
import { GetListSalary, DelSalary } from '../../API/Salary'
import RepairPriceDetail from './RepairPriceDetail'
// import DeleteDialog from './DeleteDialog'
import { connect } from 'react-redux'
import {setLoading} from "../../actions/App";
import Loading from "../Loading";

const RepairPrice = (props) => {
    let [editItem, setEditItem] = useState(null);
    let [isShowRepairPriceDetail, setShowRepairPriceDetail] = useState(false);
    // let [isShowDeleteDialog, setShowDeleteDialog] = useState(false);
    let [listSalary, setListSalary] = useState([]);
    const handleButtonEdit = (item) => {
        setShowRepairPriceDetail(true);
        setEditItem(item);
    }

    useEffect(() => {
        props.setLoading(true);
        GetListSalary(props.token).then(response => {
            setListSalary(response.data);
            props.setLoading(false)
        }).catch(()=>{
            props.setLoading(false)
        })
    }, [])
    return (
        <div>
            {props.isLoading && <Loading/>}
            {!props.isLoading &&
            <React.Fragment>
                <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px' }}>Danh sách tiền công</span>
                    <Button onClick={() => {
                        setShowRepairPriceDetail(true)
                        setEditItem(null);
                    }}>
                        Thêm mới
                        <i className="fas fa-plus"></i>
                    </Button>
                </DivFlexRow>
                {/* <DivFlexRow style={{ alignItems: 'center', marginTop: 5, marginBottom: 15 }}>
                <Input style={{ width: 250, marginRight: 15 }} />
                <Button>
                    Tìm Kiếm
              <i className="fas fa-search"></i>
                </Button>
            </DivFlexRow> */}
                <Table>
                    <tbody>
                    <tr>
                        <th>Mã</th>
                        <th>Tên Dịch vụ</th>
                        <th>Giá Tiền</th>
                        <th></th>
                    </tr>

                    {listSalary.map((item, index) => (
                        <tr key={index}>
                            <td>{item.ma}</td>
                            <td>{item.ten}</td>
                            <td>{item.tien.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' })}</td>
                            <td>
                                <Button onClick={()=>{handleButtonEdit(item)}} ><i className="fas fa-cog"></i></Button>
                                <DelButton onClick={() => {
                                    DelSalary(props.token, item.ma).then(response => {
                                        GetListSalary(props.token).then(response => {
                                            setListSalary(response.data);
                                        })
                                    })

                                }} style={{ marginLeft: 5 }}><i className="far fa-trash-alt"></i></DelButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 15 }}>
                    <Button><i className="fas fa-angle-double-left"></i></Button>
                    <Button style={{ marginLeft: 10 }}><i className="fas fa-angle-double-right"></i></Button>
                </DivFlexRow>
                <RepairPriceDetail isShowing={isShowRepairPriceDetail} onCloseClick={() => {
                    setShowRepairPriceDetail(false);
                    GetListSalary(props.token).then(response => {
                        setListSalary(response.data);
                    })
                }} editItem={editItem} />

            </React.Fragment>
            }
        </div>

    )
}

const mapState = (state) => ({
    token: state.Authenticate.token,
    isLoading:state.App.isLoading
})
const mapDispatch = (dispatch) => ({
    setLoading: (isLoad) => {dispatch(setLoading(isLoad))}
})
export default connect(mapState, mapDispatch)(RepairPrice);