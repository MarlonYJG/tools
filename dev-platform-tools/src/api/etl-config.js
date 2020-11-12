/*
 * @Author: yangjianguo
 * @Date: 2019-08-09 14:34:14
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 09:36:03
 * @Description: 旧版 - ETL —— 废弃
 */
import service from '../utils/request'
import API from './public'


let envURL = '/api'
let dbURL = '/jydsj'

export default {
  ...API,
  // 初始化菜单导航
  initNavigation(params, pathVal) {
    return service({
      url: envURL + '/jydsj/oath/initNavigation/' + pathVal,
      method: 'get',
      data: params,
    })
  },
  // 新增修改数据源信息
  editDatasource(data) {
    return service({
      url: envURL + '/etlDataSourceController/editDatasource',
      method: 'post',
      data
    })
  },
  // 获取数据源配置信息
  queryDatasource(data) {
    return service({
      url: envURL + '/etlDataSourceController/queryDatasource',
      method: 'post',
      data
    })
  },
  // 获取作业列表的配置记录
  getJobRepo(data) {
    return service({
      url: envURL + '/jobReposController/getJobRepo',
      method: 'post',
      data
    })
  },
  // 获取作业库配置记录
  getJobRepoOnlyRule(data) {
    return service({
      url: envURL + '/jobReposController/getJobRepoOnlyRule',
      method: 'post',
      data
    })
  },
  // 编辑作业库配置记录
  editJobRepo(data) {
    return service({
      url: envURL + '/jobReposController/editJobRepo',
      method: 'post',
      data
    })
  },
  // 获取目标数据集的字段名
  getTargetTableFields(data) {
    return service({
      url: envURL + '/jobRuleConfController/getTargetTableFields',
      method: 'post',
      data
    })
  },
  // 获取作业库表配置记录
  getJobRepoInfoTable(data) {
    return service({
      url: envURL + '/jobRuleConfController/getJobRepoInfoTable',
      method: 'post',
      data
    })
  },
  // 获取作业库表配置记录
  getDatasets(data) {
    return service({
      url: envURL + '/jobRuleConfController/getDatasets',
      method: 'post',
      data
    })
  },
  // 初始化规则库页面信息
  initEditRuleRepoInfo(data) {
    return service({
      url: envURL + '/jobRuleConfController/initEditRuleRepoInfo',
      method: 'post',
      data
    })
  },
  // 新增作业库配置表记录
  addJobRepoInfoTable(data) {
    return service({
      url: envURL + '/jobRuleConfController/addJobRepoInfoTable',
      method: 'post',
      data
    })
  },
  getTargetSourceRelation(data) {
    return service({
      url: envURL + '/jobRepositoryInfoTableRelation/saveInBatch',
      method: 'post',
      data
    })
  },
  editRuleRepoInfo(data) {
    return service({
      url: envURL + '/jobRuleConfController/editRuleRepoInfo',
      method: 'post',
      data
    })
  },
  // 保存作业库配置字段映射关系记录备注信息
  saveFieldMapperRemark(data) {
    return service({
      url: envURL + '/jobRepositoryInfoTableRelation/batchUpdateRemark',
      method: 'post',
      data
    })
  },
  // 保存作业库配置表记录及字段映射关系记录
  saveJobRepoTableAndMapper(data) {
    return service({
      url: envURL + '/jobRuleConfController/saveJobRepoTableAndMapper',
      contentType: 'application/json;charset=UTF-8',
      method: 'post',
      data
    })
  },
  initJobRepoTable(params) {
    console.log('params', params);
    return service({
      url: envURL + '/jobRuleConfController/initJobRepoTable',
      method: 'get',
      data: params,
    })
  },
  initJobRepoTableRelation(data) {
    return service({
      url: envURL + '/jobRuleConfController/initJobRepoTableRelation',
      method: 'post',
      data
    })
  },
  // 删除作业库表配置
  delJobRepoTable(data) {
    return service({
      url: envURL + '/jobRuleConfController/delJobRepoTable',
      method: 'post',
      data
    })
  },
  // 删除作业库表映射关系配置
  delJobRepoTableRelation(params) {
    return service({
      url: envURL + '/jobRepositoryInfoTableRelation/delete',
      method: 'GET',
      data: params,
    })
  },
  //更新源字段
  updateField(data) {
    return service({
      url: envURL + '/jobRepositoryInfoTableRelation/update',
      method: 'post',
      data
    })
  },
  // 获取规则库规则名称列表信息
  getRuleNameList(data) {
    return service({
      url: envURL + '/jobRuleConfController/getRuleNameList',
      method: 'post',
      data
    })
  },

  // 获取作业调度管理任务执行计划分页列表
  getJobScheduleManagement(data) {
    return service({
      url: envURL + '/taskScheduler/getTaskSchedulerPageList',
      method: 'post',
      data,
      isformContentType: true,
    })
  },
  // 获取作业调度管理依赖任务执行计划分页列表
  getDependencyTask(params) {
    return service({
      url: envURL + '/taskScheduler/getDependencyTaskSchedulerPageList',
      method: 'GET',
      data: params,
    })
  },
  // 获取作业调度管理添加任务调度
  getAddTaskSchedule(data) {
    return service({
      url: envURL + '/taskScheduler/addTaskScheduler',
      method: 'post',
      contentType: 'application/json;charset=UTF-8',
      data
    })
  },
  // 获取作业调度管理添加任务调度
  getAddDependencyTaskSchedule(data) {
    return service({
      url: envURL + '/taskScheduler/addDependencyTaskScheduler',
      method: 'post',
      contentType: 'application/json;charset=UTF-8',
      data
    })
  },
  // 获取作业调度管理添加任务调度
  getDependencyTaskDetail(data) {
    return service({
      url: envURL + '/taskScheduler/getJobDetail',
      method: 'post',
      data
    })
  },
  // 更新依赖度
  updateDetail(data) {
    return service({
      url: envURL + '/taskScheduler/modifyJob',
      method: 'post',
      data,
      contentType: 'application/json;charset=UTF-8',
    })
  },

  // 获取作业调度任务名称下拉框
  getTaskName(data) {
    return service({
      url: envURL + '/taskScheduler/getJobRepo',
      method: 'post',
      data
    })
  },
  // 获取作业调度任务名称下拉框
  getTaskParentsName(params) {
    return service({
      url: envURL + '/taskScheduler/getOtherTaskSchedulerList',
      method: 'GET',
      data: params,
    })
  },
  // 获取作业调度删除定时任务
  getDeleteTack(data) {
    return service({
      url: envURL + '/taskScheduler/deleteJob',
      method: 'post',
      data
    })
  },
  // 转换规则配置
  updateJobRepoInfo(data) {
    return service({
      url: envURL + '/jobRuleConfController/updateJobRepoInfo',
      method: 'post',
      data
    })
  },
  // 初始化规则配置
  queryJobRepoInfo(data) {
    return service({
      url: envURL + '/jobRuleConfController/queryJobRepoInfo',
      method: 'post',
      data
    })
  },
  // 获取作业调度变更定时任务状态（启动或停止）
  getTaskStatus(data) {
    return service({
      url: envURL + '/taskScheduler/changeJobStatus',
      method: 'post',
      data
    })
  },
  // 获取作业调度立即执行
  getTaskImmediateDo(data) {
    return service({
      url: envURL + '/taskScheduler/singJobRun',
      method: 'post',
      data
    })
  },
  // 获取数据管理列表
  getList() {
    return service({
      url: dbURL + '/qdsjgl/getList',
      method: 'GET'
    })
  },
  // 保存修改的JSON串
  saveJson(data) {
    return service({
      url: dbURL + '/qdsjgl/saveData',
      method: 'POST',
      data
    })
  },
  // 修改状态
  updateDataStatus(data) {
    return service({
      url: dbURL + '/qdsjgl/updateDataStatus',
      method: 'POST',
      data
    })
  },
  // 数据追溯-作业列表分页查询
  listJobPage(params) {
    return service({
      url: envURL + '/dataTrack/listJobPage',
      method: 'GET',
      data: params,
    })
  },
  // 数据追溯-数据源信息查询
  listJobDataSource(params) {
    return service({
      url: envURL + '/dataTrack/listJobDataSource',
      method: 'GET',
      data: params,
    })
  },
  // 数据追溯-表转换信息查询
  listTableTransferInfoPage(params) {
    return service({
      url: envURL + '/dataTrack/listTableTransferInfoPage',
      method: 'GET',
      data: params,
    })
  },
  //导出项目配置
  exportJobConfig(params) {
    return service({
      url: envURL + '/check/exportJobConfig',
      method: 'GET',
      data: params,
    })
  },
  //删除导入
  removeUpload(data) {
    return service({
      url: envURL + '/check/deleteFileByFileName',
      method: 'POST',
      contentType: 'application/json;charset=UTF-8',
      data
    })
  },
  //删除导入
  getTableInfo(params) {
    return service({
      url: envURL + '/check/dataPrewView',
      method: 'GET',
      data: params,
    })
  },
  //获取当前作业任务下符合条件的表和字段
  getDetailBox(data) {
    return service({
      url: envURL + '/columnConfigController/getTableColumnByJobRepository',
      method: 'post',
      contentType: 'application/json;charset=UTF-8',
      data
    })
  },
  // 数据追溯-表转换异常信息查询
  listTransferExceptionPage(params) {
    return service({
      url: envURL + '/dataTrack/listTransferExceptionPage',
      method: 'GET',
      data: params,
    })
  },
  // 数据追溯-异常信息总览
  listExceptionOverallPage(params) {
    return service({
      url: envURL + '/dataTrack/listExceptionOverallPage',
      method: 'GET',
      data: params,
    })
  },
  // 数据追溯-异常信息总览
  listIllegalDataReport(params) {
    return service({
      url: envURL + '/dataTrack/lookUpIllegalDataByJobReportId',
      method: 'GET',
      data: params,
    })
  },
  //作业配置-单表执行
  startSingleTableJob(params) {
    return service({
      url: envURL + '/taskScheduler/singleSonTaskRun',
      method: 'GET',
      data: params,
    })
  },
  //作业配置-串联执行
  startJobInSeries(params) {
    return service({
      url: envURL + '/taskScheduler/dependencyTaskRun',
      method: 'GET',
      data: params,
    })
  },
  //作业配置-规则列表
  listRuleRepositoryInfoPage(params) {
    return service({
      url: envURL + '/ruleRepositoryInfo/listPage',
      method: 'GET',
      data: params,
    })
  },
  //作业配置-规则类型列表
  listRuleType(params) {
    return service({
      url: envURL + '/ruleRepositoryInfo/listRuleType',
      method: 'GET',
      data: params,
    })
  },
  //作业库表保存
  saveInBatch(data) {
    return service({
      url: envURL + '/jobRepositoryInfoTable/saveInBatch',
      method: 'post',
      contentType: 'application/json;charset=UTF-8',
      stringAry: true,
      data
    })
  },
  //作业库表编辑
  updateInBatch(data) {
    return service({
      url: envURL + '/jobRepositoryInfoTable/update',
      method: 'post',
      data
    })
  },
  //作业库表删除
  deteleInBatch(params) {
    return service({
      url: envURL + '/jobRepositoryInfoTable/delete',
      method: 'get',
      data: params,
    })
  },
  //转换规则保存
  saveRules(data) {
    return service({
      url: envURL + '/ruleRelation/saveInBatch',
      method: 'post',
      contentType: 'application/json;charset=UTF-8',
      stringAry: true,
      data
    })
  },
  //转换规则请求
  getRulesList(params) {
    return service({
      url: envURL + '/ruleRepositoryInfo/listByTableOrField',
      method: 'GET',
      data: params,
    })
  },
  //转换规则删除
  deleteRules(params) {
    return service({
      url: envURL + '/ruleRelation/delete',
      method: 'get',
      data: params,
    })
  },
  //映射关系更新
  ruleRelationUpdate(data) {
    return service({
      url: envURL + '/ruleRelation/update',
      method: 'post',
      data
    })
  },
  // 导出不规则数据报表
  downIllegalDataReport(jobReportIdStr) {
    const elink = document.createElement('a')
    elink.href = envURL + '/dataTrack/exportExcel' + '?' + 'jobReportIdStr=' + jobReportIdStr
    elink.click()
  }
}
