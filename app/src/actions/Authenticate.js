import { Login, GetInfo } from "../API/Authenticate";

export const REQUEST_AUTH = "REQUEST_AUTH";
export const SUCCESS_AUTH = "SUCCESS_AUTH";
export const GET_INFO_SUCCESS = "GET_INFO_SUCCESS";
export const FAILER_AUTH = "FAILER_AUTH";
export const LOGOUT = "LOGOUT";
export const logout = () => ({ type: LOGOUT });
export const authenticate = (username, password) => (dispatch) => {
    dispatch({
        type: REQUEST_AUTH,
    });

    return Login(username, password)
        .then((response) => {
            GetInfo(response.data.token, username).then((res) => {
                dispatch({
                    type: GET_INFO_SUCCESS,
                    data: res.data,
                });
                dispatch({
                    type: SUCCESS_AUTH,
                    data: response.data,
                });
            });
        })
        .catch((error) => {
            if (error) {
                alert("Đăng nhập thất bại");
                // dispatch(showNoti('Danger', error.response.data.message))
                dispatch({
                    type: FAILER_AUTH,
                });
            }
        });
};
