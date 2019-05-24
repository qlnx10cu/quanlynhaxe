import { HOST } from '../Config'
import axios from 'axios'

export const GetlistCustomer = (token) => {
    let url = `${HOST}/customer`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url, { headers })
}

export const GetCustomerDetail = (token, ma) => {
    let url = `${HOST}/customer/ma/${ma}/chitiet`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url, { headers })
}


export const AddCustomer = (token, data) => {
    let url = `${HOST}/customer`
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.post(url, data, { headers })
}
export const UpdateCustomer = (token, data, ma) => {
    let url = `${HOST}/customer/ma/` + ma
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.put(url, data, { headers })
}
export const DeleteCustomer = (token, id) => {
    let url = `${HOST}/customer/ma/` + id;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.delete(url, { headers })
}
