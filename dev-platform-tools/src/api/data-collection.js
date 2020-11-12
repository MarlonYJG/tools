/*
 * @Author: Marlon
 * @Date: 2020-02-24 09:06:54
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 10:26:06
 * @Description: 数据采集
 */
import service from 'utils/request'
import API from './public'

const BaseUrl = '/dc'
const BaseUrl_3 = '/dsm'

export default {
    ...API,
    // 项目列表
    _projectList(data) {
        return service({
            url: BaseUrl + '/project/list',
            method: 'get',
            data
        })
    },
    // 数据源类型列表
    _sourceDataType(data) {
        return service({
            url: BaseUrl + '/dict',
            method: 'get',
            data
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
    // 获取任务列表
    _taskList(data) {
        let projectId = data.projectId || ''
        delete data.projectId
        return service({
            url: BaseUrl + '/task/list/' + projectId,
            method: 'get',
            data
        })
    },
    /* =============风景线================ */
    projectControllerList(data) {
        return service({
            url: BaseUrl + '/project/page',
            method: 'get',
            data
        })
    },
    projectControllerAdd(data) {
        return service({
            url: BaseUrl + '/project',
            method: 'post',
            data
        })
    },
    projectControllerDel(data) {
        return service({
            url: BaseUrl + '/project' + `?id=${data.id}`,
            method: 'delete',
        })
    },
    projectControllerUpdate(data) {
        return service({
            url: BaseUrl + '/project',
            method: 'put',
            data
        })
    },
    // 任务列表
    projectTaskList(data) {
        let projectId = data.projectId || ''
        return service({
            url: BaseUrl + '/task/page/' + projectId,
            method: 'get',
        })
    },
    projectTaskAdd(data) {
        return service({
            url: BaseUrl + '/task',
            method: 'post',
            data
        })
    },
    projectTaskDel(data) {
        return service({
            url: BaseUrl + '/task' + `?id=${data.id}`,
            method: 'DELETE',
        })
    },
    projectTaskUpdate(data) {
        return service({
            url: BaseUrl + '/task',
            method: 'PUT',
            data
        })
    },
    // 任务执行
    projectTaskRun(data) {
        return service({
            url: BaseUrl + '/task/execute',
            method: 'get',
            data
        })
    },
    /* 数据统计 */
    // 统计列表
    statisticsList(data) {
        return service({
            url: BaseUrl + '/statistics/job/list',
            method: 'get',
            data
        })
    },
    // 采集数据表个数
    statisticsInfo(data) {
        return service({
            url: BaseUrl + '/statistics/table/count',
            method: 'get',
            data
        })
    },
    /* 转换规则配置 */
    taskTableList(data) {
        let taskId = data.taskId || ''
        delete data.taskId
        return service({
            url: BaseUrl + '/job/page/' + taskId,
            method: 'get',
            data
        })
    },
    taskTableAdd(data) {
        let taskId = data.taskId || ''
        delete data.taskId
        return service({
            url: BaseUrl + '/job/addList/' + taskId,
            method: 'get',
            data
        })
    },
    taskTableDel(data) {
        return service({
            url: BaseUrl + '/job' + `?id=${data.id}`,
            method: 'DELETE',
        })
    },
    // 保存目标表(批量)
    saveTaskJobs(data) {
        return service({
            url: BaseUrl + '/job/batch',
            method: 'post',
            data
        })
    },
    // 获取数据集
    getCollect(data) {
        return service({
            url: BaseUrl + '/collect',
            method: 'get',
            data
        })
    },
    // 更新数据集
    updateCollect(data) {
        return service({
            url: BaseUrl + '/collect',
            method: 'PUT',
            data
        })
    },
    // 源数据表-获取表列表
    getJobTableList(data) {
        return service({
            url: BaseUrl + '/job/table/list',
            method: 'get',
            data
        })
    },
    // 源数据表-数据预览
    preViewJob(data) {
        return service({
            url: BaseUrl + '/job/preView',
            method: 'POST',
            data
        })
    },
    /* 字段映射 */
    // 获取字段配置
    getFieldConf(data) {
        return service({
            url: BaseUrl + '/jobDetail/add',
            method: 'get',
            data
        })
    },
    // 批量保存字段
    saveField(data) {
        return service({
            url: BaseUrl + '/jobDetail/batch',
            method: 'post',
            data
        })
    },
    // 单个删除字段
    delField(data) {
        return service({
            url: BaseUrl + '/jobDetail',
            method: 'DELETE',
            data
        })
    }
}