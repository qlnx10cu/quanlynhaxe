import * as type from "./action-types";
import ProductApi from "../API/ProductApi";

export const getListProduct = () => (dispatch) => {
    dispatch({
        type: type.PRODUCTS.LOADING_PRODUCTS,
        data: true,
    });

    return ProductApi.getList()
        .then((res) => {
            dispatch({
                type: type.PRODUCTS.GET_LIST_PRODUCTS,
                data: res,
            });
        })
        .catch((error) => {
            dispatch({
                type: "SWAP_ALERT",
                data: {
                    isLoading: true,
                    error: 1,
                    message: error.message,
                },
            });
            dispatch({
                type: type.PRODUCTS.LOADING_PRODUCTS,
                data: true,
            });
        });
};

export const refeshListProduct = () => (dispatch) => {
    return ProductApi.getList().then((res) => {
        dispatch({
            type: type.PRODUCTS.GET_LIST_PRODUCTS,
            data: res,
        });
    });
};

export const addProduct = (data) => (dispatch) => {
    return ProductApi.add(data).then(() => {
        dispatch({
            type: type.PRODUCTS.ADD_PRODUCTS,
            data: data,
        });
    });
};

export const updateProduct = (maphutung, data) => (dispatch) => {
    return ProductApi.update(maphutung, data).then(() => {
        dispatch({
            type: type.PRODUCTS.UPDATE_PRODUCTS,
            data: data,
            maphutung: maphutung,
        });
    });
};

export const deleteProduct = (maphutung) => (dispatch) => {
    return ProductApi.delete(maphutung).then(() => {
        dispatch({
            type: type.PRODUCTS.DELETE_PRODUCTS,
            maphutung: maphutung,
        });
    });
};
