import { HOST } from "../Config";
import axios from "axios";

export const GetCuocGoiTheoNgay = (token, start, end) => {
    let url = `${HOST}/historycall/bydate?end=${end}&start=${start}`;
    let headers = {};
    return axios.get(url, { headers });
};
