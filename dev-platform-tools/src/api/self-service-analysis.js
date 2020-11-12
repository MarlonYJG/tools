/*
 * @Author: Marlon
 * @Date: 2020-04-26 14:51:52
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-02 14:03:18
 * @Description: 数据开发-自助智能分析
 */
import service from 'utils/request'
import API from './public'

const BaseUrl = '/di'
const BaseUrl_data_manage = '/dsm'
// const BaseUrl_data_set_type = '/dsm'

export default {
    ...API,
     // 获取公钥
     __publicKey(data) {
        return service({
            url: BaseUrl + '/login/getPublicKey',
            method: 'post',
            data
        })
    },
    // 获取 数据源列表
    _publicSourceData(data) {
        return service({
            url: BaseUrl_data_manage + '/ds/list',
            method: 'get',
            data
        })
    },
    // 数据集分类  树
    _publicDataSetTree(data) {
        return service({
            url: BaseUrl + '/dataSetType/getDataSetTypeTree',
            method: 'get',
            data
        })
    },
    // 字典表列表
    _publicDicList(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/tablePage',
            method: 'get',
            data
        })
    },

    // 字典表字段
    _publicDicFields(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/dictColumns',
            method: 'get',
            data
        })
    },

    // 字典表
    _publicDic(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/dictData',
            method: 'get',
            data
        })
    },
    /* ************ 风景线 *************** */
    // 数据源 -数据源列表
    dataSourceList(data) {
        return service({
            url: BaseUrl + '/dataSource/search',
            method: 'get',
            data
        })
    },
    // 数据源 -数据源 保存
    dataSourceSave(data) {
        return service({
            url: BaseUrl + '/dataSource/save',
            method: 'post',
            data
        })
    },
    // 数据源 -数据源 编辑
    dataSourceUpdate(data) {
        return service({
            url: BaseUrl + '/dataSource/update',
            method: 'post',
            data
        })
    },
    // 数据源 -数据源 删除
    dataSourceDel(data) {
        return service({
            url: BaseUrl + '/dataSource/delete',
            method: 'get',
            data
        })
    },
    // 数据源 -表 获取
    dataSourceTableList(data) {
        return service({
            url: BaseUrl + '/dataSource/search/tablePage',
            method: 'get',
            data
        })
    },
    // 数据源 -表 详情
    dataSourceTableDetail(data) {
        return service({
            url: BaseUrl + '/dataSource/search/tableDetails',
            method: 'get',
            data
        })
    },
    // 数据源 -表(sql) 创建数据集
    dataSourceTableSetDataSet(data) {
        return service({
            url: BaseUrl + '/dataSet/save',
            method: 'post',
            data
        })
    },
    // 数据源 -表 即席查询SQL 执行
    dataSourceSQLRun(data) {
        return service({
            url: BaseUrl + '/dataSource/execution',
            method: 'post',
            data
        })
    },
    // 数据源 -表 即席查询SQL 保存
    dataSourceSQLSave(data) {
        return service({
            url: BaseUrl + '/dataSet/update',
            method: 'post',
            data
        })
    },
    // 数据源 -表 即席查询SQL 创建数据集(历史记录)
    dataSourceSQLHistory(data) {
        return service({
            url: BaseUrl + '/dataSource/search/executionHistory',
            method: 'post',
            data
        })
    },
    /* 数据集 */
    // 数据集分类 保存
    dataSetTypeSave(data) {
        return service({
            url: BaseUrl + '/dataSetType/save',
            method: 'post',
            data
        })
    },
    // 数据集分类 修改
    dataSetTypeUpdate(data) {
        return service({
            url: BaseUrl + '/dataSetType/update',
            method: 'post',
            data
        })
    },
    // 数据集分类 删除
    dataSetTypeDel(data) {
        return service({
            url: BaseUrl + '/dataSetType/delete',
            method: 'get',
            data
        })
    },
    // 数据集 列表
    dataSetList(data) {
        return service({
            url: BaseUrl + '/dataSet/search/dataSetPage',
            method: 'post',
            data
        })
    },
    // 数据集 属性
    dataSetAttr(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/save',
            method: 'post',
            data
        })
    },
    // 数据集 移动
    dataSetMove(data) {
        return service({
            url: BaseUrl + '/dataSet/move',
            method: 'post',
            data
        })
    },
    // 数据集 缓存设置
    dataSetCatch() {
        // TODO
    },
    // 数据集 清除缓存
    dataSetClearCatch() {
        // TODO
    },
    // 数据集 数据同步
    dataSetDataSync() {
        // TODO
    },
    // 数据集 删除
    dataSetDel(data) {
        return service({
            url: BaseUrl + '/dataSet/delete',
            method: 'get',
            data
        })
    },
    // 数据集修改 字段
    dataSetUpdateFieldsList(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/columns',
            method: 'get',
            data
        })
    },
    // 数据集修改 表
    dataSetUpdateTable(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/tableFilteringDict',
            method: 'get',
            data
        })
    },
    // 数据集修改 批量保存 
    dataSetUpdateAddFields(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/save',
            method: 'post',
            data
        })
    },

    // 数据集修改 维度、度量
    dataSetUpdateDimension(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/dimensionOrMeasure',
            method: 'post',
            data
        })
    },
    // 数据集修改 另存为
    dataSetUpdateSaveAs(data) {
        return service({
            url: BaseUrl + '/dataSet/copy',
            method: 'post',
            data
        })
    },
    // 数据集修改 获取
    dataSetUpdateList(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/search/preview',
            method: 'get',
            data
        })
    },
    // 数据集修改 字段类型
    dataSetUpdateFieldType(data) {
        return service({
            url: BaseUrl + '/dataSetDetail/columnTypeList',
            method: 'post',
            data
        })
    },
    // 数据集修改 算法树
    dataSetUpdateFnTree(data) {
        return service({
            url: BaseUrl + '/function/list',
            method: 'post',
            data
        })
    }


}