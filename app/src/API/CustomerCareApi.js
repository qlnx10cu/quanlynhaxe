import ApiObject from "./ApiObject";

class CustomerCareApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
}

export default new CustomerCareApi("/chamsoc", "ma");
