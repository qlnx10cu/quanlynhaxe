import * as type from "../actions/action-types";

import {
    REQUEST_LIST_PRODUCT_SUCCESS,
    REQUEST_LIST_PRODUCT_FAILER,
    ADD_BILL_PRODUCT,
    UPDATE_BILL_PRODUCT,
    DELETE_BILL_PRODUCT,
    DELETE_ITEM_BILL_PRODUCT,
    DELETE_ITEM_BILL_PRODUCT_MA,
    SET_LIST_PRODUCT,
} from "../actions/Product";

const initState = {
    isLoading: false,
    data: [],
    listPhuTung: [],
    listPhuKien: [],
    listDauNhot: [],
    listMuBaoHiem: [],
    listProduct: [],
    listBillProduct: [],
};

export default (state = initState, action) => {
    switch (action.type) {
        case type.PRODUCTS.GET_LIST_PRODUCTS: {
            const newState = { ...state };
            newState.data = [...action.data];
            newState.isLoading = false;

            return newState;
        }
        case type.PRODUCTS.LOADING_PRODUCTS: {
            const newState = { ...state };
            newState.isLoading = action.data;

            return newState;
        }

        case type.PRODUCTS.ADD_PRODUCTS: {
            const newState = { ...state };
            newState.data = [...newState.data, action.data];

            return newState;
        }

        case type.PRODUCTS.UPDATE_PRODUCTS: {
            const index = state.data.findIndex((sta) => sta.maphutung == action.maphutung);
            const product = state.data.find((sta) => sta.maphutung == action.maphutung);

            if (index < 0 || index >= state.data.length || !product || product.maphutung != action.maphutung || !action.data) return state;

            const data = { ...product, ...action.data };

            const newState = { ...state };

            newState.data = [...newState.data.slice(0, index), data, ...newState.data.slice(index + 1, newState.data.length)];

            return newState;
        }

        case type.PRODUCTS.DELETE_PRODUCTS: {
            const newState = { ...state };
            newState.data = newState.data.filter((sta) => sta.maphutung != action.maphutung);

            return newState;
        }

        case REQUEST_LIST_PRODUCT_SUCCESS: {
            let listPhuTung = action.data.filter(function (e) {
                return e.loaiphutung === "phụ tùng";
            });

            let listPhuKien = action.data.filter(function (e) {
                return e.loaiphutung === "phụ kiện";
            });

            let listDauNhot = action.data.filter(function (e) {
                return e.loaiphutung === "dầu nhớt";
            });

            let listMuBaoHiem = action.data.filter(function (e) {
                return e.loaiphutung === "mũ bảo hiểm";
            });

            return {
                ...state,
                listPhuTung: listPhuTung,
                listPhuKien: listPhuKien,
                listDauNhot: listDauNhot,
                listMuBaoHiem: listMuBaoHiem,
                listProduct: action.data,
            };
        }
        case REQUEST_LIST_PRODUCT_FAILER: {
            return {
                ...state,
                listProduct: [],
            };
        }
        case ADD_BILL_PRODUCT: {
            return {
                ...state,
                listBillProduct: [...state.listBillProduct, action.data],
            };
        }
        case UPDATE_BILL_PRODUCT: {
            return {
                ...state,
                listBillProduct: [
                    ...state.listBillProduct.slice(0, action.index),
                    action.data,
                    ...state.listBillProduct.slice(action.index + 1, state.listBillProduct.lenght),
                ],
            };
        }
        case DELETE_BILL_PRODUCT: {
            return {
                ...state,
                listBillProduct: [],
            };
        }
        case DELETE_ITEM_BILL_PRODUCT: {
            var temp1 = state.listBillProduct.filter(function (item) {
                return item.key !== action.data;
            });
            return {
                ...state,
                listBillProduct: temp1,
            };
        }
        case DELETE_ITEM_BILL_PRODUCT_MA: {
            var temp2 = state.listBillProduct.filter(function (item) {
                return item.ma !== action.data;
            });
            return {
                ...state,
                listBillProduct: temp2,
            };
        }
        case SET_LIST_PRODUCT: {
            return {
                ...state,
                listBillProduct: action.data,
            };
        }
        default:
            return state;
    }
};
