/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:43:39
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 16:05:43
 * @Description: getters
 */
import state from "./state";

// 系统列表
export const systemList = state => state.systemList;
// 菜单列表
export const menuList = state => state.menuList;
// 面包屑
export const breadcrumbList = state => state.breadcrumbList;
// 用户信息
export const userInfo = state => {
    if (sessionStorage.getItem("userInfo")) {
        return JSON.parse(sessionStorage.getItem("userInfo"))
    } else {
        return null
    }
} //state.userInfo;
