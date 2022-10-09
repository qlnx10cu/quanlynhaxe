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
    listPhuTung: [],
    listPhuKien: [],
    listDauNhot: [],
    listMuBaoHiem: [],
    listProduct: [],
    listBillProduct: [],
};

export default (state = initState, action) => {
    switch (action.type) {
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
