/*
 * @Author: Marlon
 * @Date: 2020-11-03 14:57:23
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:45:42
 * @Description: 标道-API
 */
import API from './bd/public'
import bxSearch from './bd/bx-search'
import indexPersonal from './bd/index-personal'
import myCollection from './bd/index-personal/my-collection'
import myInformation from './bd/index-personal/my-information'

// import service from 'utils/request'
// const BaseUrl = '/bd'
export default {
    ...API,
    ...bxSearch,
    ...indexPersonal,
    ...myCollection,
    ...myInformation
     // TODO
    //  DSMCList(data) {
    //     return service({
    //         url: BaseUrl + '/ds/page',
    //         method: 'get',
    //         data
    //     })
    // },
    
}