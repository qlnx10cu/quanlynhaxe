import * as type from "../actions/action-types";

const initState = {
    isLoading: false,
    data: [],
};

export default (state = initState, action) => {
    switch (action.type) {
        case type.PRODUCTS.GET_LIST_PRODUCTS: {
            const newState = { ...state };
            newState.data = [...action.data];
            newState.isLoading = false;

            return newState;
        }
        case type.PRODUCTS.LOADING_PRODUCTS: {
            const newState = { ...state };
            newState.isLoading = action.data;

            return newState;
        }
        case type.PRODUCTS.ADD_PRODUCTS: {
            const newState = { ...state };
            newState.data = [...newState.data, action.data];

            return newState;
        }
        case type.PRODUCTS.UPDATE_PRODUCTS: {
            const index = state.data.findIndex((sta) => sta.maphutung == action.maphutung);
            const product = state.data.find((sta) => sta.maphutung == action.maphutung);

            if (index < 0 || index >= state.data.length || !product || product.maphutung != action.maphutung || !action.data) return state;

            const data = { ...product, ...action.data };
            const newState = { ...state };

            newState.data = [...newState.data.slice(0, index), data, ...newState.data.slice(index + 1, newState.data.length)];

            return newState;
        }
        case type.PRODUCTS.DELETE_PRODUCTS: {
            const newState = { ...state };
            newState.data = newState.data.filter((sta) => sta.maphutung != action.maphutung);

            return newState;
        }
        default:
            return state;
    }
};
