import ApiObject from "./ApiObject";

class HistoryCallApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
}

export default new HistoryCallApi("/historycall", "callid");
