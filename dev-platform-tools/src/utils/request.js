/*
 * @Author: Marlon
 * @Date: 2020-02-21 15:15:54
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 10:09:42
 * @Description:  HTTP 监控台
 */
import axios from "axios";
import qs from "qs";
import { openUrl } from "utils/jump";
// import {
//   getStore
// } from '@/utils/store'
import { Notification } from "element-gui";
import SystemConf from '@/config/system.config.js'
import { setToken } from 'utils/lib'

let service = axios.create({
  baseURL: SystemConf.BASEURL,
});

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
  if (config.method.toLowerCase() === 'get') {
    config.params = {
      ...config.data
    }
  } else if (config.isformContentType) {  // 扩展处理Form Data
    config.data = qs.stringify({
      ...config.data
    })
  } else {// application/json;charset=UTF-8
    config.data = {
      ...config.data
    }

  }
  return config;
}, error => {
  Promise.reject(error)
});

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(response => { return response },
  error => {
    const { response } = error;
    if (401 == response.status) {
      window.location.replace(location.origin)
      setToken('')
    } else {
      Notification({
        showClose: true,
        type: 'error',
        title: '服务异常',
        message: `<div>
                    <strong>状态码：<i style="color: #f34848;">${response.status}</i></strong>
                  </div>
                  <div>
                    <strong>提示信息：<i style="color: #f34848;">${response.statusText}</i></strong>
                  </div>`,
        duration: 4500,
        dangerouslyUseHTMLString: true,
      })
    }
    return Promise.reject(error)
  }
);

export default service;
