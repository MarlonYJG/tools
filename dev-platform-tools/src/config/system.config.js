/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:08:14
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-02 15:56:37
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
    PLATFORM,// 平台名称(小写)
    PROJECTKEY,// 系统名称(小写)
    NODE_ENV,// 环境变量
    BASEURL,// API接口
    TOKEN_KEY: 'token',// 权限验证key
    LOGIN_PAGE_NAME: 'login',// 登录页
    WEB_SESSION: 'userInfo',// 用户信息
    PUBLIC_PAGE: ['/login', '/401', '/500', '/error_404'],// 公共页
    PLATFORM_LOGIN: ['GST'],// 产品登录类型(默认为不包含登录页)
}
