
import {HOST} from '../Config'
import axios from 'axios'


export const GetListCuaHangNgoai = (token) => {
    let url = `${HOST}/cuahangngoai`;
    let headers = {
        'Authorization': 'Bearer ' + token,
    };
    return axios.get(url,{headers});
};

export const SaveItemCuaHangNgoai = (token, data) => {
    let url = `${HOST}/cuahangngoai`;
    let headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };
    return axios.post(url,data,{headers})
};

export const UpdateItemCuaHangNgoai=(token, data, tenphutung,nhacungcap) => {
    let url = `${HOST}/cuahangngoai/tenphutung/${tenphutung}/nhacungcap/${nhacungcap}`;
    let headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };
    return axios.put(url,data,{headers})
};

export const DeleteItemCuaHangNgoai=(token, tenphutung,nhacungcap) => {
    let url = `${HOST}/cuahangngoai/tenphutung/${tenphutung}/nhacungcap/${nhacungcap}`;
    let headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };
    return axios.delete(url,{headers})
};
