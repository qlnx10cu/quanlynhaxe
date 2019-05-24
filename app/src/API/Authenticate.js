import {HOST} from '../Config'
import axios from 'axios'

export const Login = (username, password) => {
    let url = `${HOST}/account/login`
    let data = {
        Username: username,
        Password: password
    }
    return axios.post(url,data)
}
export const GetInfo = (token,username) => {
    let url = `${HOST}/employee/username/`+username;
    let headers = {
        'Authorization': 'Bearer ' + token
    }
    return axios.get(url,{headers})
}