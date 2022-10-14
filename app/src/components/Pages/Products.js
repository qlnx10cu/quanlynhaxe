import React, { useState, useEffect } from "react";
import { DivFlexRow, ButtonChooseFile, Button, DivFlexColumn } from "../../styles";
import { connect } from "react-redux";
import Loading from "../Loading";
import { GetFileExportProduct, ImportMuBH } from "../../API/Product";
import XLSX from "xlsx";
import { deleteProduct, getListProduct } from "../../actions/Product";
import moment from "moment";
import { DelAllPhuTung } from "../../API/PhuTungAPI";
import DataTable from "../Warrper/DataTable";
import { ButtonDelete, ButtonEdit } from "../Styles";
import utils from "../../lib/utils";
import { POPUP_NAME } from "../../actions/Modal";

function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

/* eslint-disable camelcase */

function readFile(file, token, props) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        // console.log('aaa')
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            var dataFile = new Uint8Array(e.target.result);
            var workbook = XLSX.read(dataFile, { type: "array" });
            var dataSend = {
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
                            var date = stringToDate(ws["I" + i].v, "DD/MM/YYYY", "/");
                            data.ngaycapnhat = moment(date).format("MM/DD/YYYY");
                        }
                        dataSend.chitiet.push(data);
                    }
                }
            }
            return ImportMuBH(token, dataSend)
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
    let [mArrPhuTung, setArrPhuTung] = useState([]);

    useEffect(() => {
        props.getListProduct();
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
        var files = e.target.files;
        props.setLoading(true);
        try {
            await readFile(files[0], props.token, props);
            props.getAllProduct(props.token);
            props.setLoading(false);
        } catch (err) {
            props.setLoading(false);
        }
    };
    const handleExportFile = (e) => {
        GetFileExportProduct(props.token)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Danh sách thống kê kho.xlsx");
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                props.error("Không thể xuất file");
            });
    };
    const handleXoaHetPhutung = () => {
        props.confirm("Bạn chắc muốn hủy", () => {
            DelAllPhuTung(props.token)
                .then((res) => {
                    props.alert("Xóa thành công.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((err) => {
                    props.error("Không xóa được. @@");
                });
        });
    };

    return (
        <Choose>
            <When condition={props.isLoading}>
                <Loading />
            </When>
            <Otherwise>
                <DivFlexColumn>
                    <DivFlexRow style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <DivFlexRow></DivFlexRow>
                        <Button onClick={() => handleXoaHetPhutung()}>Xóa hết phụ tùng</Button>
                        <DivFlexRow>
                            <ButtonChooseFile style={{ marginRight: 30 }}>
                                <input
                                    type="file"
                                    multiple
                                    accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={(e) => handleChoseFile(e)}
                                />
                                Import +
                            </ButtonChooseFile>
                            <Button onClick={(e) => handleExportFile(e)}>Export file thống kê</Button>
                        </DivFlexRow>
                    </DivFlexRow>
                    <div style={{ marginTop: 15 }}>
                        <DataTable
                            title="Danh sách phụ tùng"
                            data={mArrPhuTung}
                            isLoading={props.isLoading}
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
                                                <ButtonDelete onClick={() => deleteItem(item)} style={{ marginLeft: 5 }} />
                                            </td>
                                        </tr>
                                    );
                                }}
                            ></DataTable.Body>
                        </DataTable>
                    </div>
                </DivFlexColumn>
            </Otherwise>
        </Choose>
    );
};

const mapState = (state) => ({
    listPhuTung: state.Product.data,
    token: state.Authenticate.token,
    isLoading: state.App.isLoading,
});
const mapDispatch = {
    getListProduct: () => getListProduct(),
    deleteProduct: (maphutung) => deleteProduct(maphutung),
};
export default connect(mapState, mapDispatch)(Products);
