import ApiObject from "./ApiObject";

class StaffApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
}

export default new StaffApi("/employee", "ma");
