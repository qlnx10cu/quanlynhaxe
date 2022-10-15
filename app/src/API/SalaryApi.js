import ApiObject from "./ApiObject";

class SalaryApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
}

export default new SalaryApi("/salary", "ma");
