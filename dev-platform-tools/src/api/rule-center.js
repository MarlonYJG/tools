/*
 * @Author: Marlon
 * @Date: 2020-07-25 19:26:58
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-25 10:26:56
 * @Description: 规则中心
 */

import service from 'utils/request'
import API from './public'

const BaseUrl = '/rc'

export default {
    ...API,
    // 获取用户信息
    // 获取规则类型树形结构
    getRuleTypeTreeDic(data) {
        return service({
            url: BaseUrl + '/ruleType/tree/search',
            method: 'get',
            data
        })
    },
    // 获取规则列表
    getRuleList(data) {
        return service({
            url: BaseUrl + '/rule/search',
            method: 'get',
            data
        })
    },
    // 新增规则
    addRule(data) {
        return service({
            url: BaseUrl + '/rule/add',
            method: 'post',
            data
        })
    },
    // 规则详情
    getRuleDetail(data) {
        return service({
            url: BaseUrl + '/rule/detail',
            method: 'get',
            data
        })
    },
    // 编辑规则
    updateRule(data) {
        return service({
            url: BaseUrl + '/rule/update',
            method: 'post',
            data
        })
    },
    // 删除规则
    deleteRule(data) {
        return service({
            url: BaseUrl + '/rule/delete',
            method: 'get',
            data
        })
    },
    // 获取规则参数列表
    getRuleParameterList(data) {
        return service({
            url: BaseUrl + '/ruleParameter/search',
            method: 'get',
            data
        })
    },
    // 获取参数类型字典
    getParaTypeDic(data) {
        return service({
            url: BaseUrl + '/ruleParaType/dict/search',
            method: 'get',
            data
        })
    },
    // 获取显示方式字典
    getDisplayModeDic(data) {
        return service({
            url: BaseUrl + '/displayMode/dict/search',
            method: 'get',
            data
        })
    },
    // 新增规则参数
    addRuleParameter(data) {
        return service({
            url: BaseUrl + '/ruleParameter/add',
            method: 'post',
            data
        })
    },
    // 获取规则参数详情
    getRuleParameterDetail(data) {
        return service({
            url: BaseUrl + '/ruleParameter/detail',
            method: 'get',
            data
        })
    },
    // 编辑参数
    updateRuleParameter(data) {
        return service({
            url: BaseUrl + '/ruleParameter/update',
            method: 'post',
            data
        })
    },
    // 删除参数
    deleteRuleParameter(data) {
        return service({
            url: BaseUrl + '/ruleParameter/delete',
            method: 'get',
            data
        })
    },
    // 规则参数预览
    rulePreview(data) {
        return service({
            url: BaseUrl + '/rule/preview',
            method: 'get',
            data
        })
    },
    // 获取规则类型预览树形结构
    getRuleTypePreviewTree(data) {
        return service({
            url: BaseUrl + '/ruleType/preview/tree/search',
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
    // 根据id获取规则详情
    detailRules(data) {
        return service({
            url: BaseUrl + '/rules/detail',
            method: 'get',
            data
        })
    },
    // 编辑规则
    updateRules(data) {
        return service({
            url: BaseUrl + '/rules/update',
            method: 'post',
            data
        })
    },
    // 逻辑类型-列表
    ruleLogicTypeList(data) {
        return service({
            url: BaseUrl + '/rule/search/ruleLogicType',
            method: 'get',
            data
        })
    },

}