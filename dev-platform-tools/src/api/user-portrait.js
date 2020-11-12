/*
 * @Author: Marlon
 * @Date: 2020-05-12 17:02:45
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 10:27:07
 * @Description: 用户画像
 */
import service from 'utils/request'
import API from './public'
// 项目统计
export const BaseUrl = '/profile'
export const BaseUrl_constructionservice = '/constructionservice'
export default {
    ...API,
    // 业务板块\标签更新\标签分类\不等式
    _publicYWBK(data) {
        return service({
            url: BaseUrl + '/dict',
            method: 'get',
            data
        })
    },
    // 标签分组
    _publicTagGroup(data) {
        return service({
            url: BaseUrl + '/labelType/list/tree',
            method: 'get',
            data
        })
    },
    // 标签分类
    _publicTagType(data) {
        return service({
            url: BaseUrl + '/label/list',
            method: 'get',
            data
        })
    },
    // 项目
    _publicProject(data) {
        return service({
            url: BaseUrl + '/project',
            method: 'get',
            data
        })
    },
    // 数据源
    _publicDataSource(data) {
        return service({
            url: BaseUrl + '/datasource',
            method: 'get',
            data
        })
    },
    // 业务板块、数据域、指标(三级)
    _publicSegDomInd(data) {
        return service({
            url: BaseUrl_constructionservice + `/indicatorMap/getSegmentDomainIndicatorTree/${data.projectId}`,
            method: 'get',
        })
    },
    /* *********************** 风景线 ********************************** */
    // 标签定义  新增
    labelDefinitionAdd(data) {
        return service({
            url: BaseUrl + '/labelDetail',
            method: 'post',
            data
        })
    },
    // 标签定义  获取
    labelDefinitionList(data) {
        return service({
            url: BaseUrl + '/labelDetail/page',
            method: 'get',
            data
        })
    },
    // 标签定义  删除
    labelDefinitionDel(data) {
        return service({
            url: BaseUrl + `/labelDetail?id=${data.id}`,
            method: 'DELETE'
        })
    },
    // 标签定义  批量删除
    labelDefinitionDels(data) {
        return service({
            url: BaseUrl + `/labelDetail/list?idList=${data.idList}`,
            method: 'DELETE'
        })
    },
    // 标签定义  修改
    labelDefinitionUpdate(data) {
        return service({
            url: BaseUrl + '/labelDetail',
            method: 'put',
            data
        })
    },
    // 标签定义  查看
    labelDefinitionLook(data) {
        return service({
            url: BaseUrl + '/project/list',
            method: 'get',
            data
        })
    },
    // 标签设置 获取
    labelSetList(data) {
        return service({
            url: BaseUrl + '/labelConfig/page',
            method: 'get',
            data
        })
    },
    // 标签设置 标签列表
    labelSetListItem(data) {
        return service({
            url: BaseUrl + '/labelDetail/page',
            method: 'get',
            data
        })
    },
    // 标签设置 保存
    labelSetSave(data) {
        return service({
            url: BaseUrl + '/labelConfig',
            method: 'put',
            data
        })
    },
    // 标签设置 更新
    labelSetSaveUpdate(data) {
        return service({
            url: BaseUrl + '/labelConfig',
            method: 'PUT',
            data
        })
    },
    // 标签设置 批量删除
    labelSetDels(data) {
        return service({
            url: BaseUrl + `/labelConfig/list?idList=${data.idList}`,
            method: 'DELETE',
        })
    },
    // 标签设置 删除
    labelSetDel(data) {
        return service({
            url: BaseUrl + `/labelConfig?id=${data.id}`,
            method: 'DELETE',
        })
    },
    // 标签设置 表格预览
    labelSetTableView(data) {
        return service({
            url: BaseUrl + '/metadata/table/list',
            method: 'get',
            data
        })
    },
    // 标签设置 表格预览-查看
    labelSetTableViewLook(data) {
        return service({
            url: BaseUrl + '/metadata/column/list',
            method: 'get',
            data
        })
    },
    //  标签设置 标签更新-批量
    labelSetupdateBatches(data) {
        return service({
            url: BaseUrl + '/labelConfig/list',
            method: 'put',
            data
        })
    },
    // 复杂标签 派生指标
    labelSetDerivedIndex(data) {
        return service({
            url: BaseUrl_constructionservice + `/indicatorMap/complex/list`,
            method: 'post',
            data
        })
    },
    // 复杂标签 维度
    labelSetDerivedIndexId(data) {
        return service({
            url: BaseUrl_constructionservice + `/dimension/getDimensionTree/${data.domainId}`,
            method: 'get',
        })
    },
    // 复杂标签 时间
    labelSetDerivedIndexTime(data) {
        return service({
            url: BaseUrl_constructionservice + `/data-period/getTimeModifier`,
            method: 'get',
        })
    },
    // 复杂标签 保存
    labelSetDerivedIndexSave(data) {
        return service({
            url: BaseUrl + `/labelConfig`,
            method: 'post',
            data
        })
    },
    // 复杂标签 编辑 获取规则配置列表
    labelSetDerivedIndexRulesList(data) {
        return service({
            url: BaseUrl + `/labelConfig`,
            method: 'get',
            data
        })
    }
}