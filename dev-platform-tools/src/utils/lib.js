/*
 * @Author: Marlon
 * @Date: 2020-07-10 10:35:47
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 10:02:48
 * @Description: 系统级处理方法
 */
import Cookies from 'js-cookie'
import { JSEncrypt } from 'jsencrypt'

export const TOKEN_KEY = 'token'

/**
 * @name: setToken
 * @param {type} token 值
 * @return: 
 * @description: token在Cookie中存储的天数，默认1天
 */
export const setToken = (token, cookieExpires = 1) => {
    if (token) {
        Cookies.set(TOKEN_KEY, token, { expires: cookieExpires })
    } else {
        Cookies.remove(TOKEN_KEY)
    }
}
/**
 * @name: getToken
 * @param {type} 
 * @return: 
 * @description: 
 */
export const getToken = (tokenKey) => {
    let token = ''
    if (tokenKey) {
        token = Cookies.get(tokenKey)
    } else {
        token = Cookies.get(TOKEN_KEY)
    }
    if (token) return token
    else return false
}
/**
 * @name: encryptedData
 * @param {type} publicKey : 公钥
 * @param {type} data : 要加密的数据
 * @return: 
 * @description: RSA 加密
 */
export const encryptedData = ({ publicKey, data }) => {
    // 新建JSEncrypt对象
    let encryptor = new JSEncrypt();
    // 设置公钥
    encryptor.setPublicKey(publicKey);
    // 加密数据
    return encryptor.encrypt(data);
}
/**
 * @name: setSession
 * @param {type} storeKey : sessionStorage的Key
 * @param {type} storeVal : sessionStorage的Value
 * @return: 
 * @description: sessionStorage操作
 */
export class Session {
    set(storeKey, storeVal) {
        if (storeKey && storeVal) {
            sessionStorage.setItem(storeKey, JSON.stringify(storeVal))
        } else if (storeKey) {
            sessionStorage.removeItem(storeKey)
        } else {
            sessionStorage.clear()
        }
    }
    get(storeKey) {
        if (storeKey) {
            try {
                if (sessionStorage.getItem(storeKey) && Object.keys(JSON.parse(sessionStorage.getItem(storeKey))).length > 0) {
                    return JSON.parse(sessionStorage.getItem(storeKey))
                }
                return null
            } catch (error) {
                console.error('session格式错误(Object)')
                return null
            }

        }
        return null
    }
}

/**
 * @param {*} access 用户权限数组
 * @param {*} route 路由列表
 * @description: 控制是否可进入指定页面
 */
const hasAccess = (access, route) => {
    console.log(access, route, '鉴权')
    for (let index = 0; index < access.length; index++) {
        if (access[index].resCode.indexOf('/') !== -1) {
            let arr_ = access[index].resCode.split('/')
            route.meta.title = access[index].resName;
            let menuKey = arr_[arr_.length - 1]
            if (route.meta.isNotMenu || route.path == menuKey) {
                return true
            }
        }

    }
    return false
}
/**
 * 权鉴
 * @name: 
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @return: 
 * @description: 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
    const routePermissionJudge = (list) => {
        return list.some(item => {
            if (item.children && item.children.length) {
                return routePermissionJudge(item.children)
            } else if (item.name === name) {
                console.log(hasAccess(access, item), '==========')
                return hasAccess(access, item)
            }
        })
    }

    return routePermissionJudge(routes)
}

