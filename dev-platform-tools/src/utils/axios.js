/*
 * @Author: Marlon
 * @Date: 2020-02-21 14:29:49
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 09:50:01
 * @Description: 封装请求
 */
import axios from 'axios';
axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.transformRequest = function (data) {
//     return data;
// }

export default axios;