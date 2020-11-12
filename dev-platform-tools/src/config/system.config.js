/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:08:14
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:35:34
 * @Description: 系统级配置
 */
import PRODUCTCONFIG from './product'

let PLATFORM = PRODUCTCONFIG.PLATFORM;
let PROJECTKEY = PRODUCTCONFIG.PROJECTKEY;

// 环境参数
let NODE_ENV = false;
let BASEURL = '';

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "testing" || process.env.NODE_ENV === "local") {
    NODE_ENV = true
    PROJECTKEY = process.env.Project_key.replace(/\"/g, '')
    PLATFORM = process.env.PLATFORM_NAME.replace(/\"/g, '')
}

// API配置
if (process.env.NODE_ENV === 'development') {
    // 开发环境走代理
} else if (process.env.NODE_ENV === 'testing') {
    BASEURL = PRODUCTCONFIG.BASEURL_testing;
} else if (process.env.NODE_ENV === 'local') {
    BASEURL = PRODUCTCONFIG.BASEURL_local;
} else if (process.env.NODE_ENV === 'production') {
    // 各系统采用不同的服务地址时启动该方案
    // PROJECTKEY = process.env.Project_key.replace(/\"/g, '')
    BASEURL = '';
}



export default {
    PLATFORM,
    PROJECTKEY,
    NODE_ENV,
    BASEURL,
    TOKEN_KEY: 'token',
    LOGIN_PAGE_NAME: 'login',
    WEB_SESSION: 'userInfo',
    PUBLIC_PAGE: ['/login', '/401', '/500', '/error_404'],
    PLATFORM_LOGIN: ['GST'],// 产品登录类型(默认为不包含登录页)
}
