import { UPDATE_LIFTTABLE } from "../actions/AppInfo";

const initState = {
    liftTable: [],
};

export default (state = initState, action) => {
    switch (action.type) {
        case UPDATE_LIFTTABLE: {
            return {
                ...state,
                liftTable: [...action.data],
            };
        }
        default:
            return state;
    }
};
