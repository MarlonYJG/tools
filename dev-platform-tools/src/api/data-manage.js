/*
 * @Author: Marlon
 * @Date: 2020-02-21 14:16:49
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-02 14:02:16
 * @Description: 数据管理
 */
import service from 'utils/request'

import API from './public'

/* 数据源列表 */
const BaseUrl = '/dsm'
const BaseUrl_di = '/di'

export default {
    ...API,
      // 获取公钥
      __publicKey(data) {
        return service({
            url: BaseUrl_di + '/login/getPublicKey',
            method: 'post',
            data
        })
    },
    // 数据库列表
    _PublicDataBaseList(data) {
        return service({
            url: BaseUrl + '/dict',
            method: 'get',
            data
        })
    },
    /* ******************************* */
    // 获取数据源列表
    DSMCList(data) {
        return service({
            url: BaseUrl + '/ds/page',
            method: 'get',
            data
        })
    },
    // 新增数据源
    DSMCAdd(data) {
        return service({
            url: BaseUrl + '/ds',
            method: 'post',
            data
        })
    },
    // 删除数据源
    DSMCDel(data) {
        let id = data.id || ''
        return service({
            url: BaseUrl + '/ds' + `?id=${id}`,
            method: 'DELETE',
        })
    },
    // 更新
    DSMCUpdate(data) {
        return service({
            url: BaseUrl + '/ds',
            method: 'put',
            data
        })
    },
    // 连接测试
    JoinText(data){
        return service({
            url: BaseUrl + '/ds/test',
            method: 'post',
            data
        })
    }
}