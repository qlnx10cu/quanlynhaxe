export const IS_LOADING = "IS_LOADING";
export const ADD_LOADING = "ADD_LOADING";
export const SWAP_ALERT = "SWAP_ALERT";
export const SWAP_CONFIRM = "SWAP_CONFIRM";

export const setLoading = (isLoading, totalLoading) => (dispatch) => {
    dispatch({
        type: IS_LOADING,
        data: {
            isLoading: isLoading,
            totalLoading: totalLoading,
        },
    });
};
export const addLoading = () => {
    return {
        type: ADD_LOADING,
        data: null,
    };
};

export const setAlert = (isLoading, message, error) => {
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: isLoading,
            error: error,
            message: message,
        },
    };
};

export const alert = (message) => {
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: true,
            error: 0,
            message: message,
        },
    };
};

export const error = (message, err) => {
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: true,
            error: 1,
            message: message,
        },
    };
};

export const errorHttp = (res, message, err) => {
    if (
        typeof res === "object" &&
        !Array.isArray(res) &&
        res &&
        res.response &&
        res.response.data &&
        res.response.data.error &&
        res.response.data.error.message
    ) {
        message = res.response.data.error.message;
    }
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: true,
            error: 1,
            message: message,
        },
    };
};

export const success = (message, err) => {
    return {
        type: SWAP_ALERT,
        data: {
            isLoading: true,
            error: 2,
            message: message,
        },
    };
};

export const setConfirm = (isLoading, message, callback) => {
    return {
        type: SWAP_CONFIRM,
        data: {
            isLoading: isLoading,
            callback: callback,
            message: message,
        },
    };
};

export const confirm = (message, callback) => {
    return {
        type: SWAP_CONFIRM,
        data: {
            isLoading: true,
            error: 0,
            callback: callback,
            message: message,
        },
    };
};
export const confirmError = (message, errorType, callback) => {
    return {
        type: SWAP_CONFIRM,
        data: {
            isLoading: true,
            error: errorType,
            callback: callback,
            message: message,
        },
    };
};
