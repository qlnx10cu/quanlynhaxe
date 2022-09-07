import { HOST } from '../Config'
import axios from 'axios'

export const GetChamSocTheoNgay = (token, start, end) => {
    let url = `${HOST}/chamsoc/bydate?end=${end}&start=${start}`;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url, { headers })
}

export const GeChamSoc = (token, ma) => {
    let url = `${HOST}/chamsoc/ma/${ma}`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url, { headers })
}

export const UpdateChamSoc = (token, data, ma) => {
    let url = `${HOST}/chamsoc/ma/` + ma
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url, data, { headers })
}