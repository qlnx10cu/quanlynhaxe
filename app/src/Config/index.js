// export const HOST = "http://115.75.89.137:8080";
const url = window.location.protocol + "//" + window.location.hostname + ":8080";
export const HOST = window.host_url || (process.env.NODE_ENV == "production" ? url : "http://127.0.0.1:8080");
export const HOST_SHEME = "trungtrang://trungtrang.myddns.me";
