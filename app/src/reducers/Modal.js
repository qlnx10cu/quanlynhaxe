import * as type from "../actions/action-types";

const initState = [];

export default (state = initState, action) => {
    if (!action.name) return state;

    const name = action.name;
    const newState = [...state];

    switch (action.type) {
        case type.MODAL.OPEN_MODAL: {
            const idx = new Date().getTime();
            const id = name + "_" + idx;
            const popup = {};
            popup.id = id;
            popup.name = name;
            popup.open = true;
            popup.callback = action.callback;
            popup.data = action.data ? { ...action.data } : null;
            newState.push(popup);
            return newState;
        }
        case type.MODAL.CLOSE_MODAL:
            if (!action.id) {
                return newState.filter((e) => e.name != action.name);
            }
            return newState.filter((e) => e.id != action.id);
        default:
            return state;
    }
};
