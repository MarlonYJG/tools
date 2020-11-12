/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:42:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-03-18 11:13:26
 * @Description: actions
 */
import * as types from "./mutation-types";
import api from "api";

// export const getSystemList = ({ commit }, val) => {
//     api.__publicGetStytemList().then(res => {
//         let resVal = []
//         if (res && res.data && res.data.stytemList) {
//             resVal = res.data.stytemList;
//         }
//         commit(types.GET_SYSTEM_LIST, resVal)
//     })
// }