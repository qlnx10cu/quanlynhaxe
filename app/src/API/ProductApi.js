import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class ProductApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }
    getList() {
        return APIUtils.get("/item");
    }
    deleteAll() {
        return APIUtils.delete("/itempart/all/phutung");
    }
    import(data) {
        return APIUtils.post("/item/import", data);
    }
}

export default new ProductApi("/itempart", "maphutung");
