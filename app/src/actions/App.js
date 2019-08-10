
export const IS_LOADING = 'IS_LOADING';

export const setLoading = (isLoading) => (dispatch) => {
    dispatch({
        type: IS_LOADING,
        data:isLoading
    });
}
