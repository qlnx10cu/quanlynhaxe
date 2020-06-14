
export const IS_LOADING = 'IS_LOADING';
export const SWAP_ALERT = 'SWAP_ALERT';

export const setLoading = (isLoading) => (dispatch) => {
    dispatch({
        type: IS_LOADING,
        data: isLoading
    });
}

export const setAlert = (isLoading, message, error) => {
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: isLoading,
            error: error,
            message: message
        }
    };
}

export const alert = (message) => {
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: true,
            error: false,
            message: message
        }
    };
}

export const error = (message, err) => {
    console.log(err)
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: true,
            error: true,
            message: message
        }
    };
}



