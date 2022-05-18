/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:40:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 16:00:58
 * @Description: 
 */
import * as types from "./mutation-types";
import system from "@/config/system.config.js";

const { WEB_SESSION } = system;

const mutations = {
    [types.ACTIVE_HEADER](state, val) {
        // 数据处理
        let activeIndex = val.activeHeader.split('#')[1]
        state.activeIndex = activeIndex;
    },
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
        sessionStorage.setItem(WEB_SESSION, JSON.stringify(val))
        state.userInfo = val
    },
    // 拓扑图-工具
    [types.TOPOLOGY_DATA](state, val) {
        state.data = val
    },


    // 弹框显示
    [types.DY_OPRN_DIALOG](state, payload) {
        state.dy_dialogInfo.dialogVisible = payload.type;
        if (payload.title) {
            state.dy_dialogInfo.dialogTitle = payload.title;
        }
        if (payload.isReset) {
            let cloneRuleForm = {
                dyName: "", // 订阅名称
                importWord: [], // 关键词
                importWord1: "",
                importWord2: "",
                importWord3: "",
                importWord4: "",
                importWord5: "",
                importWord6: "",
                cityAll: [], // 所在省市
                industryType: [], // 行业类型
                noticeType: [], // 公告类型
                searchRange: "1" // 搜索范围 默认1 全文 2 标题
            };
            state.dy_dialogInfo.ruleForm = cloneRuleForm;
        }
    },
    // 弹框信息
    [types.DY_DIALOG_RULEFORM](state, payload) {
        state.dy_dialogInfo.ruleForm = Object.assign(state.dy_dialogInfo.ruleForm, payload);
    },
    // 所在省市
    [types.PROVINCE_CITY_LIST](state, payload) {
        state.optionsCity = payload;
    },
    // 行业类型
    [types.INSTRIESLIST](state, payload) {
        state.citiesIntypeArr = payload;
    },
    // 公告类型
    [types.ANNOUNCEMENTYPELIST](state, payload) {
        state.citiesNoticeArr = payload;
    },
    // 搜索类型
    [types.SEARCHSCOPELIST](state, payload) {
        state.searchRangeArr = payload;
    },
    // 时间范围
    [types.TIME_TIME](state, payload) {
        state.timeTypeArr = payload;
    }
}
export default mutations;