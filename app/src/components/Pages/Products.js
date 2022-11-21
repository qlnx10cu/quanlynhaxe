import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { DivFlexRow, ButtonFile, DivFlexColumn } from "../../styles";
import * as actions from "../../actions";
import { ButtonDelete, ButtonEdit, ButtonUpload } from "../Styles";
import { POPUP_NAME } from "../../actions/Modal";
import XLSX from "xlsx";
import moment from "moment";
import lib from "../../lib";
import utils from "../../lib/utils";
import DataTable from "../Warrper/DataTable";
import ProductApi from "../../API/ProductApi";
import StatisticApi from "../../API/StatisticApi";

function stringToDate(_date, _format, _delimiter) {
    const formatLowerCase = _format.toLowerCase();
    const formatItems = formatLowerCase.split(_delimiter);
    const dateItems = _date.split(_delimiter);
    const monthIndex = formatItems.indexOf("mm");
    const dayIndex = formatItems.indexOf("dd");
    const yearIndex = formatItems.indexOf("yyyy");
    const month = parseInt(dateItems[monthIndex]) - 1;
    const formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);

    return formatedDate;
}

/* eslint-disable camelcase */

function readFile(file, props) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        // console.log('aaa')
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            const dataFile = new Uint8Array(e.target.result);
            const workbook = XLSX.read(dataFile, { type: "array" });
            const dataSend = {
                chitiet: [],
            };
            for (let k in workbook.SheetNames) {
                if (k != "1") continue;
                if (k == "1") {
                    const wsname = workbook.SheetNames[k];
                    const ws = workbook.Sheets[wsname];
                    let K = ws["!ref"].split(":")[1];
                    let vitriK = parseInt(K.substring(1, K.length));
                    for (let i = 7; i <= vitriK; i++) {
                        let data = {
                            maphutung: "",
                            ghichu: "",
                            tentiengviet: "",
                            mamau: "",
                            model: "",
                            loaiphutung: "phụ tùng",
                            soluongtonkho: 0,
                            vitri: "",
                            giaban_head: 0,
                            giaban_le: 0,
                            ngaycapnhat: null,
                        };
                        if (ws["B" + i] === undefined) continue;
                        if (ws["B" + i] && ws["B" + i] !== null) data.maphutung = String(ws["B" + i].v).toUpperCase();
                        if (ws["C" + i] && ws["C" + i] !== null) data.tentiengviet = ws["C" + i].v;
                        if (ws["D" + i] && ws["D" + i] !== null && ws["D" + i].v !== "") {
                            data.soluongtonkho = ws["D" + i].v;
                            if (!data.soluongtonkho || data.soluongtonkho === undefined || data.soluongtonkho === "") data.soluongtonkho = 0;
                        }
                        if (ws["E" + i] && ws["E" + i] !== null) data.vitri = ws["E" + i].w;
                        if (ws["F" + i] && ws["F" + i] !== null) data.model = ws["F" + i].v;
                        if (ws["G" + i] && ws["G" + i] !== null) data.giaban_head = ws["G" + i].v;
                        if (ws["H" + i] && ws["H" + i] !== null) data.giaban_le = ws["H" + i].v;
                        if (ws["I" + i] && ws["I" + i] !== null) {
                            const date = stringToDate(ws["I" + i].v, "DD/MM/YYYY", "/");
                            data.ngaycapnhat = moment(date).format("MM/DD/YYYY");
                        }
                        dataSend.chitiet.push(data);
                    }
                }
            }
            return ProductApi.import(dataSend)
                .then(() => {
                    props.alert("Thêm thành công");
                    window.location.href = "/products";
                })
                .catch(() => {
                    props.error("Lỗi khi thêm");
                    reject();
                });
        };
        reader.onloadend = function (e) {
            // return resolve(dataws);
        };
        reader.onerror = function (e) {
            return reject(e);
        };
    });
}

/* eslint-enable camelcase */

const Products = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [mArrPhuTung, setArrPhuTung] = useState([]);
    const useIsMounted = lib.useIsMounted();

    useEffect(() => {
        if (!props.phuTungLoading) {
            props.getListProduct();
        }
    }, []);
    useEffect(() => {
        if (props.listPhuTung) {
            setArrPhuTung(props.listPhuTung);
        }
    }, [props.listPhuTung]);

    const updateItem = (item) => {
        props.openModal(POPUP_NAME.POPUP_PRODUCTS, item, (data) => {
            props.alert("Update phụ tùng thành công");
        });
    };

    const deleteItem = (item) => {
        props.confirmError("Bạn chắc muốn hủy", 2, () => {
            return props
                .deleteProduct(item.maphutung)
                .then(() => {
                    props.alert("Xóa thành công");
                })
                .catch((err) => {
                    props.alert("Xóa thất bại \n\n Error:" + err.message);
                });
        });
    };

    const handleChoseFile = async (e) => {
        const files = e.target.files;
        setLoading(true);
        try {
            await readFile(files[0], props);
            props.getListProduct();
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };
    const handleExportFile = (e) => {
        setLoading(true);
        StatisticApi.getFileExportProduct()
            .then((data) => {
                if (!useIsMounted()) return;
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Danh sách thống kê kho.xlsx");
                document.body.appendChild(link);
                link.click();
            })
            .catch(() => {
                props.error("Không thể xuất file");
            })
            .finally(() => {
                if (!useIsMounted()) return;
                setLoading(false);
            });
    };
    const handleXoaHetPhutung = () => {
        props.confirm("Bạn chắc muốn hủy", () => {
            setLoading(true);
            ProductApi.deleteAll()
                .then((res) => {
                    if (!useIsMounted()) return;
                    props.alert("Xóa thành công.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((err) => {
                    props.error("Không xóa được. @@");
                })
                .finally(() => {
                    if (!useIsMounted()) return;
                    setLoading(false);
                });
        });
    };

    return (
        <DivFlexColumn>
            <DivFlexRow style={{ alignItems: "center", justifyContent: "space-between" }}>
                <DivFlexRow></DivFlexRow>
                <ButtonUpload isUpload={isLoading} onClick={() => handleXoaHetPhutung()}>
                    Xóa hết phụ tùng
                </ButtonUpload>
                <DivFlexRow>
                    <ButtonFile style={{ marginRight: 30 }}>
                        <input
                            disabled={isLoading}
                            readOnly={isLoading}
                            type="file"
                            multiple
                            accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={(e) => handleChoseFile(e)}
                        />
                        {isLoading ? "..." : "Import +"}
                    </ButtonFile>
                    <ButtonUpload isUpload={isLoading} onClick={(e) => handleExportFile(e)}>
                        Export file thống kê
                    </ButtonUpload>
                </DivFlexRow>
            </DivFlexRow>
            <div style={{ marginTop: 15 }}>
                <DataTable
                    title="Danh sách phụ tùng"
                    data={mArrPhuTung}
                    isLoading={isLoading}
                    searchData={(search, e) => utils.searchName(e.maphutung, search) || utils.searchName(e.tentiengviet, search)}
                >
                    <DataTable.Header>
                        <th>STT</th>
                        <th>Mã phụ tùng</th>
                        <th>Tên tiếng việt</th>
                        <th>Giá bán lẻ</th>
                        <th>Vị trí</th>
                        <th>Số lượng</th>
                        <th>Sửa/Xóa</th>
                    </DataTable.Header>
                    <DataTable.Body
                        render={(item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.maphutung}</td>
                                    <td>{item.tentiengviet}</td>
                                    <td>{(item.giaban_le || 0).toLocaleString("vi-VI", { style: "currency", currency: "VND" })}</td>
                                    <td>{item.vitri}</td>
                                    <td>{item.soluongtonkho}</td>
                                    <td>
                                        <ButtonEdit onClick={() => updateItem(item)} />
                                    </td>
                                </tr>
                            );
                        }}
                    ></DataTable.Body>
                </DataTable>
            </div>
        </DivFlexColumn>
    );
};

const mapState = (state) => ({
    listPhuTung: state.Product.data,
    phuTungLoading: state.Product.isLoading,
    isLoading: state.App.isLoading,
});
const mapDispatch = {
    getListProduct: () => actions.ProductAction.getListProduct(),
    deleteProduct: (maphutung) => actions.ProductAction.deleteProduct(maphutung),
};
export default connect(mapState, mapDispatch)(Products);
