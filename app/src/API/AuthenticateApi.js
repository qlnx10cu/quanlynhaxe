import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class AuthenticateApi extends ApiObject {
    login(username, password) {
        let data = {
            Username: username,
            Password: password,
        };
        return APIUtils.post("/account/login/", data);
    }

    getInfo(username) {
        return APIUtils.get(`/employee/username/${username}`);
    }
}

export default new AuthenticateApi();
