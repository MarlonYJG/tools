/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-17 21:54:12
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-08 14:18:04
 * @Description: 指标中心
 */
import service from 'utils/request'
import API from './public'


export const BaseUrl_di = '/di'

// 指标构建
export const Business_url = '/constructionservice';
export const Business_detail = '/calculationservice'
export const BaseUrl = '/md';
export default {
    ...API,
    // 获取公钥
    __publicKey(data) {
        return service({
            url: Business_url + '/login/getPublicKey',
            method: 'post',
            data
        })
    },
    // 项目
    _publicProjectList(data) {
        return service({
            url: Business_url + '/business-segment/projectList',
            method: 'post',
            data
        })
    },
    // 业务板块
    _publicBusinessSegments(data) {
        return service({
            url: Business_url + '/business-segment/plainList',
            method: 'post',
            data
        })
    },
    // 数据域
    _publicDataField(data) {
        return service({
            url: Business_url + `/data-domain/queryDomainBySegment/${data.id}`,
            method: 'get',
        })
    },

    /* ********************************** 风景线 ***************************************** */
    // 公共
    getAreaList(data) {
        return service({
            url: Business_url + '/business-segment/projectList',
            method: 'post',
            data
        })
    },
    // 项目板块列表
    getPlateList_classify(data) {
        return service({
            url: Business_url + '/business-segment/plainList',
            method: 'post',
            data
        })
    },
    // 数据域分类
    classification_bos(data) {
        return service({
            url: Business_url + '/data-domain-category/plainList',
            method: 'post',
            data
        })
    },
    // 数据域
    dataMany_send(data) {
        return service({
            url: Business_url + `/data-domain/queryDomainBySegment/${data}`,
            method: 'get'
        })
    },
    // --------------------------------------------------------------------------------------------
    // -业务板块管理接口
    // 增加
    projectTaskAdd(data) {
        return service({
            url: Business_url + '/business-segment/add',
            method: 'post',
            data
        })
    },
    // 获取表格列表接口
    projectTaskList(data) {
        return service({
            url: Business_url + '/business-segment/list',
            method: 'post',
            data
        })
    },
    // 表格-编辑
    editPro(data) {
        return service({
            url: Business_url + '/business-segment/update',
            method: 'post',
            data
        })
    },
    // 表格-删除
    delPro(data) {
        return service({
            url: Business_url + '/business-segment/delete',
            method: 'post',
            data
        })
    },
    // ---------------------------------------------------------------------------------------------------
    // ----------数据域分类start ------------
    //增加
    ProjectTaskAdd_classify(data) {
        return service({
            url: Business_url + '/data-domain-category/add',
            method: 'post',
            data
        })
    },
    // 获取表格列表接口
    projectTaskList__classify(data) {
        return service({
            url: Business_url + `/data-domain-category/list`,
            method: 'post',
            data
        })
    },
    // 表格-编辑
    editPro_classify(data) {
        return service({
            url: Business_url + `/data-domain-category/update`,
            method: 'post',
            data
        })
    },
    // 表格-删除
    delPro_classify(data) {
        return service({
            url: Business_url + '/data-domain-category/delete',
            method: 'post',
            data
        })
    },
    //----------数据域分类END------------
    // --------------------------------------------------------------------------------------------------
    //----------数据域管理bos-START------------
    //增加
    ProjectTaskAdd_bos(data) {
        return service({
            url: Business_url + '/data-domain/add',
            method: 'post',
            data
        })
    },
    // 获取表格接口
    projectTaskList__bos(data) {
        return service({
            url: Business_url + "/data-domain/list",
            method: 'post',
            data
        })
    },
    // 表格-编辑
    editPro_bos(data) {
        return service({
            url: Business_url + '/data-domain/update',
            method: 'post',
            data
        })
    },
    // 表格-删除
    delPro_bos(data) {
        return service({
            url: Business_url + '/data-domain/delete',
            method: 'post',
            data
        })
    },
    // 拖拽保存当前
    ruleConfigCleanRulesOrder(data) {
        return service({
            url: Business_url + '/data-domain/updateSort',
            method: 'post',
            data
        })
    },
    //----------数据域分类BOSS-END------------
    // ------------------------------------------------------------------------------------------------
    /* 指标定义 */
    // 新建 原子指标
    definitionAdd(data) {
        return service({
            url: Business_url + '/indicator/addAtomic',
            method: 'post',
            data
        })
    },
    // 新建 复合指标
    definitionAddFh(data) {
        return service({
            url: Business_url + '/indicator/addComposite',
            method: 'post',
            data
        })
    },
    // 获取
    definitionList(data) {
        return service({
            url: Business_url + '/indicator/list',
            method: 'post',
            data
        })
    },
    // 获取编辑 回显
    definitionUpdateView(data) {
        return service({
            url: Business_url + `/indicator/getDetailForEdit/${data.id}`,
            method: 'get',
        })
    },
    // 更新 原子指标
    definitionUpdate(data) {
        return service({
            url: Business_url + `/indicator/updateAtomic`,
            method: 'post',
            data
        })
    },
    // 更新 复合指标
    definitionUpdateFh(data) {
        return service({
            url: Business_url + `/indicator/updateComposite`,
            method: 'post',
            data
        })
    },
    // 删除
    definitionDel(data) {
        return service({
            url: Business_url + `/indicator/delete/${data.id}`,
            method: 'get',
        })
    },
    // 修改状态
    definitionUpdateState(data) {
        return service({
            url: Business_url + `/indicator/singleValidChange/${data.id}`,
            method: 'get',
        })
    },
    // 删除 批量
    definitionDels(data) {
        return service({
            url: Business_url + `/indicator/batchDelete/${data.idStr}`,
            method: 'get',
        })
    },
    // 批量生效
    definitionEffective(data) {
        return service({
            url: Business_url + `/indicator/batchValid/${data.idStr}`,
            method: 'get',
        })
    },
    // 批量失效
    definitionFailure(data) {
        return service({
            url: Business_url + `/indicator/batchInvalid/${data.idStr}`,
            method: 'get',
        })
    },
    // 获取函数
    definitionFns(data) {
        return service({
            url: Business_url + `/function/queryFunction/${data.type}`,
            method: 'get',
        })
    },
    // 获取 数据集
    definitionDataSet(data) {
        return service({
            url: BaseUrl_di + `/dataSetType/getDataSetTypeAndTableTree`,
            method: 'get',
        })
    },
    // 获取 字段
    definitionFields(data) {
        return service({
            url: BaseUrl_di + `/dataSetDetail/search/dimensionOrMeasure`,
            method: 'post',
            data
        })
    },
    // 获取 指标
    definitionzb(data) {
        return service({
            url: Business_url + `/indicator/getIndicatorByDomain/${data.id}`,
            method: 'get',
        })
    },
    // ----------维度定义START-------------
    // 新增维度接口
    ProjectTaskAdd_dimension(data) {
        return service({
            url: Business_url + '/dimension/add',
            method: 'post',
            data
        })
    },
    // 维度定义表格接口请求
    projectTaskList__dimension(data) {
        return service({
            url: Business_url + "/dimension/list",
            method: 'post',
            data
        })
    },
    // 选择数据集接口
    dataSet_dimension() {
        return service({
            url: BaseUrl_di + "/dataSetType/getDataSetTypeAndTableTree",
            method: 'get'
        })
    },
    // 选择字段
    dimension_field(data) {
        return service({
            url: BaseUrl_di + "/dataSetDetail/search/dimensionOrMeasure",
            method: 'post',
            data
        })
    },
    // 表格编辑接口
    editPro_dimension(data) {
        return service({
            url: Business_url + '/dimension/update',
            method: 'post',
            data
        })
    },
    // header删除
    headel_dimension(data) {
        return service({
            url: Business_url + `/dimension/batchDelete/${data}`,
            method: 'get'
        })
    },
    // 表格删除接口
    delPro_dimension(data) {
        return service({
            url: Business_url + `/dimension/delete/${data}`,
            method: 'get'
        })
    },
    // 点击查看数据接口
    lookItem_dimension(data) {
        return service({
            url: Business_url + `/dimension/getDetailForLook/${data}`,
            method: 'get'
        })
    },
    // 点击编辑查看数据接口
    editItem_dimension(data) {
        return service({
            url: Business_url + `/dimension/getDetailForEdit/${data}`,
            method: 'get'
        })
    },
    // ----------维度定义END-------------
    // -------------------------------------------------------------------------------------------------------
    // ---------数据期定义Start---------
    // 获取表格列表接口
    TableList_dataPeriod(data) {
        return service({
            url: Business_url + '/data-period/list',
            method: 'post',
            data
        })
    },
    // 适用时间修饰词列表
    timeCunt_dataPeriod() {
        return service({
            url: Business_url + '/data-period/getTimeModifier',
            method: 'get'
        })
    },
    //增加
    ProjectTaskAdd_dataPeriod(data) {
        return service({
            url: Business_url + '/data-period/add',
            method: 'post',
            data
        })
    },
    // 删除
    delPro_dataPeriod(data) {
        return service({
            url: Business_url + `/data-period/delete/${data}`,
            method: 'get'
        })
    },
    // 编辑数据期
    editPro_dataPeriod(data) {
        return service({
            url: Business_url + '/data-period/update',
            method: 'post',
            data
        })
    },
    // ---------数据期定义END---------
    // ------------------------------------------------------------------------------------------------------
    // --------- 派生指标管理Start --------
    // 表格列表
    TableList_send(data) {
        return service({
            url: Business_url + '/derive-indicator/list',
            method: 'post',
            data
        })
    },
    // 指标来源
    finger_send(data) {
        return service({
            url: Business_url + '/derive-indicator/indicatorSourceList',
            method: 'post',
            data
        })
    },
    // 批量删除接口
    delPro_send(data) {
        return service({
            url: Business_url + '/derive-indicator/batchDelete',
            method: 'post',
            data
        })
    },
    // 表格删除接口
    tableDel_send(data) {
        return service({
            url: Business_url + '/derive-indicator/delete',
            method: 'post',
            data
        })
    },
    // 批量初始化
    manyInit_send(data) {
        return service({
            url: Business_url + '/business-segment/delete',
            method: 'post',
            data
        })
    },
    // 批量生效
    manyEffect_send(data) {
        return service({
            url: Business_url + '/business-segment/delete',
            method: 'post',
            data
        })
    },
    // 时间修饰词
    dressUpTime_send(data) {
        return service({
            url: Business_url + '/derive-indicator/timeQualifierList',
            method: 'post',
            data
        })
    },
    // 搜索派生指标--获取维度列表
    selectDegree_send(data) {
        return service({
            url: Business_url + '/derive-indicator/dimensionListWithSearch',
            method: 'post',
            data
        })
    },
    // 状态
    selectState_send(data) {
        return service({
            url: Business_url + '/derive-indicator/deriveIndicatorStatusList',
            method: 'post',
            data
        })
    },
    // 停用
    stop_send(data) {
        return service({
            url: Business_url + '/business-segment/delete',
            method: 'post',
            data
        })
    },
    // 新增派生指标
    AddIndex_send(data) {
        return service({
            url: Business_url + '/derive-indicator/add',
            method: 'post',
            data
        })
    },
    // 编辑派生指标
    editIndex_send(data) {
        return service({
            url: Business_url + '/derive-indicator/update',
            method: 'post',
            data
        })
    },
    // 新增派生指标--获取维度列表
    dimension_send(data) {
        return service({
            url: Business_url + '/derive-indicator/dimensionList',
            method: 'post',
            data
        })
    },
    // 新增派生指标--获取地域修饰词列表
    regionQualifier_send(data) {
        return service({
            url: Business_url + '/derive-indicator/regionQualifierList',
            method: 'post',
            data
        })
    },
    // 选择事件口径-公告时间
    aftetTime_send(data) {
        return service({
            url: BaseUrl_di + '/dataSetDetail/search/dimensionOrMeasure',
            method: 'post',
            data
        })
    },
    // 派生指标聚合函数列表
    aggregationFuncList(data) {
        return service({
            url: Business_url + '/derive-indicator/aggregationFuncList',
            method: 'post',
            data
        })
    },
    // 派生指标聚合
    aggregation(data) {
        return service({
            url: Business_url + '/derive-indicator/aggregation',
            method: 'post',
            data
        })
    },
    // 收藏
    indicatorCollect(data) {
        return service({
            url: Business_url + '/indicator-collect/collect',
            method: 'post',
            data
        })
    },
    // --------- 派生指标管理END -----------
    /* ---------------------- 指标构建 ------------------------ */
    // 指标构建-获取数据集列表
    getIndicatorDataSetList(data) {
        return service({
            url: Business_detail + '/dataSetList',
            method: 'get',
            data
        })
    },
    // 指标构建-触发数据集构建
    triggerDataSetBuild(data) {
        return service({
            url: Business_detail + `/triggerDataSetBuild/${data.datasetId}`,
            method: 'get',
        })
    },
    // 指标构建-执行kylin构建
    triggerKylinBuild(data) {
        return service({
            url: Business_detail + `/triggerKylinBuild/${data.datasetId}`,
            method: 'get',
        })
    },
    // 指标构建-执行指标计算
    triggerIndicatorCalculate(data) {
        return service({
            url: Business_detail + `/triggerIndicatorCalculate/${data.datasetId}`,
            method: 'get',
        })
    },
    // 指标构建-刷新
    refreshBuildStatus(data) {
        return service({
            url: Business_detail + `/refreshBuildStatus/${data.datasetId}`,
            method: 'get',
        })
    },
    // ---------------------------------------------------------------------------------------------------------
    // 指标展示-指标地图
    getIndicatorMap(data) {
        return service({
            url: Business_url + `/indicatorMap/getMapTree/${data.projectId}`,
            method: 'get',
        })
    },
    // 指标展示-维度
    getIndicatorDis(data) {
        return service({
            url: Business_url + `/dimension/getDimensionTree/${data.domainId}`,
            method: 'get',
        })
    },
    // 指标展示-时间修饰词
    getIndicatorTime(data) {
        return service({
            url: Business_url + `/data-period/getTimeModifier`,
            method: 'get',
        })
    },
    // 指标展示-状态
    getIndicatorState(data) {
        return service({
            url: Business_url + `/derive-indicator/deriveIndicatorStatusList`,
            method: 'POST',
        })
    },
    // 指标展示-派生指标列表
    getIndicatorPsList(data) {
        return service({
            url: Business_url + `/indicatorMap/list`,
            method: 'POST',
            data
        })
    },
    // 指标展示详情-列表
    getIndicatorDetailList(data) {
        return service({
            url: Business_detail + `/deriveIndicator/result`,
            method: 'POST',
            data
        })
    },
    //指标展示详情-收藏状态
    collectState(data) {
        return service({
            url: Business_url + `/indicator-collect/collectStatus`,
            method: 'POST',
            data
        })
    },
    // 指标展示详情-导出
    getIndicatorDetailExport(data) {
        return `${Business_detail}/deriveIndicator/result/export${data}`
    },
    /* ================================ 我的收藏 ================================== */
    // 收藏列表
    indicatorCollectList(data) {
        return service({
            url: Business_url + `/indicator-collect/list`,
            method: 'POST',
            data
        })
    },
    // 取消收藏
    indicatorCollectCancel(data) {
        return service({
            url: Business_url + `/indicator-collect/cancel`,
            method: 'POST',
            data
        })
    }
}