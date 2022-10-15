import ApiObject from "./ApiObject";

class BillLeApi extends ApiObject {
    constructor(name, key) {
        super(name, key);
    }
}

export default new BillLeApi("/billle", "mahoadon");
