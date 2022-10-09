import { GetAllProduct } from "../API/Product";
export const REQUEST_LIST_PRODUCT = "REQUEST_LIST_PRODUCT";
export const REQUEST_LIST_PRODUCT_SUCCESS = "REQUEST_LIST_PRODUCT_SUCCESS";
export const REQUEST_LIST_PRODUCT_FAILER = "REQUEST_LIST_PRODUCT_FAILER";
export const ADD_BILL_PRODUCT = "ADD_BILL_PRODUCT";
export const UPDATE_BILL_PRODUCT = "UPDATE_BILL_PRODUCT";
export const DELETE_BILL_PRODUCT = "DELETE_BILL_PRODUCT";
export const DELETE_ITEM_BILL_PRODUCT = "DELETE_ITEM_BILL_PRODUCT";
export const DELETE_ITEM_BILL_PRODUCT_MA = "DELETE_ITEM_BILL_PRODUCT_MA";
export const SET_LIST_PRODUCT = "SET_LIST_PRODUCT";

export const GET_LIST_CHN_SUCCESS = "GET_LIST_CHN_SUCCESS";
export const GET_LIST_CHN_FAIL = "GET_LIST_CHN_FAIL";

export const getAllProduct = (token) => (dispatch) => {
    dispatch({
        type: REQUEST_LIST_PRODUCT,
    });

    return GetAllProduct(token)
        .then((response) => {
            dispatch({
                type: REQUEST_LIST_PRODUCT_SUCCESS,
                data: response.data,
            });
        })
        .catch((error) => {
            if (error)
                // dispatch(showNoti('Danger', error.response.data.message))
                dispatch({
                    type: REQUEST_LIST_PRODUCT_FAILER,
                });
        });
};
export const addBillProduct = (data) => (dispatch) => {
    dispatch({
        type: ADD_BILL_PRODUCT,
        data: data,
    });
};
export const updateBillProduct = (data, index) => (dispatch) => {
    dispatch({
        type: UPDATE_BILL_PRODUCT,
        data: data,
        index: index,
    });
};

export const deleteBillProduct = () => (dispatch) => {
    dispatch({
        type: DELETE_BILL_PRODUCT,
    });
};
export const deleteItemBillProduct = (key) => (dispatch) => {
    console.log(key);
    dispatch({
        type: DELETE_ITEM_BILL_PRODUCT,
        data: key,
    });
};

export const deleteItemBillProductMa = (key) => (dispatch) => {
    console.log(key);
    dispatch({
        type: DELETE_ITEM_BILL_PRODUCT_MA,
        data: key,
    });
};

export const setListBillProduct = (arr) => (dispatch) => {
    dispatch({
        type: SET_LIST_PRODUCT,
        data: arr,
    });
};
