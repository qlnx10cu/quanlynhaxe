import * as type from "./action-types";

export const loadRetailItemProduct = () => (dispatch) => {
    dispatch({
        type: type.RETAIL.LOADING_RETAIL_ITEM_PRODUCT,
    });
};
export const addRetailItemProduct = (item) => (dispatch) => {
    dispatch({
        type: type.RETAIL.ADD_RETAIL_ITEM_PRODUCT,
        data: item,
    });
};

export const addRetailListItemProduct = (item) => (dispatch) => {
    dispatch({
        type: type.RETAIL.ADD_RETAIL_LIST_ITEM_PRODUCT,
        data: item,
    });
};

export const updateRetailItemProduct = (item, index) => (dispatch) => {
    dispatch({
        type: type.RETAIL.UPDATE_RETAIL_ITEM_PRODUCT,
        data: item,
        index: index,
    });
};

export const deleteRetailItemProduct = (index) => (dispatch) => {
    dispatch({
        type: type.RETAIL.DELETE_RETAIL_ITEM_PRODUCT,
        data: index,
    });
};
