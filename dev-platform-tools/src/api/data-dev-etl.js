/*
 * @Author: Marlon
 * @Date: 2020-04-26 14:51:52
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 10:26:17
 * @Description: 数据开发-ETL
 */
import service from 'utils/request'

import API from './public'

const BaseUrl = '/etl'
const BaseUrl_data_manage = '/dsm';
const BaseUrl_meta_data_manage = '/md';
const BaseUrl_rule_tree = '/rc';
const BaseUrl_quality_manage = '/dq'

export default {
    ...API,
    // 项目列表
    _publicProject(data) {
        return service({
            url: BaseUrl + '/project/list',
            method: 'get',
            data
        })
    },
    // 任务列表
    _publicTask(data) {
        return service({
            url: BaseUrl + `/task/list/${data.projectId}`,
            method: 'get'
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
    // 获取 数据标准列表、元数据库
    _publicStandardsData(data) {
        return service({
            url: BaseUrl_quality_manage + '/task/queryDataStandard',
            method: 'get',
            data
        })
    },
    // 获取规则类型预览树形结构
    _publicRuleTypeTree(data) {
        return service({
            url: BaseUrl_rule_tree + '/ruleType/preview/tree/search',
            method: 'get',
            data
        })
    },
    // 获取对应树形节点的DOM结构
    _publicTreeItemDom(data) {
        return service({
            url: BaseUrl_rule_tree + '/rule/preview',
            method: 'get',
            data
        })
    },
    // 类型(清洗规则)
    _publicRuleType(data) {
        return service({
            url: BaseUrl_rule_tree + '/rule/search/ruleLogicType',
            method: 'get',
            data
        })
    },


    /* ********************风景线******************** */
    // 项目管理-获取
    getProList(data) {
        return service({
            url: BaseUrl + '/project/page',
            method: 'post',
            data
        })
    },
    // 项目管理-编辑
    updatePro(data) {
        return service({
            url: BaseUrl + '/project/update',
            method: 'post',
            data
        })
    },
    // 项目管理-添加
    addPro(data) {
        return service({
            url: BaseUrl + '/project/save',
            method: 'post',
            data
        })
    },
    // 项目管理-删除
    delPro(data) {
        return service({
            url: BaseUrl + `/project/delete/${data.id}`,
            method: 'get'
        })
    },
    // 任务列表-获取
    getTaskList(data) {
        return service({
            url: BaseUrl + `/task/page`,
            method: 'post',
            data
        })
    },
    // 任务列表-新增
    addTask(data) {
        return service({
            url: BaseUrl + `/task/save`,
            method: 'post',
            data
        })
    },
    // 任务列表-编辑
    updateTask(data) {
        return service({
            url: BaseUrl + `/task/update`,
            method: 'post',
            data
        })
    },
    // 任务列表-删除
    delTask(data) {
        return service({
            url: BaseUrl + `/task/delete/${data.id}`,
            method: 'get'
        })
    },
    // 任务列表-ktr文件上传
    uploadKtr() {
        return BaseUrl + '/task/uploadKettleFile';
    },
    // 任务列表-复制
    copyTask(data) {
        return service({
            url: BaseUrl + `/task/copyTask/${data.id}`,
            method: 'get',
        })
    },
    // 任务列表-执行
    runTask(data) {
        return service({
            url: BaseUrl + `/arrange/executeTask/${data.id}`,
            method: 'get',
        })
    },
    // 任务列表-同步标准清洗规则 
    rulesSync(data) {
        return service({
            url: BaseUrl + `/task/synRule`,
            method: 'get',
            data
        })
    },
    // 任务列表-导入
    impTask(data) {
        // TODO
        return service({
            url: BaseUrl + `/task/executeTask/${data.id}`,
            method: 'get',
        })
    },
    // 任务列表-导出
    expTask() {
        return BaseUrl + `/task/exportExcel`;
    },
    // 任务列表-对比配置
    expDiff(){
        return BaseUrl + `/task/diffCompared`;
    },
    // 规则配置-获取
    ruleConfigGetList(data) {
        return service({
            url: BaseUrl + `/tableMapping/page`,
            method: 'post',
            data
        })
    },
    // 规则配置-编辑
    ruleConfigUpdate(data) {
        return service({
            url: BaseUrl + `/tableMapping/update`,
            method: 'post',
            data
        })
    },
    // 规则配置-删除
    ruleConfigDel(data) {
        return service({
            url: BaseUrl + `/tableMapping/delete/${data.id}`,
            method: 'get',
        })
    },
    // 规则配置-获取目标表
    ruleConfigTargetList(data) {
        return service({
            url: BaseUrl + `/tableMapping/getTargetTable`,
            method: 'get',
            data
        })
    },
    // 规则配置-添加目标表
    ruleConfigAdd(data) {
        return service({
            url: BaseUrl + `/tableMapping/save`,
            method: 'post',
            data
        })
    },
    // 规则配置-执行
    ruleConfigRun(data) {
        return service({
            url: BaseUrl + `/tableMapping/executeTableMapping/${data.id}`,
            method: 'get'
        })
    },
    // 规则配置-表列表
    ruleConfigTableList(data) {
        return service({
            url: BaseUrl + `/tableMapping/sourceSetList/${data.sourceDataSourceId}`,
            method: 'get'
        })
    },
    // 规则配置-字段映射-获取
    ruleConfigFieldList(data) {
        return service({
            url: BaseUrl + `/columnMapping/page`,
            method: 'post',
            data
        })
    },
    // 规则配置-字段映射-删除
    ruleConfigFieldDel(data) {
        return service({
            url: BaseUrl + `/columnMapping/delete/${data.id}`,
            method: 'get'
        })
    },
    // 规则配置-字段映射-编辑
    ruleConfigFieldUpdate(data) {
        return service({
            url: BaseUrl + `/columnMapping/update`,
            method: 'post',
            data
        })
    },
    // 规则配置-字段映射-获取设置目标字段列表
    ruleConfigFieldAddList(data) {
        return service({
            url: BaseUrl + `/columnMapping/getTargetColumn/${data.tableMappingId}`,
            method: 'get',
        })
    },
    // 规则配置-字段映射-新增
    ruleConfigFieldAdd(data) {
        return service({
            url: BaseUrl + `/columnMapping/save`,
            method: 'post',
            data
        })
    },
    // 规则配置-字段映射-源类型列表
    ruleConfigSourceTypeList(data) {
        return service({
            url: BaseUrl + `/columnMapping/getSourceType`,
            method: 'get',
            data
        })
    },
    // 规则配置-字段映射-源字段列表
    ruleConfigSourceFieldList(data) {
        return service({
            url: BaseUrl + `/columnMapping/sourceColumnList/${data.tableMappingId}`,
            method: 'get',
        })
    },
    // 规则配置-清洗规则-新增
    ruleConfigCleanRulesAdd(data) {
        return service({
            url: BaseUrl + `/rule/save`,
            method: 'post',
            data
        })
    },
    // 规则配置-清洗规则-获取
    ruleConfigCleanRulesList(data) {
        return service({
            url: BaseUrl + `/rule/page`,
            method: 'post',
            data
        })
    },
    // 规则配置-清洗规则-删除
    ruleConfigCleanRulesDel(data) {
        return service({
            url: BaseUrl + `/rule/delete/${data.id}`,
            method: 'get',
        })
    },
    // 规则配置-清洗规则-修改
    ruleConfigCleanRulesUpdate(data) {
        return service({
            url: BaseUrl + `/rule/update`,
            method: 'post',
            data
        })
    },
    // 规则配置-清洗规则-排序
    ruleConfigCleanRulesOrder(data) {
        return service({
            url: BaseUrl + `/rule/order`,
            method: 'post',
            data
        })
    },
    // 规则配置-清洗规则-(动态规则配置)数据集请求
    ruleConfigSetData({ url, method, data }) {
        return service({
            url: BaseUrl + url,
            method,
            data
        })
    },
    // 规则配置-清洗规则-(动态规则配置)字段请求
    ruleConfigFieldUrl({ url, method, data }) {
        return service({
            url: BaseUrl + url,
            method,
            data
        })
    },
    // 规则配置-统计规则-统计树
    ruleCollectTree(data) {
        return service({
            url: BaseUrl + '/rule/statistics',
            method: 'get',
            data
        })
    },
    // 规则配置-统计规则-获取
    ruleCollectList(data) {
        return service({
            url: BaseUrl + '/rule/list/page',
            method: 'get',
            data
        })
    },
    // 规则配置-统计规则-修改
    ruleCollectUpdate(data) {
        return service({
            url: BaseUrl + '/rule/update',
            method: 'post',
            data
        })
    },
    // 作业编排-获取
    workList(data) {
        return service({
            url: BaseUrl + '/arrange/page',
            method: 'post',
            data
        })
    },
    // 作业编排-新增
    workAdd(data) {
        return service({
            url: BaseUrl + '/arrange/save',
            method: 'post',
            data
        })
    },
    // 作业编排-编辑
    workUpdate(data) {
        return service({
            url: BaseUrl + '/arrange/update',
            method: 'post',
            data
        })
    },
    // 作业编排-删除
    workDel(data) {
        return service({
            url: BaseUrl + `/arrange/delete/${data.id}`,
            method: 'get',
        })
    },
    // 任务及转换 - 任务&转换 树
    workTaskTreeLt(data) {
        return service({
            url: BaseUrl + `/arrangeTask/getTree/${data.id}/${data.projectId}`,
            method: 'get',
        })
    },
    // 任务及转换 - 任务&转换 树 删除任务
    workTaskTreeLtDel(data) {
        return service({
            url: BaseUrl + `/arrangeTask/delete/${data.id}`,
            method: 'get',
        })
    },
    // 任务及转换 - 任务&转换 树 删除表
    workTaskTreeLtTableDel(data) {
        return service({
            url: BaseUrl + `/arrangeTableMapping/delete/${data.id}`,
            method: 'get',
        })
    },
    // 任务及转换 - 新增 任务&转换 树
    workTaskTreeAdd(data) {
        return service({
            url: BaseUrl + `/arrangeTask/getSaveTree/${data.id}/${data.projectId}`,
            method: 'get',
        })
    },
    // 任务及转换 - 新增(保存) 任务&转换 树
    workTaskTreeAddSave(data) {
        return service({
            url: BaseUrl + `/arrangeTask/saveTree`,
            method: 'post',
            data
        })
    },
    // 任务及转换 - 任务关联视图 -任务下拉
    workTaskView(data) {
        return service({
            url: BaseUrl + `/arrangeTask/getArrangeTaskList/${data.id}/${data.projectId}`,
            method: 'get',
        })
    },
    // 任务及转换 - 转换关联视图 -转换表下拉
    workTaskViewZH(data) {
        return service({
            url: BaseUrl + `/arrangeTableMapping/getArrangeTableMappingList/${data.arrangeTaskId}`,
            method: 'get',
        })
    },
    // 任务及转换 - 任务关联视图 -任务删除
    workTaskViewTaskNodeDel(data) {
        return service({
            url: BaseUrl + `/arrangeTaskRely/delete/${data.ids}`,
            method: 'get',
        })
    },
    // 任务及转换 - 转换关联视图 -转换表删除
    workTaskViewZHNodeDel(data) {
        return service({
            url: BaseUrl + `/arrangeTableMappingRely/delete/${data.ids}`,
            method: 'get',
        })
    },
    // 任务及转换 - 任务关联视图 -拓扑图
    graphTask(data) {
        return service({
            url: BaseUrl + `/arrangeTaskRely/getArrangeTaskRely/${data.id}/${data.arrangeId}`,
            method: 'get',
        })
    },
    // 任务及转换 - 任务关联视图 -保存 拓扑图
    graphTaskSave(data) {
        return service({
            url: BaseUrl + `/arrangeTaskRely/save`,
            method: 'post',
            data
        })
    },
    // 任务及转换 - 转换关联视图 -拓扑图
    graphTable(data) {
        return service({
            url: BaseUrl + `/arrangeTableMappingRely/getArrangeTableMappingRely/${data.id}/${data.arrangeId}`,
            method: 'get',
        })
    },
    // 任务及转换 - 转换关联视图 -保存 拓扑图
    graphTableSave(data) {
        return service({
            url: BaseUrl + `/arrangeTableMappingRely/save`,
            method: 'post',
            data
        })
    },
    // 执行结果-获取
    resultsList(data) {
        return service({
            url: BaseUrl + `/executionResult/page`,
            method: 'post',
            data
        })
    },
    // 执行结果-详情-进行标识
    resultsIng(data) {
        return service({
            url: BaseUrl + `/executionResultInfo/completeFlagList`,
            method: 'get',
            data
        })
    },
    // 执行结果-详情-成功标识
    resultsSucc(data) {
        return service({
            url: BaseUrl + `/executionResultInfo/resultFlagList`,
            method: 'get',
            data
        })
    },
    // 执行结果-详情-获取
    resultsListGet(data) {
        return service({
            url: BaseUrl + `/executionResultInfo/page`,
            method: 'post',
            data
        })
    },
    // 执行结果-详情-异常查询
    resultsError(data) {
        return service({
            url: BaseUrl + `/executionResultInfo/exception/page`,
            method: 'post',
            data
        })
    },
    // 执行结果-详情-不符合查询
    resultsNo(data) {
        return service({
            url: BaseUrl + `/executionResultInfo/illegal/page`,
            method: 'post',
            data
        })
    }


}
