export const UPDATE_LIFTTABLE = "UPDATE_LIFTTABLE";

export const updateLiftTable = (data) => (dispatch) => {
    dispatch({
        type: UPDATE_LIFTTABLE,
        data: data,
    });
};
