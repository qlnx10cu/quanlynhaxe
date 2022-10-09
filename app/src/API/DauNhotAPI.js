import { HOST } from "../Config";
import axios from "axios";

export const GetListDauNhot = (token) => {
    let url = `${HOST}/item?loaiphutung=dầu nhớt`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
};

export const DelDauNhot = (token, id) => {
    let url = `${HOST}/item/maphutung/` + id;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.delete(url, { headers });
};

export const AddDauNhot = (token, data) => {
    let url = `${HOST}/item`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.post(url, data, { headers });
};
export const UpdateDauNhot = (token, data) => {
    let url = `${HOST}/item/maphutung/${data.maphutung}`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.put(url, data, { headers });
};
