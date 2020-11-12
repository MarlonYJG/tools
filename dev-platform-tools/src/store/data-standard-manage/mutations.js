/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:40:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-21 09:56:38
 * @Description: 
 */
import * as types from "./mutation-types";

let deleteEmptyChildren = function (originArr) {
    if (Array.isArray(originArr) && originArr.length) {
        for (let i = 0; i < originArr.length; i++) {
            let item = originArr[i];
            if (item.children && !item.children.length) {
                delete item.children;
            } else {
                deleteEmptyChildren(item.children)
            }
        }
        return originArr;
    }
    return [];
}
let deleteEmptyChildrenList = function (originArr) {
    if (Array.isArray(originArr) && originArr.length) {
        for (let i = 0; i < originArr.length; i++) {
            let item = originArr[i];
            item['value'] = item.id;
            if (item.children && !item.children.length) {
                delete item.children;
            } else {
                deleteEmptyChildren(item.children)
            }
        }
        return originArr;
    }
    return [];
}

const mutations = {
    // // 获取系统列表
    // [types.GET_SYSTEM_LIST](state, val) {
    //     state.systemList = val;
    // },
    // 地区字典
    [types.SET_AREA_DIC](state, val) {
        console.log('地区',val)
        let areaDictionary = val.children ? val.children : [];
        let areaDictionaryList = val.children ? val.children : [];
        let list = []
        let list_ = [];
        state.areaDictionary = deleteEmptyChildren(areaDictionary);
        list = deleteEmptyChildrenList(areaDictionaryList)
        function loop(arr, returnArr) {
            if (arr.length) {
                arr.forEach(item => {
                    item['value'] = item.id
                    returnArr.push(item)
                    if (item.children && item.children.length) {
                        loop(item.children, returnArr)
                    }
                });
            }
        }
        loop(list, list_)
        state.areaDictionaryList = list_;
    },
    // 当前选中地区
    [types.SET_ACTIVE_CITY](state, val) {
        state.activeCity = val;
    }
}
export default mutations;