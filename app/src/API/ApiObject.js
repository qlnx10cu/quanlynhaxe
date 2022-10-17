import APIUtils from "./APIUtils";

export default class ApiObject {
    constructor(name, key) {
        this.name = name;
        this.key = key;
    }
    getList() {
        return APIUtils.get(this.name);
    }
    getListByDate(start, end) {
        return APIUtils.get(this.name + "/bydate?end=" + end + "&start=" + start);
    }
    get(key) {
        if (!key) {
            return Promise.reject({ error: -1, message: "Thông số không đúng" });
        }
        return APIUtils.get(this.name + "/" + this.key + "/" + key);
    }
    getChitiet(key) {
        if (!key) {
            return Promise.reject({ error: -1, message: "Thông số không đúng" });
        }
        return APIUtils.get(this.name + "/" + this.key + "/" + key + "/chitiet");
    }
    add(data) {
        if (!data) {
            return Promise.reject({ error: -1, message: "Thông số không đúng" });
        }
        return APIUtils.post(this.name, data);
    }
    update(key, data) {
        if (!key || !data) {
            return Promise.reject({ error: -1, message: "Thông số không đúng" });
        }
        return APIUtils.put(this.name + "/" + this.key + "/" + key, data);
    }
    delete(key) {
        if (!key) {
            return Promise.reject({ error: -1, message: "Thông số không đúng" });
        }
        return APIUtils.delete(this.name + "/" + this.key + "/" + key);
    }
}

window.ApiObject = ApiObject;
