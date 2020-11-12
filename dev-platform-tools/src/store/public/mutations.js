/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:40:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-29 13:55:15
 * @Description: 
 */
import * as types from "./mutation-types";
import { setToken, Session } from "utils/lib";
import system from "@/config/system.config.js";

const { WEB_SESSION } = system;

const mutations = {
    // 获取系统列表
    [types.GET_SYSTEM_LIST](state, val) {
        state.systemList = val;
    },
    // 获取菜单列表
    [types.GET_MENU_LIST](state, val) {
        state.menuList = val;
    },
    // 设置面包屑
    [types.SET_BREADCRUMB_LIST](state, val) {
        state.breadcrumbList = val
    },
    // 获取用户信息
    [types.GET_USER_INFO](state, val) {
        let webSession = new Session();
        webSession.set(WEB_SESSION, val)
        state.userInfo = val
    },
    // 拓扑图-工具
    [types.TOPOLOGY_DATA](state, val) {
        state.data = val
    }

}
export default mutations;