export const TYPE_SERVER = window.location.hostname.includes("bk.trungtrang.com") ? 1 : 0;
const port = TYPE_SERVER == 1 ? "8081" : "8080";
const url = window.location.protocol + "//" + window.location.hostname + ":" + port;
export const HOST = window.host_url || (process.env.NODE_ENV == "production" ? url : "http://127.0.0.1:" + port);
export const HOST_SHEME = "trungtrang://trungtrang.myddns.me";
export const DIA_CHI =
    TYPE_SERVER == 1
        ? "613A/31 Trần Hưng Đạo, phường Mỹ Xuyên, TP Long Xuyên, An Giang"
        : "613A/31 Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang";
