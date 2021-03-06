/*
 * @Author: 赵鹏鹏
 * @Date: 2020-11-12 09:55:52
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-11-13 12:27:27
 * @Description: 我的订阅
 */
import service from 'utils/request';
const BaseUrl = '/bd';

export default {
  // 获取订阅组列表、判断有误订阅
  getSubscribeGroup(data) {
    return service({
      url: BaseUrl + '/subscribeGroup/getSubscribeGroup',
      method: 'get',
      data
    })
  },
  // 获取地域划分树形结构-省市结合
  getGeographicalDivisionTree(data) {
    return service({
      url: BaseUrl + '/dictGeographicalDivision/getGeographicalDivisionTree',
      method: 'get',
      data
    })
  },
  // 添加订阅信息
  subscribeGroupAdd(data) {
    return service({
      url: BaseUrl + '/subscribeGroup/add',
      method: 'post',
      data
    })
  },
  // 删除订阅信息
  subscribeGroupDelete(data) {
    return service({
      url: BaseUrl + '/subscribeGroup/delete',
      method: 'get',
      data
    })
  },
  // 获取订阅组条件数据
  subscribeGetSubscribe(data) {
    return service({
      url: BaseUrl + '/subscribe/getSubscribe',
      method: 'get',
      data
    })
  },
}