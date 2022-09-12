import {HOST} from '../Config'
import axios from 'axios'

export const GetBillTheoNgay = (token,start, end) => {
    let url = `${HOST}/statistic/bill?end=${end}&start=${start}&trangthai=1`;
    let headers = {
    }
    return axios.get(url,{headers})
}