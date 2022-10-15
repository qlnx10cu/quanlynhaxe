import * as type from "../actions/action-types";

const initState = {
    data: [],
    isLoading: true,
};

export default (state = initState, action) => {
    switch (action.type) {
        case type.SALARY.GET_LIST_SALARY: {
            const newState = { ...state };
            newState.data = [...action.data];
            newState.isLoading = false;

            return newState;
        }
        case type.SALARY.LOADING_SALARY: {
            const newState = { ...state };
            newState.isLoading = action.data;

            return newState;
        }

        case type.SALARY.ADD_SALARY: {
            const staff = state.data.find((sta) => sta.ma == action.data.ma);
            if (staff) return state;

            const newState = { ...state };
            newState.data = [action.data, ...newState.data];

            return newState;
        }

        case type.SALARY.UPDATE_SALARY: {
            const index = state.data.findIndex((sta) => sta.ma == action.ma);
            const staff = state.data.find((sta) => sta.ma == action.ma);

            if (index < 0 || index >= state.data.length || !staff || staff.ma != action.ma || !action.data) return state;

            const data = { ...staff, ...action.data };

            const newState = { ...state };

            newState.data = [...newState.data.slice(0, index), data, ...newState.data.slice(index + 1, newState.data.length)];

            return newState;
        }

        case type.SALARY.DELETE_SALARY: {
            const newState = { ...state };
            newState.data = newState.data.filter((staff) => staff.ma != action.ma);

            return newState;
        }

        default:
            return state;
    }
};
