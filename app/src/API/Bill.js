import {HOST} from '../Config'
import axios from 'axios'

export const SaveBill = (token,data) => {
    let url = `${HOST}/billsuachua`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url,data,{headers})
}
export const GetCuaHangNgoai = (token) => {
    let url = `${HOST}/cuahangngoai`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}

export const CheckUpdateBill = (token, data) => {
    let url = `${HOST}/bill/checkupdate`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url,data,{headers})
}

export const UpdateBillBanLe = (token, data) => {
    let url = `${HOST}/billle/mahoadon/${data.mahoadon}`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url,data,{headers})
}
export const SaveBillBanLe = (token, data) => {
    let url = `${HOST}/billle`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url,data,{headers})
}

export const GetBillSuaChuaByMaHoaDon = (token, mahoadon) => {
    let url = `${HOST}/billsuachua/mahoadon/${mahoadon}/chitiet`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}

export const GetBillBanLeByMaHoaDon = (token, mahoadon) => {
    let url = `${HOST}/billle/mahoadon/${mahoadon}/chitiet`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}


export const ThanhToan = (token, mahoadon) => {
    let url = `${HOST}/bill/mahoadon/${mahoadon}/thanhtoan`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url,{headers})
}


export const UpdateBill = (token,data) => {
    let url = `${HOST}/billsuachua/mahoadon/${data.mahoadon}`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url,data,{headers})
}

export const HuyThanhToan = (token, mahoadon) => {
    let url = `${HOST}/bill/mahoadon/${mahoadon}/`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.delete(url,{headers})
}

export const HuyThanhToanLe = (token, mahoadon) => {
    let url = `${HOST}/billle/mahoadon/${mahoadon}/`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.delete(url,{headers})
}