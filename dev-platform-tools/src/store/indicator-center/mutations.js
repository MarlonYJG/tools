/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-17 21:54:13
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-05-27 11:25:38
 * @Description: 指标中心-Mutations
 */
import * as types from "./mutation-types";

const mutations = {
    // 获取项目列表
    [types.GET_AREA_LIST_CENTER](state, val) {
        state.area_listCenter = val;
    },
    // 获取板块列表
    [types.GET_PLATE_LIST_CENTER](state, val) {
        state.plate_listCenter = val;
    },
    // 获取数据域分类列表
    [types.GET_FILED_LIST_CENTER](state, val) {
        state.field_listCenter = val;
    },
    // 获取数据域列表
    [types.GET_DATAMANY_LIST_CENTER](state, val) {
        state.datamany_listCenter = val;
    }
}

export default mutations;