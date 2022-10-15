import * as type from "./action-types";

export const POPUP_NAME = {
    POPUP_STAFFS: "POPUP_STAFFS",
    POPUP_PRODUCTS: "POPUP_PRODUCTS",
    POPUP_SALARIES: "POPUP_SALARIES",
    POPUP_STORE_OUTSIDES: "POPUP_STORE_OUTSIDES",
    POPUP_COMFIRM_BILL: "POPUP_COMFIRM_BILL",
    POPUP_BILL: "POPUP_BILL",
    POPUP_CUSTOMER_HISTORY: "POPUP_CUSTOMER_HISTORY",

};

export function openModal(name, data, callback) {
    return {
        type: type.MODAL.OPEN_MODAL,
        name: name,
        data: data,
        callback: callback,
    };
}

export function closeModal(name, id) {
    return {
        type: type.MODAL.CLOSE_MODAL,
        name: name,
        id: id,
    };
}
