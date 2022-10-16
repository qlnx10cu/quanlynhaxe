import * as type from "../actions/action-types";

const initState = {
    data: [],
    isLoading: true,
};

export default (state = initState, action) => {
    switch (action.type) {
        case type.CUSTOMER.GET_LIST_CUSTOMER: {
            const newState = { ...state };
            newState.data = [...action.data];
            newState.isLoading = false;

            return newState;
        }
        case type.CUSTOMER.LOADING_CUSTOMER: {
            const newState = { ...state };
            newState.isLoading = action.data;

            return newState;
        }

        case type.CUSTOMER.ADD_CUSTOMER: {
            const customer = state.data.find((sta) => sta.ma == action.data.ma);
            if (customer) return state;

            const newState = { ...state };
            newState.data = [action.data, ...newState.data];

            return newState;
        }

        case type.CUSTOMER.UPDATE_CUSTOMER: {
            const index = state.data.findIndex((sta) => sta.ma == action.ma);
            const customer = state.data.find((sta) => sta.ma == action.ma);

            if (index < 0 || index >= state.data.length || !customer || customer.ma != action.ma || !action.data) return state;

            const data = { ...customer, ...action.data };

            const newState = { ...state };

            newState.data = [...newState.data.slice(0, index), data, ...newState.data.slice(index + 1, newState.data.length)];

            return newState;
        }

        case type.CUSTOMER.DELETE_CUSTOMER: {
            const newState = { ...state };
            newState.data = newState.data.filter((customer) => customer.ma != action.ma);

            return newState;
        }

        default:
            return state;
    }
};
