import {HOST} from '../Config'
import axios from 'axios'

export const GetListSalary = (token) => {
    let url = `${HOST}/salary`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}
export const AddSalary = (token,data) => {
    let url = `${HOST}/salary`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url,data,{headers})
}
export const UpdateSalary = (token,data,id) => {
    let url = `${HOST}/salary/ma/`+id;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url,data,{headers})
}

export const DelSalary = (token,id) => {
    let url = `${HOST}/salary/ma/`+id;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    console.log(url);
    return axios.delete(url,{headers})
}