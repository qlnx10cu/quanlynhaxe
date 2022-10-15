import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class BillSuaChuaAPI extends ApiObject {
    constructor(name, key) {
        super(name, key);
    }
    delete(key) {
        return APIUtils.delete("/bill/" + this.key + "/" + key);
    }

}

export default new BillSuaChuaAPI("/billsuachua", "mahoadon");
