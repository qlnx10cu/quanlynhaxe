import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class StoreOutside extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
    update(tenphutung, nhacungcap, data) {
        return APIUtils.put(this.name + "/tenphutung/" + tenphutung + "/nhacungcap/" + nhacungcap, data);
    }
    delete(tenphutung, nhacungcap) {
        return APIUtils.delete(this.name + "/tenphutung/" + tenphutung + "/nhacungcap/" + nhacungcap);
    }
}

export default new StoreOutside("/cuahangngoai", "ma");
