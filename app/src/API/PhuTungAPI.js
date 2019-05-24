import {HOST} from '../Config'
import axios from 'axios'

export const GetListPhuTung = (token) => {
    let url = `${HOST}/itempart`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}

export const DelPhuTung = (token,id) => {
    let url = `${HOST}/itempart/maphutung/`+id;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.delete(url,{headers})
}

export const AddPhuTung = (token,data) => {
    let url = `${HOST}/itempart`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url,data,{headers})
}

export const UpdatePhuTung = (token,data) => {
    let url = `${HOST}/itempart/maphutung/${data.maphutung}`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url,data,{headers})
}

export const GetDetailPhuTung = (token, maphutung) => {
    let url = `${HOST}/itempart/maphutung/${maphutung}`
    let headers = {
        'Authorization': 'Bearer ' + token
    }

    return axios.get(url,{headers});
}