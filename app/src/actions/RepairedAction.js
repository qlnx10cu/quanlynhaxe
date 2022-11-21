import * as type from "./action-types";

export const loadRepairedItemProduct = () => (dispatch) => {
    dispatch({
        type: type.REPAIRED.LOADING_REPAIRED_ITEM_PRODUCT,
    });
};
export const addRepairedItemProduct = (item) => (dispatch) => {
    dispatch({
        type: type.REPAIRED.ADD_REPAIRED_ITEM_PRODUCT,
        data: item,
    });
};

export const addRepairedListItemProduct = (item) => (dispatch) => {
    dispatch({
        type: type.REPAIRED.ADD_REPAIRED_LIST_ITEM_PRODUCT,
        data: item,
    });
};

export const updateRepairedItemProduct = (item, index) => (dispatch) => {
    dispatch({
        type: type.REPAIRED.UPDATE_REPAIRED_ITEM_PRODUCT,
        data: item,
        index: index,
    });
};

export const deleteRepairedItemProduct = (index) => (dispatch) => {
    dispatch({
        type: type.REPAIRED.DELETE_REPAIRED_ITEM_PRODUCT,
        data: index,
    });
};
