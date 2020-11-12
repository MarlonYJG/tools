/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-17 21:54:13
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-05-27 11:15:26
 * @Description: 指标中心-Getters
 */
const getters = {
  getAreaListCenter(state) {
    return state.area_listCenter;
  },
  plateListCenter(state) {
    return state.plate_listCenter;
  },
  filedListCenter(state) {
    return state.field_listCenter;
  },
  dataManyListCenter(state) {
    return state.datamany_listCenter;
  }
}

export default getters;
