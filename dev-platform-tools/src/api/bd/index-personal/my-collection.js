import service from 'utils/request'
const BaseUrl = '/bd'
export default {
  // 我的收藏-table
  getCollectionsTable(data) {
    return service({
      url: BaseUrl + '/user/myCollectionsTable',
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