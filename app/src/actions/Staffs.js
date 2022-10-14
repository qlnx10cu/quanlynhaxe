import * as type from "./action-types";
import APIUtils from "../API/APIUtils";

export const getListStaff = () => (dispatch) => {
    dispatch({
        type: type.STAFFS.LOADING_STAFFS,
        data: true,
    });

    return APIUtils.get("/employee")
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
    return APIUtils.post("/employee", data).then((res) => {
        dispatch({
            type: type.STAFFS.ADD_STAFFS,
            data: data,
        });
    });
};

export const updateStaff = (data, ma) => (dispatch) => {
    return APIUtils.put("/employee/ma/" + ma, data).then((res) => {
        dispatch({
            type: type.STAFFS.UPDATE_STAFFS,
            data: data,
            ma: ma,
        });
    });
};

export const deleteStaff = (ma) => (dispatch) => {
    return APIUtils.delete("/employee/ma/" + ma).then((res) => {
        dispatch({
            type: type.STAFFS.DELETE_STAFFS,
            ma: ma,
        });
    });
};
