import { GetListStaff } from "../API/Staffs";

export const REQUEST_LIST_STAFF = "REQUEST_LIST_STAFF";
export const REQUEST_LIST_STAFF_SUCCESS = "REQUEST_LIST_STAFF_SUCCESS";
export const REQUEST_LIST_STAFF_FAILER = "REQUEST_LIST_STAFF_FAILER";

export const getListStaff = (token) => (dispatch) => {
    dispatch({
        type: REQUEST_LIST_STAFF,
    });
    return GetListStaff(token)
        .then((response) => {
            console.log(response.data);
            dispatch({
                type: REQUEST_LIST_STAFF_SUCCESS,
                data: response.data,
            });
        })
        .catch((error) => {
            if (error)
                // dispatch(showNoti('Danger', error.response.data.message))
                dispatch({
                    type: REQUEST_LIST_STAFF_FAILER,
                });
        });
};
