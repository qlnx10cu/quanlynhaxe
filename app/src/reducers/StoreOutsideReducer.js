import * as type from "../actions/action-types";

const initState = {
    data: [],
    isLoading: true,
};

export default (state = initState, action) => {
    switch (action.type) {
        case type.STORE_OUTSIDE.GET_LIST_STORE_OUTSIDE: {
            const newState = { ...state };
            newState.data = [...action.data];
            newState.isLoading = false;

            return newState;
        }
        case type.STORE_OUTSIDE.LOADING_STORE_OUTSIDE: {
            const newState = { ...state };
            newState.isLoading = action.data;

            return newState;
        }

        case type.STORE_OUTSIDE.ADD_STORE_OUTSIDE: {
            const storeOutside = state.data.find((sta) => sta.tenphutung == action.data.tenphutung && sta.nhacungcap == action.data.nhacungcap);
            if (storeOutside) return state;

            const newState = { ...state };
            newState.data = [action.data, ...newState.data];

            return newState;
        }

        case type.STORE_OUTSIDE.UPDATE_STORE_OUTSIDE: {
            const index = state.data.findIndex((sta) => sta.tenphutung == action.tenphutung && sta.nhacungcap == action.nhacungcap);
            const storeOutside = state.data.find((sta) => sta.tenphutung == action.tenphutung && sta.nhacungcap == action.nhacungcap);

            if (index < 0 || index >= state.data.length || !storeOutside || !action.data) return state;

            const data = { ...storeOutside, ...action.data };

            const newState = { ...state };

            newState.data = [...newState.data.slice(0, index), data, ...newState.data.slice(index + 1, newState.data.length)];

            return newState;
        }

        case type.STORE_OUTSIDE.DELETE_STORE_OUTSIDE: {
            const newState = { ...state };
            newState.data = newState.data.filter((sta) => !(sta.tenphutung == action.tenphutung && sta.nhacungcap == action.nhacungcap));

            return newState;
        }

        default:
            return state;
    }
};
