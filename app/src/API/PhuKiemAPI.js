import { HOST } from "../Config";
import axios from "axios";

export const GetListPhuKien = (token) => {
    let url = `${HOST}/itemaccessary`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
};

export const DelPhuKien = (token, id) => {
    let url = `${HOST}/itemaccessary/maphutung/` + id;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.delete(url, { headers });
};

export const AddPhuKien = (token, data) => {
    let url = `${HOST}/itemaccessary`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.post(url, data, { headers });
};

export const UpdatePhuKien = (token, data, id) => {
    let url = `${HOST}/itemaccessary/maphutung/${id}`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.put(url, data, { headers });
};

export const GetDetailPhuKien = (token, maphukien) => {
    let url = `${HOST}/itemaccessary/maphutung/${maphukien}`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
};
