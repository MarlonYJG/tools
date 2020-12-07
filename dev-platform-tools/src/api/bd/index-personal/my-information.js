/*
 * @Author: zhangxd-i
 * @Date: 2020-11-12 14:52:07
 * @LastEditTime: 2020-11-12 14:53:17
 * @LastEditors: zhangxd-i
 * @Description: 
 */
import service from 'utils/request'
const BaseUrl = '/bd'
export default {
  // 个人信息
  individualInfo(data) {
    return service({
      url: BaseUrl + '/user/individualInfo',
      method: 'post',
      data
    })
  },
  // 我的收藏-是否新用户
  getCode(data) {
    return service({
      url: BaseUrl + '/user/getCode',
      method: 'post',
      data
    })
  },
}