/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:42:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-12 15:14:20
 * @Description: actions
 */
import { Message } from "element-gui";
import * as types from "./mutation-types";
import API from "api";
import system from '@/config/system.config.js'
import { setToken, Session } from "utils/lib";

const { BASEURL, LOGIN_PAGE_NAME } = system


// 系统列表
export const getSystemList = ({ commit }, val) => {
    API.__publicGetStytemList().then(res => {
        let resVal = []
        if (res && res.data && res.data.stytemList) {
            // 获取系统地址
            function loop(arr) {
                arr.forEach(item => {
                    item['icon'] = item.icon || item.iconCssClass || ''
                    if (item.url && item.url.toString().indexOf('/') !== -1) {
                        item.url = BASEURL + item.url
                    }
                    if (item.children && item.children.length) {
                        loop(item.children)
                    }
                });
            }
            loop(res.data.stytemList)
            resVal = res.data.stytemList;
        }
        commit(types.GET_SYSTEM_LIST, resVal)
    })
}
// 菜单列表
export const getMenuList = ({ commit }, val) => {
    API.__publicGetMenuList().then(res => {
        let resVal = []
        if (res && res.data && res.data.subMenu) {
            resVal = res.data;
        }
        commit(types.GET_MENU_LIST, resVal)
    })
}
// 面包屑
export const getBreadcrumbList = ({ commit }, val) => {
    commit(types.SET_BREADCRUMB_LIST, val)
}

// 获取用户信息
export const getUserInfo = ({ commit }) => {
    return new Promise((resolve, reject) => {
        API.__publicUserInfo().then(res => {
            if (res.data.code == 0) {
                let userId = res.data.userId || ''
                let userRes = res.data || null
                if (userId) {
                    setToken(userId)
                    commit(types.GET_USER_INFO, userRes)
                } else {
                    setToken('')
                }
            } else {
                setToken('')
            }
            resolve(res.data || null)
        }).catch(err => {
            setToken('')
            reject(err)
        })
    })
}

