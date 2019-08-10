import {
    FAILER_AUTH,
    LOGOUT,
    SUCCESS_AUTH,
    REQUEST_AUTH,
    GET_INFO_SUCCESS
} from '../actions/Authenticate'

const initState ={
    isAuthenticating: false,
    isAuthenticated: false,
    token: null,
    role: null,
    info: null
}

export default (state = initState , action) => {
    switch(action.type) {
        case SUCCESS_AUTH: 
        {
            return {
                ...state,
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.data.token,
                role: action.data.role,
            }
        }
        case REQUEST_AUTH: {
            return {
                ...state,
                isAuthenticating: true,
            }
        }
        case FAILER_AUTH: {
            return {
                ...state,
                isAuthenticating: false,
                isAuthenticated: false,
            }
        }
        case GET_INFO_SUCCESS: {
            return {
                ...state,
                info: action.data,
            }
        }
        case LOGOUT: {
            return initState
        }
        default:
            return state;
    }
}