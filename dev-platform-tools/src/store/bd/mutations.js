/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:40:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 11:18:31
 * @Description: 
 */
import * as types from "./mutation-types";

const mutations = {
    // 弹框显示
    [types.DY_OPRN_DIALOG](state, payload) {
        state.dy_dialogInfo.dialogVisible = payload.type;
        if (payload.title) {
            state.dy_dialogInfo.dialogTitle = payload.title;
        }
        if (payload.isReset) {
            state.dy_dialogInfo.ruleForm = state.cloneRuleForm;
        }
    },
    // 弹框信息
    [types.DY_DIALOG_RULEFORM](state, payload) {
        state.dy_dialogInfo.ruleForm = payload;
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