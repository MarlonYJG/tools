/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:43:39
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 14:32:01
 * @Description: getters
 */

// 系统列表
export const systemList = state => state.systemList;
// 菜单列表
export const menuList = state => state.menuList;
// 面包屑
export const breadcrumbList = state => state.breadcrumbList;
// 用户信息
export const userInfo = state => {
    return state.userInfo;
}
// 顶部激活的菜单
export const activeHeader = state => {
    return state.activeIndex;
}

export const dialogVisible_ter = state => state.dy_dialogInfo.dialogVisible; // 订阅-弹框控制
export const dialogTitle_ter = state => state.dy_dialogInfo.dialogTitle; // 订阅-弹框header信息
export const ruleForm_ter = state => state.dy_dialogInfo.ruleForm; // 订阅-弹框信息

export const optionsCity = state => state.optionsCity; // 所在省市
export const citiesIntypeArr = state => state.citiesIntypeArr; // 行业类型
export const citiesNoticeArr = state => state.citiesNoticeArr; // 公告类型
export const searchRangeArr = state => state.searchRangeArr; // 搜索类型
export const timeTypeArr = state => state.timeTypeArr; // 时间范围