import * as type from "./action-types";

export function openModal(name, data) {
    return {
        type: type.MODAL.OPEN_MODAL,
        name: name,
        data: data,
    };
}

export function closeModal(name, id) {
    return {
        type: type.MODAL.CLOSE_MODAL,
        name: name,
        id: id,
    };
}
