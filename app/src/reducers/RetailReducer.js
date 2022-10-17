import * as type from "../actions/action-types";
import utils from "../lib/utils";

const initState = {
    products: [],
    tongTien: 0,
};

const checkHasItem = (sp, item) => {
    if (sp.tenphutung.toLowerCase() == "" || sp.tenphutung.toLowerCase() != item.tenphutung.toLowerCase()) return false;
    if (sp.maphutung == "" || sp.maphutung.toLowerCase() != item.maphutung.toLowerCase()) return false;
    if (sp.nhacungcap == "" || sp.nhacungcap != "Trung Trang" || sp.nhacungcap.toLowerCase() != item.nhacungcap.toLowerCase()) return false;
    if (!sp.dongia || sp.dongia < 0 || sp.dongia != item.dongia) return false;
    return true;
};

const updateItem = (products, i, newItem) => {
    newItem.tongtien = utils.tinhTongTien(newItem.dongia, newItem.soluong, newItem.chietkhau);
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

export default (state = initState, action) => {
    switch (action.type) {
        case type.RETAIL.LOADING_RETAIL_ITEM_PRODUCT: {
            const newState = { ...state };
            newState.products = [];
            newState.tongTien = 0;
            return newState;
        }
        case type.RETAIL.ADD_RETAIL_ITEM_PRODUCT: {
            const newState = { ...state };
            const item = action.data;

            newState.products = addItem(newState.products, item);
            newState.tongTien = newState.products.reduce((sum, e) => sum + e.tongtien, 0);

            return newState;
        }
        case type.RETAIL.ADD_RETAIL_LIST_ITEM_PRODUCT: {
            const newState = { ...state };
            const data = action.data || [];
            data.forEach((item) => {
                newState.products = addItem(newState.products, item);
            });
            newState.tongTien = newState.products.reduce((sum, e) => sum + e.tongtien, 0);

            return newState;
        }
        case type.RETAIL.UPDATE_RETAIL_ITEM_PRODUCT: {
            const newState = { ...state };
            const item = action.data;
            const index = action.index;

            const newItem = { ...newState.products[index] };
            newItem.soluong = item.soluong;
            newItem.chietkhau = item.chietkhau;

            newState.products = updateItem(newState.products, index, newItem);
            newState.tongTien = newState.products.reduce((sum, e) => sum + e.tongtien, 0);

            return newState;
        }

        case type.RETAIL.DELETE_RETAIL_ITEM_PRODUCT: {
            const newState = { ...state };
            const index = action.data;

            newState.products.splice(index, 1);
            newState.tongTien = newState.products.reduce((sum, e) => sum + e.tongtien, 0);

            return newState;
        }

        default:
            return state;
    }
};
