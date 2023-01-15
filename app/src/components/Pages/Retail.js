import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { POPUP_NAME } from "../../actions/Modal";
import { ButtonChooseFile, ButtonDelete, CellDelete, CellMoney, CellText, InputCity, InputGioiTinh } from "../Styles";
import { Button, DivFlexColumn, DivFlexRow, Input, Textarea } from "../../styles";
import XLSX from "xlsx";
import * as actions from "../../actions";
import lib from "../../lib";
import utils from "../../lib/utils";
import InputList from "../Styles/InputList";
import CustomerApi from "../../API/CustomerApi";
import Loading from "../Loading";
import files from "../../lib/files";
import DataTable from "../Warrper/DataTable";
import BillLeApi from "../../API/BillLeApi";
import moment from "moment";
import ButtonConfirm from "../Styles/ButtonConfirm";

const twoDay = 2 * 1000 * 3600 * 24;

const Retail = (props) => {
    const useIsMounted = lib.useIsMounted();
    const [isLoading, setLoading] = useState(false);
    const [hoadon, setHoadon] = useState({});
    const mMaKh = lib.handleInput(0);
    const mCustomerName = lib.handleInput("");
    const mSoDienThoai = lib.handleInput("");
    const mDiaChi = lib.handleInput("");
    const mThanhPho = lib.handleInput("An Giang");
    const mGioiTinh = lib.handleInput(0);
    const mLyDo = lib.handleInput("");
    let loai = 0;

    if (window.location.href.includes("updateretail")) {
        loai = 1;
    } else if (window.location.href.includes("showretail")) {
        loai = 2;
    }
    const mahoadon = utils.getQueryParams("mahoadon");

    useEffect(() => {
        // fecth to PopupAddProduct
        props.getListCustomer();
        props.refeshListProduct();
        loadBill();
    }, []);

    const loadBill = () => {
        props.loadRetailItemProduct();
        if (loai == 0) {
            return;
        }
        setLoading(true);
        BillLeApi.getChitiet(mahoadon)
            .then((data) => {
                if (!useIsMounted()) {
                    return;
                }
                if (!data || data.mahoadon != mahoadon) {
                    props.alert("Không tìm thấy mã hóa đơn");
                    return;
                }
                setHoadon(data);
                props.addRetailListItemProduct(data.chitiet);
                setLoading(false);

                mMaKh.setValue(data.makh);
                mCustomerName.setValue(data.tenkh);
                mSoDienThoai.setValue(data.sodienthoai);
                mDiaChi.setValue(data.diachi);
                mGioiTinh.setValue(data.gioitinh);
                mThanhPho.setValue(data.thanhpho);
                mLyDo.setValue(data.lydo);
            })
            .catch((err) => {
                if (!useIsMounted()) {
                    return;
                }
                props.alert("Có lỗi: " + err.message);
            });
    };

    const clearAll = () => {
        mMaKh.setValue("");
        mCustomerName.setValue("");
        mSoDienThoai.setValue("");
        mDiaChi.setValue("");
        mGioiTinh.setValue(0);
        mThanhPho.setValue("An Giang");
        mLyDo.setValue("");
        props.loadRetailItemProduct();
    };

    const getData = () => {
        const products = props.Retail.products;
        if (products.length === 0) {
            props.alert("Chưa có sản phẩm nào.");
            return null;
        }

        const chitiet = products.map(function (item) {
            return {
                maphutung: item.maphutung,
                tenphutung: item.tenphutung,
                dongia: item.dongia,
                soluong: item.soluong,
                chietkhau: item.chietkhau,
                tienchietkhau: item.tienchietkhau,
                nhacungcap: item.nhacungcap,
                loaiphutung: item.loaiphutung,
            };
        });

        let tongtien = 0;

        for (let i = 0; i < chitiet.length; i++) {
            const item = chitiet[i];
            if (item.dongia < 0) {
                props.alert(" SP: " + item.tenphutung + " co don gia < 0");
                return null;
            }
            if (item.soluong < 0) {
                props.alert(" SP: " + item.tenphutung + " co soluong < 0");
                return null;
            }
            if (item.chietkhau < 0 || item.chietkhau > 100) {
                props.alert(" SP: " + item.tenphutung + " co chietkhau < 0% or > 100%");
                return null;
            }
            if (item.tienchietkhau < 0) {
                props.alert(" SP: " + item.tenphutung + " co tiền chietkhau < 0");
                return null;
            }
            if ((item.tienchietkhau * 100.0) / 100 != item.tienchietkhau) {
                props.alert(" SP: " + item.tenphutung + " co tiền tienchietkhau không phù hợp");
                return null;
            }
            item.tongtien = utils.tinhTongTien(item.dongia, item.soluong, item.chietkhau);

            const product = props.Product.data.find(function (p) {
                return item.maphutung && p.maphutung.toLowerCase() == item.maphutung.toLowerCase();
            });
            if (product && product.soluongtonkho && product.soluongtonkho < item.soluong) {
                props.alert(" SP: " + item.tenphutung + " không còn đủ tồn khô");
                return null;
            }

            tongtien += item.tongtien;
        }

        const data = {
            manv: props.info.ma,
            tenkh: mCustomerName.value,
            sodienthoai: mSoDienThoai.value,
            diachi: mDiaChi.value,
            gioitinh: mGioiTinh.value,
            thanhpho: mThanhPho.value,
            tongtien: tongtien,
            tiencong: 0,
            tienpt: tongtien,
            chitiet: chitiet,
            lydo: mLyDo.value,
        };

        if (mMaKh.value) data.makh = mMaKh.value;
        if (hoadon && hoadon.mahoadon) data.mahoadon = hoadon.mahoadon;

        if (loai == 1) {
            if (!hoadon || !hoadon.mahoadon) {
                props.alert("Hóa đơn không hợp lệ");
                return null;
            }
            if (!mLyDo.value || mLyDo.value.trim() == "") {
                props.alert("Vui lòng nhập lý do");
                return null;
            }
            if (utils.comrapeName(hoadon.lydo, mLyDo.value)) {
                props.alert("Vui lòng nhập lý do khác hiện tại");
                return null;
            }
        }

        return data;
    };

    const handleAddBill = () => {
        const data = getData();
        if (!data) return;

        setLoading(true);
        BillLeApi.add(data)
            .then((res) => {
                clearAll();
                props.openModal(POPUP_NAME.POPUP_BILL, { mahoadon: res.mahoadon, loaihoadon: 1 });
            })
            .catch((err) => {
                props.error("Không thể thanh toán hóa đơn.\n" + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUpdateBill = () => {
        const data = getData();
        if (!data) return;
        setLoading(true);
        BillLeApi.update(hoadon.mahoadon, data)
            .then((res) => {
                props.openModal(POPUP_NAME.POPUP_BILL, { mahoadon: res.mahoadon, loaihoadon: 1 });
                setLoading(false);
                loadBill();
            })
            .catch((err) => {
                props.error("Không thể thanh toán hóa đơn.\n" + err.message);
                setLoading(false);
            });
    };

    const handleRenderUpdateBill = () => {
        props.history.push("/updateretail?mahoadon?mahoadon=" + hoadon.mahoadon);
    };

    const handleChangeSDT = (value, enter) => {
        mSoDienThoai.setValue(value);
        const customer = props.Customer.data.find(function (item) {
            return item && item.sodienthoai && item.sodienthoai === value;
        });

        if (customer && customer.ma && customer.sodienthoai == value) {
            mMaKh.setValue(customer.ma);
            mCustomerName.setValue(customer.ten);
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

    const handleChangeSL = (e, index) => {
        const item = props.Retail.products[index];
        item.soluong = utils.parseInt(e.target.value);
        props.updateRetailItemProduct(item, index);
    };

    const handleChangeChieuKhau = (e, index) => {
        const item = props.Retail.products[index];
        item.chietkhau = utils.parseChietKhau(e.target.value);
        item.tienchietkhau = utils.tinhTienChietKhau(item.dongia, item.chietkhau);

        props.updateRetailItemProduct(item, index);
    };

    const handleDeleteProduct = (index) => {
        props.deleteRetailItemProduct(index);
    };

    const handleOpenStoreOutside = () => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_ADD_STORE_OUTSIDES, {}, (data) => {
            props.addRetailItemProduct(data);
        });
    };

    const handleOpenPopupProduct = () => {
        props.openModal(POPUP_NAME.POPUP_CUSTOMER_ADD_PRODUCT, {}, (data) => {
            props.addRetailItemProduct(data);
        });
    };

    const handleSearchItem = (search, setSearch) => {
        if (!search) return;
        const item = props.Product.data.find(function (pro) {
            return pro && pro.maphutung != "" && pro.maphutung.toLowerCase() == search.toLowerCase();
        });

        if (!item) return;

        if (!item.maphutung || item.maphutung === "") {
            props.alert("mã phụ tùng không đúng: " + item.maphutung);
            return;
        }
        if (!item.giaban_le || utils.parseInt(item.giaban_le) <= 0) {
            props.alert("phụ tùng không hợp lệ");
            return;
        }
        if (item.soluongtonkho <= 0) {
            props.alert("hiện tại phụ tùng " + item.maphutung + " đã hết hàng\n Vui lòng kiểm tra lại kho");
            return;
        }

        const newData = {
            tenphutung: item.tentiengviet,
            maphutung: item.maphutung,
            dongia: utils.parseInt(item.giaban_le),
            soluong: 1,
            chietkhau: 0,
            tienchietkhau: 0,
            tongtien: utils.parseInt(item.giaban_le),
            nhacungcap: "Trung Trang",
        };
        props.addRetailItemProduct(newData);
        setSearch("");
    };

    const handleFileImport = (dataFile) => {
        const data = files.parseFileRetail(XLSX.read(dataFile, { type: "array" }));
        props.addRetailListItemProduct(data);
    };

    return (
        <React.Fragment>
            <Choose>
                <When condition={isLoading}>
                    <Loading />
                </When>
                <Otherwise>
                    <h1 style={{ textAlign: "center" }}> Hóa đơn {hoadon.mahoadon}</h1>
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
                    <If condition={(loai == 2 && mLyDo.value) || loai == 1}>
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
                            <Button onClick={handleOpenStoreOutside}> Thêm Của Hàng Ngoài </Button>
                            <DivFlexRow>
                                <ButtonChooseFile setLoading={setLoading} title={"Import"} onChooseFile={handleFileImport} />
                                <Button style={{ marginLeft: 15 }} onClick={handleOpenPopupProduct}>
                                    Thêm Phụ Tùng
                                </Button>
                            </DivFlexRow>
                        </DivFlexRow>
                    </If>
                    <DataTable
                        noPage
                        isLoading={isLoading}
                        data={props.Retail.products}
                        onSearch={handleSearchItem}
                        limitList={20}
                        dataSearch={props.Product.data}
                        searchData={(search, item) => utils.searchName(item.maphutung, search) || utils.searchName(item.tentiengviet, search)}
                        renderSearch={(item, index) => {
                            return (
                                <option disabled={item.soluongtonkho == 0} key={index} value={item.maphutung}>
                                    {item.tentiengviet} ({item.soluongtonkho})
                                </option>
                            );
                        }}
                    >
                        <DataTable.Header>
                            <th>STT</th>
                            <th>Tên phụ tùng</th>
                            <th>Mã phụ tùng</th>
                            <th>Đơn giá (VND)</th>
                            <th>SL</th>
                            <th>Nhà Cung Cấp</th>
                            <th>Chiết khấu (%)</th>
                            <th>Tổng tiền (VND)</th>
                            <If condition={loai != 2}>
                                <th>
                                    <i className="far fa-trash-alt" />
                                </th>
                            </If>
                        </DataTable.Header>
                        <DataTable.Body
                            render={(item, index) => {
                                return (
                                    <tr key={index}>
                                        <CellText>{index + 1}</CellText>
                                        <CellText>{item.tenphutung}</CellText>
                                        <CellText>{item.maphutung}</CellText>
                                        <CellMoney>{item.dongia}</CellMoney>
                                        <CellText>
                                            <input
                                                type="number"
                                                readOnly={loai == 2}
                                                onChange={(e) => handleChangeSL(e, index)}
                                                value={item.soluong}
                                                min="1"
                                            />
                                        </CellText>
                                        <CellText>{item.nhacungcap ? item.nhacungcap : "Trung Trang"}</CellText>
                                        <CellText>
                                            <input
                                                type="number"
                                                max={100}
                                                readOnly={loai == 2}
                                                onChange={(e) => handleChangeChieuKhau(e, index)}
                                                value={item.chietkhau}
                                                min="0"
                                            />
                                        </CellText>
                                        <CellMoney>{item.tongtien}</CellMoney>
                                        <If condition={loai != 2}>
                                            <CellDelete onClick={() => handleDeleteProduct(index)}></CellDelete>
                                        </If>
                                    </tr>
                                );
                            }}
                        ></DataTable.Body>
                    </DataTable>

                    <DivFlexRow style={{ justifyContent: "flex-end" }}>
                        <h3>Tổng tiền: {utils.formatVND(props.Retail.tongTien)}</h3>
                    </DivFlexRow>
                    <DivFlexRow style={{ marginTop: 25, marginBottom: 5, justifyContent: "space-between" }}>
                        <label></label>
                        <Choose>
                            <When condition={loai == 0}>
                                <ButtonConfirm title={"Thanh toán"} titleConfirm={"Bạn muốn thanh toán hóa đơn"} onClick={handleAddBill} />
                            </When>
                            <When condition={loai == 1 && moment().valueOf() - moment(hoadon.ngaythanhtoan).valueOf() <= twoDay}>
                                <ButtonConfirm title={"Chỉnh sữa"} titleConfirm={"Bạn muốn chỉnh sữa hóa đơn"} onClick={handleUpdateBill} />
                            </When>
                            <When condition={loai == 2 && moment().valueOf() - moment(hoadon.ngaythanhtoan).valueOf() <= twoDay}>
                                <ButtonConfirm title={"Thay đổi"} titleConfirm={"Xác nhận"} onClick={handleRenderUpdateBill} />
                            </When>
                        </Choose>
                    </DivFlexRow>
                </Otherwise>
            </Choose>
        </React.Fragment>
    );
};

const mapState = (state) => ({
    Retail: state.Retail,
    Customer: state.Customer,
    Statff: state.Statff,
    Product: state.Product,
    Salary: state.Salary,
});

const mapDispatch = {
    getListCustomer: (query) => actions.CustomerAction.getListCustomer(query),
    refeshListProduct: () => actions.ProductAction.refeshListProduct(),
    loadRetailItemProduct: () => actions.RetailAction.loadRetailItemProduct(),
    addRetailItemProduct: (item) => actions.RetailAction.addRetailItemProduct(item),
    addRetailListItemProduct: (data) => actions.RetailAction.addRetailListItemProduct(data),
    updateRetailItemProduct: (item, index) => actions.RetailAction.updateRetailItemProduct(item, index),
    deleteRetailItemProduct: (index) => actions.RetailAction.deleteRetailItemProduct(index),
};

export default connect(mapState, mapDispatch)(Retail);
