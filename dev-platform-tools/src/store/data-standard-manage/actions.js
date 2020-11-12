/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:42:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-21 10:04:22
 * @Description: actions
 */
import * as types from "./mutation-types";
import API from "api";

// 获取地区字典
export const getAreaDic = ({ commit }, val) => {
    API.getAreaList().then(data => {
        console.log(data, '地区字典')
        if (data.code === "0" && data.data.type === "tree") {
            let areaData =
                data.data.data && data.data.data.children
                    ? data.data.data.children
                    : [];
            if (areaData.children && areaData.children.length) {
                areaData.children.forEach(item => {
                    item['id'] = Number(item.id)
                });
            }
            commit(types.SET_AREA_DIC, areaData);
        }
    });
}

// export const getSystemList = ({ commit }, val) => {
//     api.__publicGetStytemList().then(res => {
//         let resVal = []
//         if (res && res.data && res.data.stytemList) {
//             resVal = res.data.stytemList;
//         }
//         commit(types.GET_SYSTEM_LIST, resVal)
//     })
// }