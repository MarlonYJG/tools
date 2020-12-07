import service from 'utils/request'
const BaseUrl = '/bd'
export default {
  // 标讯查询--省
  getProvinceList(data) {
    return service({
      url: BaseUrl + '/dictProvince/getProvinceList',
      method: 'get',
      data
    })
  },
  // 标讯查询--市
  getCityList(data) {
    return service({
      url: BaseUrl + '/dictCity/getCityListByProvinceCode',
      method: 'get',
      data
    })
  },
  // 标讯查询--行业类型
  getInstriesList(data) {
    return service({
      url: BaseUrl + '/dictIndustriesType/getIndustriesTypeList',
      method: 'get',
      data
    })
  },
  // 标讯查询--公告类型
  getAnnouncementTypeList(data) {
    return service({
      url: BaseUrl + '/dictAnnouncementType/getAnnouncementTypeList',
      method: 'get',
      data
    })
  },
  // 标讯查询--时间类型
  getTimeType(data) {
    return service({
      url: BaseUrl + '/dictTimeScope/getTimeScopeList',
      method: 'get',
      data
    })
  },
  // 标讯查询--列表
  getStandardTable(data) {
    return service({
      url: BaseUrl + '/standard/getStandardTable',
      method: 'post',
      data
    })
  },
  // 标讯查询--搜索类型
  getSearchScopeList(data) {
    return service({
      url: BaseUrl + '/dictSearchScope/getSearchScopeList',
      method: 'get',
      data
    })
  },
  // 标讯详情
  getBidDocDetail(data) {
    return service({
      url: BaseUrl + '/bid-doc-info/bidDocDetail',
      method: 'post',
      data
    })
  },
  // 标讯详情--收藏
  actionCollect(data) {
    return service({
      url: BaseUrl + '/bid-doc-info/actionCollect ',
      method: 'post',
      data
    })
  },
}