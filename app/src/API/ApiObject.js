import APIUtils from "./APIUtils";

export default class ApiObject {
    constructor(name, key) {
        this.name = name;
        this.key = key;
    }
    getList() {
        return APIUtils.get(this.name);
    }
    get(key) {
        return APIUtils.get(this.name + "/" + this.key + "/" + key);
    }
    add(data) {
        return APIUtils.post(this.name, data);
    }
    update(key, data) {
        return APIUtils.put(this.name + "/" + this.key + "/" + key, data);
    }
    delete(key) {
        return APIUtils.delete(this.name + "/" + this.key + "/" + key);
    }
}

window.ApiObject = ApiObject;
