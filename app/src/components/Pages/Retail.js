import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonDelete, ButtonEdit, InputCity, InputGioiTinh } from "../Styles";
import XLSX from "xlsx";
import * as actions from "../../actions";
import lib from "../../lib";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";
import InputList from "../Styles/InputList";
import { Button, DivFlexColumn, DivFlexRow, Input, Textarea } from "../../styles";
import CustomerApi from "../../API/CustomerApi";
import ButtonChooseFile from "../Styles/ButtonChooseFile";
import Loading from "../Loading";
import files from "../../lib/files";

const Retail = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [listCustomerCurrent, setListCustomerCurrent] = useState([]);
    const loai = 0;
    const mMaKh = lib.handleInput(0);
    const mCustomerName = lib.handleInput("");
    const mSoDienThoai = lib.handleInput("");
    const mDiaChi = lib.handleInput("");
    const mThanhPho = lib.handleInput("An Giang");
    const mGioiTinh = lib.handleInput(0);
    const mLyDo = lib.handleInput("");

    useEffect(() => {
        props.getListCustomer();
    }, []);

    const handleChangeSDT = (value, enter) => {
        mSoDienThoai.setValue(value);
        const customer = props.Customer.data.find(function (item) {
            return item && item.sodienthoai && item.sodienthoai === value;
        });

        if (customer && customer.ma && customer.sodienthoai == value) {
            mMaKh.setValue(customer.ma);
            mDiaChi.setValue(customer.diachi);
            mGioiTinh.setValue(customer.gioitinh);
            mThanhPho.setValue(customer.thanhpho);
            return;
        }

        mMaKh.setValue("");
        mCustomerName.setValue("");
        mDiaChi.setValue("");
        mGioiTinh.setValue(0);
        mThanhPho.setValue("An Giang");
        if (!enter) {
            return;
        }

        let resCheck = 0;
        CustomerApi.getBySoDienThoai(value)
            .then((data) => {
                if (data) {
                    mMaKh.setValue(data.ma);
                    mCustomerName.setValue(data.ten);
                    mDiaChi.setValue(data.diachi);
                    mGioiTinh.setValue(data.gioitinh);
                    mThanhPho.setValue(data.thanhpho);
                }
            })
            .finally(() => {
                setLoading(false);
                resCheck = 1;
            });
        setTimeout(function () {
            if (resCheck == 0) {
                resCheck = 1;
                setLoading(true, 1);
            }
        }, 500);
    };

    const handleChangeKH = (value, enter) => {
        mMaKh.setValue(value);
        value = utils.parseInt(value);
        if (value <= 0) {
            return;
        }
        const customer = props.Customer.data.find(function (item) {
            return item && item.ma && item.ma == value;
        });

        if (customer) {
            mCustomerName.setValue(customer.ten);
            mSoDienThoai.setValue(customer.sodienthoai);
            mDiaChi.setValue(customer.diachi);
            mGioiTinh.setValue(customer.gioitinh);
            mThanhPho.setValue(customer.thanhpho);
            return;
        }

        mCustomerName.setValue("");
        mSoDienThoai.setValue("");
        mDiaChi.setValue("");
        mGioiTinh.setValue(0);
        mThanhPho.setValue("An Giang");
        if (!enter) {
            return;
        }

        let resCheck = 0;
        CustomerApi.get(value)
            .then((data) => {
                if (data && data.ma == value) {
                    mCustomerName.setValue(data.ten);
                    mSoDienThoai.setValue(data.sodienthoai);
                    mDiaChi.setValue(data.diachi);
                    mGioiTinh.setValue(data.gioitinh);
                    mThanhPho.setValue(data.thanhpho);
                }
            })
            .finally(() => {
                setLoading(false);
                resCheck = 1;
            });
        setTimeout(function () {
            if (resCheck == 0) {
                resCheck = 1;
                setLoading(true, 1);
            }
        }, 500);
    };

    const handleOpenCHN = () => {};

    const handleOpenPopupProduct = () => {};

    const handleFileImport = (dataFile) => {
        const data = files.parseFileRetail(XLSX.read(dataFile, { type: "array" }));
        // addListItemToProduct(value);
    };

    const checkLoading = isLoading || props.Product.isLoading || props.Salary.isLoading || props.Customer.isLoading;

    return (
        <React.Fragment>
            <Choose>
                <When condition={checkLoading}>
                    <Loading />
                </When>
                <Otherwise>
                    <h1 style={{ textAlign: "center" }}> Hóa đơn</h1>
                    <DivFlexRow style={{ justifyContent: "space-between" }}>
                        <DivFlexColumn style={{ width: "120px" }}>
                            <label>Mã KH: </label>
                            <InputList
                                readOnly={loai != 0}
                                value={mMaKh.value}
                                onChange={(e) => handleChangeKH(e.target.value, false)}
                                onEnter={(e) => handleChangeKH(e.target.value, true)}
                                limitList={20}
                                data={props.Customer.data}
                                searchData={(search, item) => utils.searchName(item.ma, search) || utils.searchName(item.ten, search)}
                                render={(item, index) => {
                                    return (
                                        <option key={index} value={item.ma}>
                                            {item.ten}
                                        </option>
                                    );
                                }}
                            />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Tên khách hàng: </label>
                            <Input autocomplete="off" {...mCustomerName} readOnly={loai != 0} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Số điện thoại: </label>
                            <InputList
                                readOnly={loai != 0}
                                value={mSoDienThoai.value}
                                onChange={(e) => handleChangeSDT(e.target.value, false)}
                                onEnter={(e) => handleChangeSDT(e.target.value, true)}
                                limitList={20}
                                data={props.Customer.data}
                                searchData={(search, item) => utils.searchName(item.sodienthoai, search) || utils.searchName(item.ten, search)}
                                render={(item, index) => {
                                    return (
                                        <option key={index} value={item.sodienthoai}>
                                            {item.ten}
                                        </option>
                                    );
                                }}
                            />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Giới Tính: </label>
                            <InputGioiTinh style={{ width: 100 }} readOnly={loai != 0} disabled={loai != 0} {...mGioiTinh} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Thành Phố: </label>
                            <InputCity readOnly={loai != 0} disabled={loai != 0} autocomplete="off" {...mThanhPho} />
                        </DivFlexColumn>
                        <DivFlexColumn style={{ marginLeft: 20 }}>
                            <label>Địa chỉ: </label>
                            <Input autocomplete="off" {...mDiaChi} width="400px" readOnly={loai != 0} />
                        </DivFlexColumn>
                    </DivFlexRow>
                    <If condition={true || (loai == 2 && mLyDo.value) || loai == 1}>
                        <DivFlexRow style={{ alignItems: "center" }}>
                            <DivFlexColumn>
                                <label>Lý do thay đổi: </label>
                                <Textarea autocomplete="off" readOnly={loai == 2} {...mLyDo} />
                            </DivFlexColumn>
                        </DivFlexRow>
                    </If>
                    <If condition={loai != 2}>
                        <DivFlexRow style={{ marginTop: 5, marginBottom: 5, justifyContent: "space-between", alignItems: "center" }}>
                            <label>Bảng giá phụ tùng: </label>
                            <Button onClick={handleOpenCHN}> Thêm Của Hàng Ngoài </Button>
                            <DivFlexRow>
                                <ButtonChooseFile setLoading={setLoading} title={"Import"} onChooseFile={handleFileImport} />
                                <Button style={{ marginLeft: 15 }} onClick={handleOpenPopupProduct}>
                                    Thêm Phụ Tùng
                                </Button>
                            </DivFlexRow>
                        </DivFlexRow>
                    </If>
                </Otherwise>
            </Choose>
        </React.Fragment>
    );
};

const mapState = (state) => ({
    Customer: state.Customer,
    Statff: state.Statff,
    Product: state.Product,
    Salary: state.Salary,
});

const mapDispatch = {
    getListCustomer: (query) => actions.CustomerAction.getListCustomer(query),
};

export default connect(mapState, mapDispatch)(Retail);
