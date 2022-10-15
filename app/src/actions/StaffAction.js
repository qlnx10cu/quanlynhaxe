import * as type from "./action-types";
import StaffsApi from "../API/StaffsApi";

export const getListStaff = () => (dispatch) => {
    dispatch({
        type: type.STAFFS.LOADING_STAFFS,
        data: true,
    });

    return StaffsApi.getList()
        .then((res) => {
            dispatch({
                type: type.STAFFS.GET_LIST_STAFFS,
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
                type: type.STAFFS.LOADING_STAFFS,
                data: true,
            });
        });
};

export const addStaff = (data) => (dispatch) => {
    return StaffsApi.add(data).then(() => {
        dispatch({
            type: type.STAFFS.ADD_STAFFS,
            data: data,
        });
    });
};

export const updateStaff = (ma, data) => (dispatch) => {
    return StaffsApi.update(ma, data).then(() => {
        dispatch({
            type: type.STAFFS.UPDATE_STAFFS,
            data: data,
            ma: ma,
        });
    });
};

export const deleteStaff = (ma) => (dispatch) => {
    return StaffsApi.delete(ma).then(() => {
        dispatch({
            type: type.STAFFS.DELETE_STAFFS,
            ma: ma,
        });
    });
};
