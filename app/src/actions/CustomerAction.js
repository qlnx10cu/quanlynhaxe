import * as type from "./action-types";
import CustomerApi from "../API/CustomerApi";

export const getListCustomer = (query) => (dispatch) => {
    dispatch({
        type: type.CUSTOMER.LOADING_CUSTOMER,
        data: true,
    });

    return CustomerApi.getList(query)
        .then((res) => {
            dispatch({
                type: type.CUSTOMER.GET_LIST_CUSTOMER,
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
                type: type.CUSTOMER.LOADING_CUSTOMER,
                data: true,
            });
        });
};

export const addCustomer = (data) => (dispatch) => {
    return CustomerApi.add(data).then((res) => {
        data.ma = res.insertId;
        dispatch({
            type: type.CUSTOMER.ADD_CUSTOMER,
            data: data,
        });
    });
};

export const updateCustomer = (ma, data) => (dispatch) => {
    return CustomerApi.update(ma, data).then(() => {
        dispatch({
            type: type.CUSTOMER.UPDATE_CUSTOMER,
            data: data,
            ma: ma,
        });
    });
};

export const deleteCustomer = (ma) => (dispatch) => {
    return CustomerApi.delete(ma).then(() => {
        dispatch({
            type: type.CUSTOMER.DELETE_CUSTOMER,
            ma: ma,
        });
    });
};
