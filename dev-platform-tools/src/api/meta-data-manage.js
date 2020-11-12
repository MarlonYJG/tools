/*
 * @Author: Marlon
 * @Date: 2020-02-21 14:17:26
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 10:26:48
 * @Description: 元数据管理
 */
import service from 'utils/request'
import API from './public'
// 项目统计
export const BaseUrl = '/md'
const BaseUrl_data_manage = '/dsm'
const BaseUrl_1 = '/ds'
export default {
    ...API,
    // 项目/数据库/表-树形结构
    _publicTree(data) {
        return service({
            url: BaseUrl + '/project/tree',
            method: 'post',
            data
        })
    },
    // 获取数据库列表
    _publicDataBase(data) {
        return service({
            url: BaseUrl + '/database/simpleList',
            method: 'post',
            data
        })
    },
    // 获取数据表列表
    _publicDataTable(data) {
        return service({
            url: BaseUrl + '/table/simpleList',
            method: 'post',
            data
        })
    },
    // 获取字段列表
    _publicColumn(data) {
        return service({
            url: BaseUrl + '/column/columnNameList',
            method: 'post',
            data
        })
    },
    _publicDictionary(data) {
        return service({
            url: BaseUrl + '/dictionary/simpleList',
            method: 'post',
            data
        })
    },
    // 粒度类型列表
    _publicLevelTypeList(data) {
        return service({
            url: BaseUrl + '/modifyHistory/levelTypeList',
            method: 'post',
            data
        })
    },
    // 关联关系类型列表
    _publicRelationTypeList(data) {
        return service({
            url: BaseUrl + '/tableRelation/typeList',
            method: 'post',
            data
        })
    },
    // 字段类型列表
    _publicColumnTypeList(data) {
        return service({
            url: BaseUrl + '/column/columnTypeList',
            method: 'post',
            data
        })
    },
    // 获取数据源列表
    _publicDataSourceList(data) {
        return service({
            url: BaseUrl_data_manage + '/ds/list',
            method: 'get',
            data
        })
    },
    // 获取数据标准列表
    _publicDataStandardList(data) {
        return service({
            url: BaseUrl_1 + '/datafixed/list/search',
            method: 'get',
            data
        })
    },
    /* ====================风景线======================= */
    /* 总览 */
    POverview(data) {
        return service({
            url: BaseUrl + '/project/overview',
            method: 'post',
            data
        })
    },
    /* 项目统计 */
    PList(data) {
        return service({
            url: BaseUrl + '/project/list',
            method: 'post',
            data
        })
    },
    PDel(data) {
        return service({
            url: BaseUrl + '/project/delete',
            method: 'post',
            data
        })
    },
    PAdd(data) {
        return service({
            url: BaseUrl + '/project/add',
            method: 'post',
            data
        })
    },
    PUpdate(data) {
        return service({
            url: BaseUrl + '/project/update',
            method: 'post',
            data
        })
    },
    PCopy(data) {
        return service({
            url: BaseUrl + '/project/copy',
            method: 'post',
            data
        })
    },
    /* 库管理 */
    DList(data) {
        return service({
            url: BaseUrl + '/database/list',
            method: 'post',
            data
        })
    },
    DDel(data) {
        return service({
            url: BaseUrl + '/database/delete',
            method: 'post',
            data
        })
    },
    DAdd(data) {
        return service({
            url: BaseUrl + '/database/add',
            method: 'post',
            data
        })
    },
    DUpdate(data) {
        return service({
            url: BaseUrl + '/database/update',
            method: 'post',
            data
        })
    },
    DCopy(data) {
        return service({
            url: BaseUrl + '/database/copy',
            method: 'post',
            data
        })
    },
    // 比较
    DExport(data) {
        return service({
            url: BaseUrl + '/export/exportDbDifference',
            method: 'get',
            data
        })
    },
    /* 表管理 */
    TList(data) {
        return service({
            url: BaseUrl + '/table/list',
            method: 'post',
            data
        })
    },
    TDel(data) {
        return service({
            url: BaseUrl + '/table/delete',
            method: 'post',
            data
        })
    },
    TAdd(data) {
        return service({
            url: BaseUrl + '/table/add',
            method: 'post',
            data
        })
    },
    TUpdate(data) {
        return service({
            url: BaseUrl + '/table/update',
            method: 'post',
            data
        })
    },
    TCopy(data) {
        return service({
            url: BaseUrl + '/table/copy',
            method: 'post',
            data
        })
    },
    /* 字段 */
    CList(data) {
        return service({
            url: BaseUrl + '/column/list',
            method: 'post',
            data
        })
    },
    CAdd(data) {
        return service({
            url: BaseUrl + '/column/add',
            method: 'post',
            data
        })
    },
    CDel(data) {
        return service({
            url: BaseUrl + '/column/delete',
            method: 'post',
            data
        })
    },
    CUpdate(data) {
        return service({
            url: BaseUrl + '/column/update',
            method: 'post',
            data
        })
    },
    /* 索引 */
    IList(data) {
        return service({
            url: BaseUrl + '/index/list',
            method: 'post',
            data
        })
    },
    IAdd(data) {
        return service({
            url: BaseUrl + '/index/add',
            method: 'post',
            data
        })
    },
    IDel(data) {
        return service({
            url: BaseUrl + '/index/delete',
            method: 'post',
            data
        })
    },
    IUpdate(data) {
        return service({
            url: BaseUrl + '/index/update',
            method: 'post',
            data
        })
    },
    /* 关联关系 */
    RelationList(data) {
        return service({
            url: BaseUrl + '/tableRelation/list',
            method: 'post',
            data
        })
    },
    RelationAdd(data) {
        return service({
            url: BaseUrl + '/tableRelation/add',
            method: 'post',
            data
        })
    },
    RelationDel(data) {
        return service({
            url: BaseUrl + '/tableRelation/delete',
            method: 'post',
            data
        })
    },
    RelationUpdate(data) {
        return service({
            url: BaseUrl + '/tableRelation/update',
            method: 'post',
            data
        })
    },
    /* 字典 */
    DictionaryList(data) {
        return service({
            url: BaseUrl + '/dictionary/list',
            method: 'post',
            data
        })
    },
    DictionaryAdd(data) {
        return service({
            url: BaseUrl + '/dictionary/add',
            method: 'post',
            data
        })
    },
    DictionaryDel(data) {
        return service({
            url: BaseUrl + '/dictionary/delete',
            method: 'post',
            data
        })
    },
    DictionaryUpdate(data) {
        return service({
            url: BaseUrl + '/dictionary/update',
            method: 'post',
            data
        })
    },
    DictionaryValPreview(data) {
        return service({
            url: BaseUrl + '/dictionaryVal/preview',
            method: 'post',
            data
        })
    },
    DictionaryValList(data) {
        return service({
            url: BaseUrl + '/dictionaryVal/list',
            method: 'post',
            data
        })
    },
    DictionaryValAdd(data) {
        return service({
            url: BaseUrl + '/dictionaryVal/add',
            method: 'post',
            data
        })
    },
    DictionaryValDel(data) {
        return service({
            url: BaseUrl + '/dictionaryVal/delete',
            method: 'post',
            data
        })
    },
    DictionaryValUpdate(data) {
        return service({
            url: BaseUrl + '/dictionaryVal/update',
            method: 'post',
            data
        })
    },
    /* 日志 */
    getHistoryList(data) {
        return service({
            url: BaseUrl + '/modifyHistory/list',
            method: 'post',
            data
        })
    },
    /* 库管理 */
    // 导入数据标准
    exportDataStandard(data) {
        return service({
            url: BaseUrl + '/database/importFromDataStandard',
            method: 'post',
            data
        })
    },
    // 导入数据库结构
    exportDataBase(data) {
        return service({
            url: BaseUrl + '/database/importFromDataSource',
            method: 'post',
            data
        })
    },
    /* 元数据应用 */
    // 数据库结构同步
    dbList(data) {
        return service({
            url: BaseUrl + '/db-sync-info/syncList',
            method: 'post',
            data
        })
    },
    // 设置数据源
    dbSetSource(data) {
        return service({
            url: BaseUrl + '/db-sync-info/setDataSource',
            method: 'post',
            data
        })
    },
    // 生成建库SQL
    dbCreateSql(data) {
        return service({
            url: BaseUrl + '/db-sync-info/generateCreateTableSql',
            method: 'post',
            data
        })
    },
    // 同步建库SQL
    dbSyncSql(data) {
        return service({
            url: BaseUrl + '/db-sync-info/executeCreateTableSql',
            method: 'post',
            data
        })
    },
    // 导出建表SQL
    dbExportCreate(data) {
        return service({
            url: BaseUrl + '/export/exportCreateTableSql',
            method: 'get',
            data
        })
    },
    // 生成差异SQL
    dbCreateDifferenceSql(data) {
        return service({
            url: BaseUrl + '/db-sync-info/generateDifferenceSql',
            method: 'post',
            data
        })
    },
    // 同步差异SQL
    dbSyncDifferenceSql(data) {
        return service({
            url: BaseUrl + '/db-sync-info/executeDifferenceSql',
            method: 'post',
            data
        })
    },
    // 导出差异SQL
    dbExportDifference(data) {
        return service({
            url: BaseUrl + '/export/exportDifferenceSql',
            method: 'get',
            data
        })
    },
    // 差异对比
    dbDifferenceComparison(data) {
        return service({
            url: BaseUrl + '/db-sync-info/getDifferenceResult',
            method: 'post',
            data
        })
    },
    // 同步字典表
    dbSyncDictionValue(data) {
        return service({
            url: BaseUrl + '/db-sync-info/syncDictionValue',
            method: 'post',
            data
        })
    },
    // 维护日志
    dbLog(data) {
        return service({
            url: BaseUrl + '/db-sync-info/dbLogList',
            method: 'post',
            data
        })
    },
    // 数据标准匹配
    dsMappingList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dsMappingList',
            method: 'post',
            data
        })
    },
    // 数据集属性匹配
    dcAttrMappingList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcAttrMappingList',
            method: 'post',
            data
        })
    },
    // 选择数据标准
    invokeDsMapping(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/invokeDsMapping',
            method: 'post',
            data
        })
    },
    // 数据集匹配
    dcMappingList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcMappingList',
            method: 'post',
            data
        })
    },
    // 数据集匹配类型列表
    dcMappingTypeList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcMappingTypeList',
            method: 'post',
            data
        })
    },
    // 数据集属性匹配类型列表
    dcAttrMappingTypeList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcAttrMappingTypeList',
            method: 'post',
            data
        })
    },
    // 数据集列表
    dcList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcList',
            method: 'post',
            data
        })
    },
    // 更新数据集
    setDcReMapping(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcReMapping',
            method: 'post',
            data
        })
    },
    // 数据标准列表
    dcAttrList(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcAttrList',
            method: 'post',
            data
        })
    },
    setDcAttrReMapping(data) {
        return service({
            url: BaseUrl + '/ds-mapping-info/dcAttrReMapping',
            method: 'post',
            data
        })
    }

}