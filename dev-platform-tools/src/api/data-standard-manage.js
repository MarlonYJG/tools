/*
 * @Author: Marlon
 * @Date: 2020-07-20 11:05:55
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-05 11:53:14
 * @Description: 数据标准管理
 */
import service from 'utils/request'
import API from './public'

export const BaseUrl = '/ds'
const BaseUrl_dsm = '/dsm'
const BaseUrl_rc = '/rc'

export default {
    ...API,
    /* 项目管理API */
    // 导入代码集 上传
    uploadDataSet() {
        return BaseUrl + '/area/importCodeSetExcel';
    },
    // 导入excel 上传
    uploadImportExcel() {
        return BaseUrl + '/area/importExcel';
    },
    addArea(data) {
        return service({
            url: BaseUrl + '/area/addArea',
            method: 'post',
            data
        })
    },
    // 删除地区
    deleteArea(data) {
        return service({
            url: BaseUrl + '/area/deleteArea',
            method: 'get',
            data
        })
    },
    // 
    getAsArea(data) {
        return service({
            url: BaseUrl + '/area/getAsArea',
            method: 'get',
            data
        })
    },
    // 获取地区列表
    getAreaList(data) {
        return service({
            url: BaseUrl + '/area/getAreaList',
            method: 'get',
            data
        })
    },
    // 获取本地基本信息
    getBasicInfo(data) {
        return service({
            url: BaseUrl + '/area/getBasicInfo',
            method: 'get',
            data
        })
    },
    // 获取地区统计信息
    getStatsInfo(data) {
        return service({
            url: BaseUrl + '/area/getStatsInfo',
            method: 'get',
            data
        })
    },
    // 获取地区变更历史列表
    operateHistory(data) {
        return service({
            url: BaseUrl + '/area/operateHistory',
            method: 'get',
            data
        })
    },
    // 获取粒度字段
    getAllGrain(data) {
        return service({
            url: BaseUrl + '/area/getAllGrain',
            method: 'get',
            data
        })
    },
    // 更新地区基本信息
    updateAreaBasic(data) {
        return service({
            url: BaseUrl + '/area/updateAreaBasic',
            method: 'post',
            data
        })
    },
    // 获取数据源列表
    getDataSource(data) {
        return service({
            url: BaseUrl_dsm + '/ds/list',
            method: 'get',
            data
        })
    },
    // 导入数据源保存
    importDatabaseStructure(data) {
        return service({
            url: BaseUrl + '/area/importDatabaseStructure',
            method: 'get',
            data
        })
    },
    // 获取定版数据
    searchSectorListDict(data) {
        return service({
            url: BaseUrl + '/classify/sector/list/search',
            method: 'get',
            data
        })
    },
    /* 分类管理API */
    // 新增业务板块
    addSector(data) {
        return service({
            url: BaseUrl + '/classify/sector/add',
            method: 'post',
            data
        })
    },
    // 删除业务板块
    deleteSector(data) {
        return service({
            url: BaseUrl + '/classify/sector/delete',
            method: 'get',
            data
        })
    },
    // 根据id获取业务板块
    detailSector(data) {
        return service({
            url: BaseUrl + '/classify/sector/detail',
            method: 'get',
            data
        })
    },
    // 获取业务板块列表
    searchSectorList(data) {
        return service({
            url: BaseUrl + '/classify/sector/search',
            method: 'get',
            data
        })
    },

    // 获取业务板块字典
    searchSectorDic(data) {
        return service({
            url: BaseUrl + '/classify/sector/list/search',
            method: 'get',
            data
        })
    },

    // 修改业务板块
    updateSector(data) {
        return service({
            url: BaseUrl + '/classify/sector/update',
            method: 'post',
            data
        })
    },
    // 新增业务阶段
    addStage(data) {
        return service({
            url: BaseUrl + '/classify/stage/add',
            method: 'post',
            data
        })
    },
    // 删除业务阶段
    deleteStage(data) {
        return service({
            url: BaseUrl + '/classify/stage/delete',
            method: 'get',
            data
        })
    },
    // 根据id获取业务阶段
    detailStage(data) {
        return service({
            url: BaseUrl + '/classify/stage/detail',
            method: 'get',
            data
        })
    },
    // 获取业务阶段列表
    searchStageList(data) {
        return service({
            url: BaseUrl + '/classify/stage/search',
            method: 'get',
            data
        })
    },
    // 新增业务阶段
    updateStage(data) {
        return service({
            url: BaseUrl + '/classify/stage/update',
            method: 'post',
            data
        })
    },
    // 业务板块排序
    ywbkSort(data) {
        return service({
            url: BaseUrl + '/classify/stage/orderBy',
            method: 'post',
            data
        })
    },
    // 业务板块排序
    dataSetSort(data) {
        return service({
            url: BaseUrl + '/dataSet/orderBy',
            method: 'post',
            data
        })
    },
    // 业务板块排序
    sjbzsxSort(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/orderBy',
            method: 'post',
            data
        })
    },

    /* 数据标准属性API */
    // 添加数据集
    addDataSet(data) {
        return service({
            url: BaseUrl + '/dataSet/addDataSet',
            method: 'post',
            data
        })
    },
    // 删除数据集
    deleteDataSet(data) {
        return service({
            url: BaseUrl + '/dataSet/deleteDataSet',
            method: 'get',
            data
        })
    },
    // 编辑数据集
    updataDataSet(data) {
        return service({
            url: BaseUrl + '/dataSet/updateDataSet',
            method: 'post',
            data
        })
    },
    // 复制数据集
    copyDataSet(data) {
        return service({
            url: BaseUrl + '/dataSet/copyDataSet',
            method: 'post',
            data
        })
    },
    // 获取数据集列表
    getDataSetList(data) {
        return service({
            url: BaseUrl + '/dataSet/search',
            method: 'get',
            data
        })
    },
    // 获取数据标准属性列表
    getDataSetAttrList(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/search',
            method: 'get',
            data
        })
    },
    // 新建数据集属性
    addDataSetAttr(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/add',
            method: 'post',
            data
        })
    },
    // 删除数据集属性
    deleteDataSetAttr(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/delete',
            method: 'get',
            data
        })
    },
    // 根据id获取数据集属性
    getDataSetAttrDetail(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/detail',
            method: 'get',
            data
        })
    },
    // 编辑数据集属性
    updateDataSetAttr(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/update',
            method: 'post',
            data
        })
    },
    // 获取数据集分类字典
    getStageClassifyDic(data) {
        return service({
            url: BaseUrl + '/classify/stage/list/search',
            method: 'get',
            data
        })
    },
    // 获取数据集字典
    getStageDic(data) {
        return service({
            url: BaseUrl + '/dataSet/list/search',
            method: 'get',
            data
        })
    },
    // 获取代码集字典
    getCodeSetDic(data) {
        return service({
            url: BaseUrl + '/CodeSet/list/search',
            method: 'get',
            data
        })
    },
    // 数据标准属性-复制
    dataStageAttrCopy(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/copyDataSetAttr',
            method: 'post',
            data
        })
    },
    // 数据标准属性-复制-数据集列表
    dataStageAttrCopyList(data) {
        return service({
            url: BaseUrl + '/dataSet/table/search',
            method: 'get',
            data
        })
    },

    /* 代码集API */
    // 新增代码集
    addCodeSet(data) {
        return service({
            url: BaseUrl + '/CodeSet/add',
            method: 'post',
            data
        })
    },
    // 删除代码集
    deleteCodeSet(data) {
        return service({
            url: BaseUrl + '/CodeSet/delete',
            method: 'get',
            data
        })
    },
    // 获取代码集字典
    getCodeSetDic(data) {
        return service({
            url: BaseUrl + '/CodeSet/list/search',
            method: 'get',
            data
        })
    },
    // 获取代码集列表
    getCodeSetList(data) {
        return service({
            url: BaseUrl + '/CodeSet/search',
            method: 'get',
            data
        })
    },
    // 修改代码集
    updateCodeSet(data) {
        return service({
            url: BaseUrl + '/CodeSet/update',
            method: 'post',
            data
        })
    },
    // 获取分类字典
    getClassifyDic(data) {
        return service({
            url: BaseUrl + '/classify/sector/list/search',
            method: 'get',
            data
        })
    },
    // 获取枚举值列表
    getCodeSetAttrList(data) {
        return service({
            url: BaseUrl + '/CodeSetAttr/search',
            method: 'get',
            data
        })
    },
    // 新增代码枚举值
    addCodeSetAttr(data) {
        return service({
            url: BaseUrl + '/CodeSetAttr/add',
            method: 'post',
            data
        })
    },
    // 删除代码枚举值
    deleteCodeSetAttr(data) {
        return service({
            url: BaseUrl + '/CodeSetAttr/delete',
            method: 'get',
            data
        })
    },
    // 修改代码枚举值
    updateCodeSetAttr(data) {
        return service({
            url: BaseUrl + '/CodeSetAttr/update',
            method: 'post',
            data
        })
    },
    /* ========= 规则管理 ========== */
    /* 清洗规则 */
    // 新增字段
    addDataFixed(data) {
        return service({
            url: BaseUrl + '/datafixed/add',
            method: 'post',
            data
        })
    },
    /* 质量规则 */
    // 获取规则类型预览树形结构
    getRuleTypePreviewTree(data) {
        return service({
            url: BaseUrl_rc + '/ruleType/preview/tree/search',
            method: 'get',
            data
        })
    },
    // 质量规则列表
    qualityRulesList(data) {
        return service({
            url: BaseUrl + '/rules/qualityRules/search',
            method: 'post',
            data
        })
    },
    // 规则参数预览
    rulePreview(data) {
        return service({
            url: BaseUrl_rc + '/rule/preview',
            method: 'get',
            data
        })
    },
    // 行规则列表
    rowRulesList(data) {
        return service({
            url: BaseUrl + '/rules/rowRules/search',
            method: 'post',
            data
        })
    },
    // 字段规则列表
    fieldRulesList(data) {
        return service({
            url: BaseUrl + '/dataSetAttr/fieldRules/search',
            method: 'get',
            data
        })
    },
    // 删除规则
    deleteRules(data) {
        return service({
            url: BaseUrl + '/rules/delete',
            method: 'get',
            data
        })
    },
    // 新增质量规则
    addQualityRules(data) {
        return service({
            url: BaseUrl + '/rules/qualityRules/add',
            method: 'post',
            data
        })
    },
    // 修改规则
    updateRules(data) {
        return service({
            url: BaseUrl + '/rules/update',
            method: 'post',
            data
        })
    },
    // 根据id获取规则
    detailRules(data) {
        return service({
            url: BaseUrl + '/rules/detail',
            method: 'get',
            data
        })
    },
    // 添加行规则
    addRowRules(data) {
        return service({
            url: BaseUrl + '/rules/rowRules/add',
            method: 'post',
            data
        })
    },
    // 字段规则子列表
    subFieldRulesList(data) {
        return service({
            url: BaseUrl + '/rules/fieldRules/search',
            method: 'post',
            data
        })
    },
    // 添加字段规则
    addFieldRules(data) {
        return service({
            url: BaseUrl + '/rules/fieldRules/add',
            method: 'post',
            data
        })
    },

    /* ============ 发布管理 =============== */
    /* 定板数据标准 */
    // 新增定版数据标准
    addDataFixed(data) {
        return service({
            url: BaseUrl + '/datafixed/add',
            method: 'post',
            data
        })
    },
    // 删除定版数据标准
    deleteDataFixed(data) {
        return service({
            url: BaseUrl + '/datafixed/delete',
            method: 'get',
            data
        })
    },
    // 根据id获取定版数据标准
    detailDataFixed(data) {
        return service({
            url: BaseUrl + '/datafixed/detail',
            method: 'get',
            data
        })
    },
    // 获取定版数据标准字典
    dataFixedDic(data) {
        return service({
            url: BaseUrl + '/datafixed/list/search',
            method: 'get',
            data
        })
    },
    // 获取定版数据标准列表
    searchDataFixed(data) {
        return service({
            url: BaseUrl + '/datafixed/search',
            method: 'get',
            data
        })
    },
    // 修改定版数据标准
    updateDataFixed(data) {
        return service({
            url: BaseUrl + '/datafixed/update',
            method: 'post',
            data
        })
    },
    /* 数据采集标准 */
    // 添加采集数据标准
    addCollection(data) {
        return service({
            url: BaseUrl + '/collection/add',
            method: 'post',
            data
        })
    },
    // 删除采集数据标准
    deleteCollection(data) {
        return service({
            url: BaseUrl + '/collection/delete',
            method: 'get',
            data
        })
    },
    // 查看详情列表
    detailCollection(data) {
        return service({
            url: BaseUrl + '/collection/detail',
            method: 'get',
            data
        })
    },
    // 获取采集标准列表
    searchCollectionList(data) {
        return service({
            url: BaseUrl + '/collection/search',
            method: 'get',
            data
        })
    },
    // 修改采集数据标准
    updateCollection(data) {
        return service({
            url: BaseUrl + '/collection/update',
            method: 'post',
            data
        })
    },
    // 从标准生成
    generateCollection(data) {
        return service({
            url: BaseUrl + '/collection/generate',
            method: 'post',
            data
        })
    },
    // 定版数据集属性列表
    getFixedDataSetAttrList(data) {
        return service({
            url: BaseUrl + '/fixedDataSetAttr/search',
            method: 'get',
            data
        })
    },
    // 定版业务板块列表
    getFixedSectorList(data) {
        return service({
            url: BaseUrl + '/fixedSector/list/search',
            method: 'get',
            data
        })
    },
    // 获取数据集分类字典
    getFixedStageDic(data) {
        return service({
            url: BaseUrl + '/fixedStage/list/search',
            method: 'get',
            data
        })
    },
    // 获取定版业务阶段
    searchFixedSectorList(data) {
        return service({
            url: BaseUrl + '/fixedSector/list/search',
            method: 'get',
            data
        })
    },
    // 代码集
    getCodeList(data) {
        return service({
            url: BaseUrl + '/fixedCodeSet/search',
            method: 'get',
            data
        })
    },
    // 代码集属性
    getCodeAttrList(data) {
        return service({
            url: BaseUrl + '/fixedCodeSetAttr/search',
            method: 'get',
            data
        })
    },
    // 数据采集-导入Excel
    collectionImportExcel() {
        return BaseUrl + '/collection/importExcel';
    },

    /* ====================== 统计规则 ======================== */
    // 规则树
    getRulesTree(data) {
        return service({
            url: BaseUrl + '/rules/statistics',
            method: 'get',
            data
        })
    },
    // 规则明细-清洗规则(质量规则)
    detailClearRules(data) {
        return service({
            url: BaseUrl + '/rules/rules/search',
            method: 'post',
            data
        })
    }































}
