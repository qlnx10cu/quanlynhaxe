import * as type from "../actions/action-types";

const initState = [];

export default (state = initState, action) => {
    if (!action.name || !state[action.name]) return state;

    const name = action.name;
    const newState = [...state];

    switch (action.type) {
        case type.MODAL.OPEN_MODAL: {
            const idx = new Date().getTime();
            const id = name + "_" + idx;
            newState[id].id = id;
            newState[id].name = name;
            newState[id].open = true;
            newState[id].data = action.data ? { ...action.data } : { ...initState[name].data };
            return newState;
        }
        case type.MODAL.CLOSE_MODAL:
            newState = newState.filter((e) => e.id != action.id);
            return newState;
        default:
            return state;
    }
};
