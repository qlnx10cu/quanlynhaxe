import utils from "../lib/utils";
import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class CustomerApi extends ApiObject {
    constructor(name, ma) {
        super(name, ma);
    }

    getList(query) {
        if (!query) {
            return super.getList();
        }
        const vn = utils.viToEn(query);
        const ma = utils.parseInt(query);

        return APIUtils.get(`/customer?ma=${ma}&ten=${query}&sodienthoai=${vn}&biensoxe=${vn}&sokhung=${vn}&somay=${vn}`);
    }

    getBySoDienThoai(sodienthoai) {
        return APIUtils.get(`/customer/sodienthoai/${sodienthoai}`);
    }

    getByBienSoXe(biensoxe) {
        return APIUtils.get(`/customer?biensoxe=${biensoxe}`);
    }
}

export default new CustomerApi("/customer", "ma");
