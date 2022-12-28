/*
 * @Author: Marlon
 * @Date: 2020-02-21 15:15:54
 * @LastEditors: Marlon
 * @Description:  HTTP 监控台
 */

import axios from "axios";
import qs from "qs";

let service = axios.create();


/****** request拦截器 ******/
service.interceptors.request.use(config => {
    return config;
}, error => {
    Promise.reject(error)
});


/****** respone拦截器 ******/
service.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error)
    }
);

export default service;
