import {
   IS_LOADING
} from '../actions/App'

const initState ={
    isLoading: false
}

export default (state = initState , action) => {
    switch(action.type) {
        case IS_LOADING:
        {
            return {
                ...state,
                isLoading: action.data
            }
        }
        default:
            return state;
    }
}