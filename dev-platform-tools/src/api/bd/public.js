/*
 * @Author: Marlon
 * @Date: 2020-11-03 10:08:25
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 16:22:43
 * @Description: 公共接口——系统级别
 */

import service from 'utils/request'
import system from '@/config/system.config.js'

const { NODE_ENV, PROJECTKEY, } = system
let MenuUrl = '';
let SystemUrl = './../../static/menu/index-bd.json';
let BaseLogin = ''

if (!NODE_ENV) {
    MenuUrl = `./../../static/menu/${PROJECTKEY}.json`;
}

let BaseUrl_login = '/bd'

// 菜单数据处理
const loop = (arr) => {
    if (arr && arr.length) {
        arr.forEach((item) => {
            item["index"] = item.resCode;
            item["icon"] = item.icon || item.iconCssClass || "";
            item["title"] = item.resName;
            item["url"] = item.resUrl;
            if (!NODE_ENV) {
                if (item.resUrlPrefix) {
                    if (item.resUrl.indexOf("#") !== -1) {
                        item["url"] = item.resUrl; // 系统级菜单地址
                    } else {
                        item["url"] = "/" + item.resUrl.split("//")[1];
                    }
                } else {
                    item["url"] = item.resUrl;
                }
            } else {
                if (item.resUrlPrefix) {
                    if (item.resUrlPrefix === location.pathname) {
                        if (item.resUrl.indexOf("#") !== -1) {
                            item["url"] = item.resUrl; // 系统级菜单地址
                        } else {
                            item["url"] = "/" + item.resUrl.split("//")[1];
                        }
                    } else {
                        if (item.resUrl.indexOf("#") !== -1) {
                            item["url"] = item.resUrl; // 系统级菜单地址
                        } else {
                            item["url"] =
                                item.resUrlPrefix + "#/" + item.resUrl.split("//")[1];
                        }
                    }
                } else {
                    item["url"] = item.resUrl;
                }
            }

            if (item.children) {
                loop(item.children);
            }
        });
    }
}

export default {
    // 获取验证码
    __sendSms(data) {
        return service({
            url: BaseUrl_login + '/sendSms',
            method: 'get',
            data
        })
    },
    // 登录
    __login(data) {
        return service({
            url: BaseUrl_login + '/login' + `?username=${data.username}&smsCode=${data.smsCode}`,
            method: 'post',
            isformContentType: 'application/x-www-form-urlencoded'
        })
    },
    // 注销
    __publicLogout(data) {
        return service({
            url: BaseUrl_login + '/logout',
            method: 'get',
        })
    },
    // 获取菜单
    __publicUserInfo(data) {
        return service({
            url: BaseUrl_login + '/user/info',
            method: 'get',
            data
        })
    },
    // 系统导航
    __publicGetStytemList(data) {
        if (NODE_ENV) {
            let systemList = []
            if (sessionStorage.getItem('userInfo')) {
                let { menus: { children } } = JSON.parse(sessionStorage.getItem('userInfo'))
                if (children[0].children && children[0].children.length) {
                    children[0].children.forEach(item => {
                        systemList.push({
                            system: item.resCode || "",
                            icon: item.icon || item.iconCssClass || "",
                            title: item.resName || item.moduleName,
                            url: item.resUrl || "",
                        })
                    });
                }
            }
            return new Promise((resolve, reject) => {
                return resolve({
                    data: {
                        stytemList: systemList
                    }
                })
            })
        } else {
            return service({
                url: SystemUrl,
                method: 'get',
                data
            })
        }
    },
    // 系统对应的菜单列表
    __publicGetMenuList(data) {
        if (NODE_ENV) {
            let systemList = [];
            let menuList = [];

            if (sessionStorage.getItem('userInfo')) {
                let { menus: { children = [] } } = JSON.parse(sessionStorage.getItem('userInfo'))
                systemList = children[0].children
            }
            // 获取系统对应的菜单
            systemList.forEach((systemItem) => {
                if (PROJECTKEY === systemItem.resCode) {
                    menuList = systemItem.children;
                }
            });
            loop(menuList)
            return new Promise((resolve, reject) => {
                return resolve({
                    data: {
                        defaultActive: '/',
                        subMenu: menuList
                    }
                })
            })
        } else {
            return service({
                url: MenuUrl,
                method: 'get',
                data
            })
        }
    },
    // 导出 POST 方式
    __publicDownLoadExcel({ url, params }) {
        return service({
            url,
            method: 'post',
            data: params,
            responseType: 'blob'
        })
    },
    // 导出 GET 方式
    __publicDownLoadExcelGet({ url, data }) {
        return service({
            url,
            method: 'get',
            data
        })
    }
}