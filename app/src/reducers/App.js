import {
    IS_LOADING,
    SWAP_ALERT
} from '../actions/App'

const initState = {
    isLoading: false,
    alert: {
        isLoading: false,
        error: false,
        message: ""
    },
}

export default (state = initState, action) => {
    switch (action.type) {
        case IS_LOADING:
            {
                return {
                    ...state,
                    isLoading: action.data
                }
            }
        case SWAP_ALERT: {
            return {
                ...state,
                alert: {
                    isLoading: action.data.isLoading,
                    error: action.data.error,
                    message: action.data.message
                }
            }
        }
        default:
            return state;
    }
}