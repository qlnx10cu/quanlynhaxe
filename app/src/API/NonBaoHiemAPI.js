import { HOST } from "../Config";
import axios from "axios";

export const GetListNonBaoHiem = (token) => {
    let url = `${HOST}/item?loaiphutung=mũ bảo hiểm`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
};

export const DelNonBaoHiem = (token, id) => {
    let url = `${HOST}/item/maphutung/` + id;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.delete(url, { headers });
};

export const AddNonBaoHiem = (token, data) => {
    let url = `${HOST}/item`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.post(url, data, { headers });
};
export const UpdateNonBaoHiem = (token, data, id) => {
    let url = `${HOST}/item/maphutung/` + id;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.put(url, data, { headers });
};
