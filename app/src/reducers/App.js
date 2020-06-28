import {
    IS_LOADING,
    ADD_LOADING,
    SWAP_CONFIRM,
    SWAP_ALERT
} from '../actions/App'

const initState = {
    isLoading: false,
    totalLoading: 0,
    currentLoading: 0,
    alert: {
        isLoading: false,
        error: false,
        message: ""
    },
    confirm: {
        isLoading: false,
        callback: null,
        message: ""
    },
}

export default (state = initState, action) => {
    switch (action.type) {
        case IS_LOADING:
            {
                return {
                    ...state,
                    isLoading: action.data.isLoading,
                    totalLoading: action.data.totalLoading || 1,
                    currentLoading: action.data.currentLoading || 0
                }
            }
        case ADD_LOADING:
            {
                return {
                    ...state,
                    isLoading: state.currentLoading + 1 != state.totalLoading,
                    currentLoading: state.currentLoading + 1
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
        case SWAP_CONFIRM: {
            return {
                ...state,
                confirm: {
                    isLoading: action.data.isLoading,
                    callback: action.data.callback,
                    message: action.data.message
                }
            }
        }
        default:
            return state;
    }
}