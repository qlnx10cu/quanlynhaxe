import * as type from "../actions/action-types";
import utils from "../lib/utils";

const initState = {
    products: [],
    tongpt: 0,
    tongcong: 0,
    tongTien: 0,
};

const checkHasItem = (sp, item) => {
    if (item.loaiphutung == "tiencong") return false;
    if (sp.tenphutung.toLowerCase() == "" || sp.tenphutung.toLowerCase() != item.tenphutung.toLowerCase()) return false;
    if (sp.maphutung == "" || sp.maphutung.toLowerCase() != item.maphutung.toLowerCase()) return false;
    if (sp.nhacungcap == "" || sp.nhacungcap != "Trung Trang" || sp.nhacungcap.toLowerCase() != item.nhacungcap.toLowerCase()) return false;
    if (!sp.dongia || sp.dongia < 0 || sp.dongia != item.dongia) return false;
    return true;
};

const updateItem = (products, i, newItem) => {
    if (newItem.loaiphutung == "tiencong") {
        newItem.thanhtiencong = utils.tinhTongTien(newItem.tiencong, 1, newItem.chietkhau);
    } else {
        newItem.tienpt = utils.tinhTongTien(newItem.dongia, newItem.soluong);
        newItem.thanhtienpt = utils.tinhTongTien(newItem.dongia, newItem.soluong, newItem.chietkhau);
        newItem.thanhtiencong = utils.tinhTongTien(newItem.tiencong, 1, newItem.chietkhau);
    }

    newItem.tongtien = newItem.thanhtiencong + newItem.thanhtienpt;

    if (i == products.length) {
        return [...products, newItem];
    }
    return [...products.slice(0, i), newItem, ...products.slice(i + 1, products.length)];
};

const addItem = (products, item) => {
    let i = 0;
    for (i = 0; i < products.length; i++) {
        if (checkHasItem(item, products[i])) {
            break;
        }
    }
    if (i == products.length) {
        return updateItem(products, i, item);
    }

    const newItem = { ...products[i] };
    newItem.soluong = utils.parseInt(products[i].soluong) + utils.parseInt(item.soluong);

    return updateItem(products, i, newItem);
};

const updateState = (newState) => {
    newState.tongpt = newState.products.reduce((sum, e) => sum + e.thanhtienpt, 0);
    newState.tongcong = newState.products.reduce((sum, e) => sum + e.thanhtiencong, 0);
    newState.tongTien = newState.products.reduce((sum, e) => sum + e.tongtien, 0);

    return newState;
};

const convertProductOld = (product) => {
    product.forEach((element) => {
        if (element.loaiphutung === null) {
            if (element.dongia == 0) {
                element.soluong = 1;
                element.dongia = element.tiencong;
                element.thanhtiencong = element.tiencong;
                element.thanhtienpt = 0;
                element.loaiphutung = "tiencong";
                element.tongtien = element.thanhtiencong + element.thanhtienpt;
            } else {
                element.tienpt = utils.tinhTongTien(element.dongia, element.soluong);
                element.thanhtienpt = utils.tinhTongTien(element.dongia, element.soluong, element.chietkhau);
                element.thanhtiencong = utils.tinhTongTien(element.tiencong, 1, element.chietkhau);
                element.tongtien = element.thanhtienpt + element.thanhtiencong;
                if (element.maphutung) {
                    element.loaiphutung = "phutung";
                } else {
                    element.loaiphutung = "cuahangngoai";
                }
            }
        }

        element.tenphutung = element.tenphutungvacongviec;
        element.soluong = element.soluongphutung;

    });

    return product;
};

export default (state = initState, action) => {
    switch (action.type) {
        case type.REPAIRED.LOADING_REPAIRED_ITEM_PRODUCT: {
            const newState = { ...state };
            newState.products = [];

            return updateState(newState);
        }
        case type.REPAIRED.ADD_REPAIRED_ITEM_PRODUCT: {
            const newState = { ...state };
            const item = action.data;

            newState.products = addItem(newState.products, item);

            return updateState(newState);
        }
        case type.REPAIRED.ADD_REPAIRED_LIST_ITEM_PRODUCT: {
            const newState = { ...state };
            const data = convertProductOld(action.data || []);

            newState.products = [];
            data.forEach((item) => {
                newState.products = addItem(newState.products, item);
            });

            return updateState(newState);
        }
        case type.REPAIRED.UPDATE_REPAIRED_ITEM_PRODUCT: {
            const newState = { ...state };
            const item = action.data;
            const index = action.index;

            const newItem = { ...newState.products[index] };
            newItem.soluong = item.soluong;
            newItem.chietkhau = item.chietkhau;
            newItem.tiencong = item.tiencong;

            newState.products = updateItem(newState.products, index, newItem);

            return updateState(newState);
        }

        case type.REPAIRED.DELETE_REPAIRED_ITEM_PRODUCT: {
            const newState = { ...state };
            const index = action.data;

            newState.products.splice(index, 1);

            return updateState(newState);
        }

        default:
            return state;
    }
};
