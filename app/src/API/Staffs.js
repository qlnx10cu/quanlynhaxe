import {HOST} from '../Config'
import axios from 'axios'

export const GetListStaff  = (token) => {
    let url = `${HOST}/employee`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}
export const AddStaff = (token,data) => {
    let url = `${HOST}/employee`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url,data,{headers})
}
export const DeleteStaff = (token,id) => {
    let url = `${HOST}/employee/ma/`+id;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.delete(url,{headers})
}

export const UpdateStaff = (token, data,id) => {
    let url = `${HOST}/employee/ma/`+id;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url,data, {headers})
}
export const GetListNVSuaChua  = (token) => {
    let url = `${HOST}/employee?chucvu=Sửa Chữa`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}