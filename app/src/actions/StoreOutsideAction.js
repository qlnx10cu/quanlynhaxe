import * as type from "./action-types";
import StoreOutsideApi from "../API/StoreOutsideApi";

export const getListStoreOutside = () => (dispatch) => {
    dispatch({
        type: type.STORE_OUTSIDE.LOADING_STORE_OUTSIDE,
        data: true,
    });

    return StoreOutsideApi.getList()
        .then((res) => {
            dispatch({
                type: type.STORE_OUTSIDE.GET_LIST_STORE_OUTSIDE,
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
                type: type.STORE_OUTSIDE.LOADING_STORE_OUTSIDE,
                data: true,
            });
        });
};

export const addStoreOutside = (data) => (dispatch) => {
    return StoreOutsideApi.add(data).then(() => {
        dispatch({
            type: type.STORE_OUTSIDE.ADD_STORE_OUTSIDE,
            data: data,
        });
    });
};

export const updateStoreOutside = (tenphutung, nhacungcap, data) => (dispatch) => {
    return StoreOutsideApi.update(tenphutung, nhacungcap, data).then(() => {
        dispatch({
            type: type.STORE_OUTSIDE.UPDATE_STORE_OUTSIDE,
            data: data,
            tenphutung: tenphutung,
            nhacungcap: nhacungcap,
        });
    });
};

export const deleteStoreOutside = (tenphutung, nhacungcap) => (dispatch) => {
    return StoreOutsideApi.delete(tenphutung, nhacungcap).then(() => {
        dispatch({
            type: type.STORE_OUTSIDE.DELETE_STORE_OUTSIDE,
            tenphutung: tenphutung,
            nhacungcap: nhacungcap,
        });
    });
};
