import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class BillApi extends ApiObject {
    constructor(name, key) {
        super(name, key);
    }

    checkUpdateBill(data) {
        return APIUtils.post("/bill/checkupdate", data);
    }
}

export default new BillApi("/bill", "mahoadon");
