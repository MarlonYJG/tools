/*
 * @Author: Marlon
 * @Date: 2020-03-02 21:41:11
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-19 10:15:02
 * @Description: 数据质量管理
 */
import service from 'utils/request'
import API from './public'

/* 数据源列表 */
const BaseUrl = '/dq'
const BaseUrl_3 = '/dsm'
const BaseUrl_4 = "/rc"
const BaseUrl_5 = "/ds"
export default {
    ...API,
    // 获取所有项目列表
    _PublicProjectList(data) {
        return service({
            url: BaseUrl + '/project/list',
            method: 'get',
            data
        })
    },
    // 获取任务列表 **-**
    _PublicTaskList(data) {
        let projectId = data.projectId;
        return service({
            url: BaseUrl + '/task/list/' + projectId,
            method: 'get',
        })
    },
    // 数据源列表
    _publicSourceData(data) {
        return service({
            url: BaseUrl_3 + '/ds/list',
            method: 'get',
            data
        })
    },
    // 项目-任务-版本
    _publicProTaskVer(data) {
        return service({
            url: BaseUrl + '/task/record/dic/list',
            method: 'get',
            data
        })
    },
    // 数据标准-元数据库-级联
    _publicDataStandard(data) {
        return service({
            url: BaseUrl + '/task/queryDataStandard',
            method: 'get',
            data
        })
    },
    /* ==============风景线==================== */
    /* 项目管理 */
    projectList(data) {
        return service({
            url: BaseUrl + '/project/page',
            method: 'get',
            data
        })
    },
    projectAdd(data) {
        return service({
            url: BaseUrl + '/project',
            method: 'POST',
            data
        })
    },
    projectDel(data) {
        return service({
            url: BaseUrl + `/project${data}`,
            method: 'DELETE',
        })
    },
    projectUpdate(data) {
        return service({
            url: BaseUrl + '/project',
            method: 'PUT',
            data
        })
    },
    // 任务管理
    taskList(data) {
        return service({
            url: BaseUrl + '/task/page/' + data.projectId,
            method: 'get',
            data: data.paramsData
        })
    },
    taskAdd(data) {
        return service({
            url: BaseUrl + '/task',
            method: 'post',
            data
        })
    },
    taskDel(data) {
        return service({
            url: BaseUrl + `/task${data}`,
            method: 'DELETE',
        })
    },
    taskUpdate(data) {
        return service({
            url: BaseUrl + '/task',
            method: 'PUT',
            data
        })
    },
    // 任务复制
    taskCopy(data) {
        return service({
            url: BaseUrl + '/task/copyTask',
            method: 'POST',
            data
        })
    },
    // 执行任务
    taskRun(data) {
        return service({
            url: BaseUrl + '/task/taskExecute',
            method: 'GET',
            data
        })
    },
    // 同步数据标准
    taskSynDataStandard(data) {
        return service({
            url: BaseUrl + '/task/syn',
            method: 'GET',
            data
        })
    },
    /* 质量规则配置 */
    // 获取数据集规则table-列表
    ruleMainList(data) {
        return service({
            url: `${BaseUrl}/dataSet/pageQueryDataSetList`,
            method: 'post',
            data
        })
    },
    // 获取项目任务联动-字典
    _ruleRelationTaskList(data) {
        return service({
            url: `${BaseUrl}/task/queryRelationTaskList?taskId=${data.taskId}`,
            method: 'GET'
        })
    },
    // 添加数据集-新增-数据集table-列表
    ruleTableDSForAdd(data) {
        return service({
            url: `${BaseUrl}/dataSet/queryTableDataSetForAdd?taskId=${data.taskId}`,
            method: 'get'
        })
    },
    // 添加数据集-新增-单表批量添加保存
    ruleSaveTableDataSet(data) {
        return service({
            url: `${BaseUrl}/dataSet/saveTableDataSet`,
            method: 'post',
            data
        })
    },
    // 添加数据集-编辑-单表批量添加保存
    ruleUpdateTableDataSet(data) {
        return service({
            url: `${BaseUrl}/dataSet/editTableDataSet`,
            method: 'post',
            data
        })
    },
    // 添加数据集-新增&编辑-sql数据集保存
    ruleSaveOrUpdateSqlDataSet(data) {
        return service({
            url: `${BaseUrl}/dataSet/saveOrUpdateSqlDataSet`,
            method: 'post',
            data
        })
    },
    // 数据集table-删除
    ruleDelDataSet(data) {
        return service({
            url: `${BaseUrl}/dataSet/delDataSet?id=${data.id}`,
            method: 'get'
        })
    },
    // 规则数
    rulesTreeDic(data) {
        return service({
            url: `${BaseUrl}/dataSetRule/queryRuleStatisticsTree?taskId=${data.taskId}`,
            method: 'get'
        })
    },
    // 规则明细列表
    rulesQueryRuleStatisticsList(data) {
        return service({
            url: `${BaseUrl}/dataSetRule/queryRuleStatisticsList`,
            method: 'get',
            data
        })
    },
    // 多表关联构造数据集-选择表查询
    rulesQueryTableName(data) {
        return service({
            url: `${BaseUrl}/dataSet/queryTableName`,
            method: 'get',
            data
        })
    },
    // 多表关联构造数据集-选择字段查询
    rulesQueryColumn(data) {
        return service({
            url: `${BaseUrl}/dataSet/queryColumn`,
            method: 'post',
            data
        })
    },
    // 数据集的质量规则列表
    rulesQualityRulesList(data) {
        return service({
            url: `${BaseUrl}/dataSetRule/pageQueryDataSetRuleList`,
            method: 'post',
            data
        })
    },
    // 规则列表-删除
    ruleDelDataSetRuleById(data) {
        return service({
            url: `${BaseUrl}/dataSetRule/logicDelDataSetRuleById`,
            method: 'get',
            data
        })
    },
    /* 审核结果 */
    // 任务执行结果列表
    taskRunList(data) {
        return service({
            url: BaseUrl + '/task/record/list',
            method: 'POST',
            data
        })
    },
    // 质量结果详情查询
    taskSearch(data) {
        return service({
            url: BaseUrl + '/task/record/detail/list',
            method: 'POST',
            data
        })
    },
    // 导出excel
    exportExcel() {
        return BaseUrl + "/task/record/detail/excel/export";
    },
    /* 质量报告 */
    // 总数
    reportTotal(data) {
        return service({
            url: BaseUrl + '/report/statistics',
            method: 'GET',
            data
        })
    },
    // 质量情况
    reportFields(data) {
        return service({
            url: BaseUrl + '/report/statistics/rule',
            method: 'GET',
            data
        })
    },
    // 获取规则类型预览树形结构
    getRuleTypePreviewTree() {
        return service({
            url: `${BaseUrl_4}/ruleType/preview/tree/search`,
            method: 'get'
        })
    },
    // 规则参数预览
    rulePreview(data) {
        return service({
            url: `${BaseUrl_4}/rule/preview`,
            method: 'get',
            data
        })
    },
    // 新增质量规则
    addQualityRules(data) {
        return service({
            url: `${BaseUrl_5}/rules/qualityRules/add`,
            method: 'post',
            data
        })
    },
    // 添加行规则
    addRowRules(data) {
        return service({
            url: `${BaseUrl_5}/rules/rowRules/add`,
            method: 'post',
            data
        })
    },
    // 字段规则子列表
    subFieldRulesList(data) {
        return service({
            url: `${BaseUrl_5}/rules/fieldRules/search`,
            method: 'post',
            data
        })
    },
    // 添加字段规则
    addFieldRules(data) {
        return service({
            url: `${BaseUrl_5}/rules/fieldRules/add`,
            method: 'post',
            data
        })
    },
    // 多表关联构造数据集-选择字段查询
    rulesQueryColumn(data) {
        return service({
            url: `${BaseUrl}/dataSet/queryColumn`,
            method: 'post',
            data
        })
    },
    // 添加规则-新增保存或编辑保存
    ruleSaveDataSetRule(data) {
        return service({
            url: `${BaseUrl}/dataSetRule/saveOrUpdateDataSetRule`,
            method: 'post',
            data
        })
    },
    // 获取字段中带url数据
    useUrlGetData(url, data) {
        return service({
            url: `${BaseUrl}${url}`,
            method: 'get',
            data
        })
    },
    // 获取数据集明细
    getDataSetDetail(data) {
        return service({
            url: `${BaseUrl}/dataSet/queryDataSetForEdit`,
            method: 'get',
            data
        })
    },
    // 修改或新增数据集 多表关联
    saveOrUpdateRelationDataSet(data) {
        return service({
            url: `${BaseUrl}/dataSet/saveOrUpdateRelationDataSet`,
            method: 'post',
            data
        });
    },
}