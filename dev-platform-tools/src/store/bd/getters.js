/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:43:39
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 11:18:50
 * @Description: getters
 */
export const dialogVisible_ter = state => state.dy_dialogInfo.dialogVisible; // 订阅-弹框控制
export const dialogTitle_ter = state => state.dy_dialogInfo.dialogTitle; // 订阅-弹框header信息
export const ruleForm_ter = state => state.dy_dialogInfo.ruleForm; // 订阅-弹框信息

export const optionsCity = state => state.optionsCity; // 所在省市
export const citiesIntypeArr = state => state.citiesIntypeArr; // 行业类型
export const citiesNoticeArr = state => state.citiesNoticeArr; // 公告类型
export const searchRangeArr = state => state.searchRangeArr; // 搜索类型
export const timeTypeArr = state => state.timeTypeArr; // 时间范围