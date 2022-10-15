import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class HistoryCallApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
}

export default new HistoryCallApi("/historycall", "callid");
