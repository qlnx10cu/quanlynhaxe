import axios from "axios";
import { HOST } from "../Config";

var token = "";

function serError(err) {
    if (err === null || err === undefined || err === "") {
        return "";
    }

    if (typeof err == "object" && !Array.isArray(err)) {
        if (err.response && err.response.status == 400 && err.response.data && err.response.data.error && err.response.data.error.message) {
            return err.response.data.error.message;
        }

        return String(err.message || err);
    }

    return String(err);
}

export default class APIUtils {
    static setToken(tk) {
        token = tk;
    }

    static request(method = "GET", url = "", data = {}) {
        let fullUrl = HOST + url;

        let headers = {};
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }
        return new Promise((resolve, reject) => {
            try {
                axios
                    .request({ method: method, url: fullUrl, data, headers })
                    .then((res) => {
                        if (!res || !res.data) {
                            reject({ error: -1, message: "Không có wifi" });
                            return;
                        }
                        resolve(res.data);
                    })
                    .catch((err) => {
                        reject({ error: -1, message: serError(err) });
                    });
            } catch (error) {
                reject({ error: -1, message: serError(error) });
            }
        });
    }
    static get(url = "") {
        return this.request("GET", url);
    }
    static post(url = "", data = {}) {
        return this.request("POST", url, data);
    }
    static put(url = "", data = {}) {
        return this.request("PUT", url, data);
    }
    static delete(url = "", data = {}) {
        return this.request("DELETE", url, data);
    }
}

window.APIUtils = APIUtils;
