import { HOST } from "../Config";
import axios from "axios";

export const SearchProductById = (token, id) => {
    let url = `${HOST}/item?maphutung=` + id;
    let headers = {};
    return axios.get(url, { headers });
};
export const GetAllProduct = (token) => {
    let url = `${HOST}/item`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
};
export const GetFileExportProduct = (token) => {
    // let url = `${HOST}/statistic/layfile`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    // return axios.get(url,{headers})
    return axios(
        {
            url: `${HOST}/statistic/layfile`,
            method: "GET",
            responseType: "blob", // important
        },
        { headers }
    );
};
export const ImportPhuTung = (token, data) => {
    let url = `${HOST}/itempart/import`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.post(url, data, { headers });
};
export const ImportPhuKien = (token, data) => {
    let url = `${HOST}/itemaccessary/import`;
    let headers = {
        Authorization: "Bearer " + token,
    };
    return axios.post(url, data, { headers });
};
export const ImportMuBH = (token, data) => {
    let url = `${HOST}/item/import`;
    let headers = {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
    };
    return axios.post(url, data, { headers });
};
