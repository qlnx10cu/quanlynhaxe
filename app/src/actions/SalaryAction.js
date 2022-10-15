import * as type from "./action-types";
import SalaryApi from "../API/SalaryApi";

export const getListSalary = () => (dispatch) => {
    dispatch({
        type: type.SALARY.LOADING_SALARY,
        data: true,
    });

    return SalaryApi.getList()
        .then((res) => {
            dispatch({
                type: type.SALARY.GET_LIST_SALARY,
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
                type: type.SALARY.LOADING_SALARY,
                data: true,
            });
        });
};

export const addSalary = (data) => (dispatch) => {
    return SalaryApi.add(data).then((res) => {
        data.ma = res.insertId;
        dispatch({
            type: type.SALARY.ADD_SALARY,
            data: data,
        });
    });
};

export const updateSalary = (ma, data) => (dispatch) => {
    return SalaryApi.update(ma, data).then(() => {
        dispatch({
            type: type.SALARY.UPDATE_SALARY,
            data: data,
            ma: ma,
        });
    });
};

export const deleteSalary = (ma) => (dispatch) => {
    return SalaryApi.delete(ma).then(() => {
        dispatch({
            type: type.SALARY.DELETE_SALARY,
            ma: ma,
        });
    });
};
